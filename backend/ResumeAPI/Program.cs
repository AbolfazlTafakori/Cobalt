using System.IO.Compression;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ResumeAPI;

var builder = WebApplication.CreateBuilder(args);

// ---- Services ----
builder.Services.AddSingleton<DataStore>();

// CORS: allow the Vite dev server (5173) and the local preview.
const string CorsPolicy = "spa";
builder.Services.AddCors(o => o.AddPolicy(CorsPolicy, p =>
    p.WithOrigins(
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4173")
        .AllowAnyHeader()
        .AllowAnyMethod()));

// JWT bearer auth — the signing key comes from TokenService so config stays in one place.
var tokenService = new TokenService(builder.Configuration);
builder.Services.AddSingleton(tokenService);
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = tokenService.Issuer,
            ValidAudience = tokenService.Audience,
            IssuerSigningKey = tokenService.Key,
            ClockSkew = TimeSpan.FromMinutes(1),
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

// Force the store to initialise (seed files) at startup.
_ = app.Services.GetRequiredService<DataStore>();

app.UseCors(CorsPolicy);
app.UseAuthentication();
app.UseAuthorization();

var api = app.MapGroup("/api");

// ============================================================
//  Auth
// ============================================================
api.MapPost("/auth/login", (LoginRequest req, DataStore db, TokenService tokens) =>
{
    var account = db.GetAccount();
    var ok = string.Equals(req.Username, account.Username, StringComparison.OrdinalIgnoreCase)
             && PasswordHasher.Verify(req.Password, account.PasswordHash);
    if (!ok) return Results.Unauthorized();
    return Results.Ok(new LoginResponse(tokens.Create(account.Username)));
});

api.MapPost("/auth/change-password", (ChangePasswordRequest req, DataStore db) =>
{
    var account = db.GetAccount();
    if (!PasswordHasher.Verify(req.CurrentPassword, account.PasswordHash))
        return Results.BadRequest(new { message = "Current password is incorrect" });
    if (string.IsNullOrWhiteSpace(req.NewPassword) || req.NewPassword.Length < 4)
        return Results.BadRequest(new { message = "New password is too short" });

    account.PasswordHash = PasswordHasher.Hash(req.NewPassword);
    db.SaveAccount(account);
    return Results.NoContent();
}).RequireAuthorization();

// ============================================================
//  Site content document (single source of truth for the site)
// ============================================================
api.MapGet("/content", (DataStore db) => Results.Ok(db.GetContent()));

api.MapPut("/content", (JsonNode body, DataStore db) =>
{
    db.SaveContent(body);
    return Results.Ok(body);
}).RequireAuthorization();

// ============================================================
//  Profile & site texts (sub-objects of the content document)
// ============================================================
api.MapGet("/profile", (DataStore db) => Results.Ok(db.GetSection("profile")))
    .RequireAuthorization();
api.MapPut("/profile", (JsonObject patch, DataStore db) =>
    Results.Ok(db.MergeSection("profile", patch)))
    .RequireAuthorization();

api.MapGet("/sitetexts", (DataStore db) => Results.Ok(db.GetSection("texts")))
    .RequireAuthorization();
api.MapPut("/sitetexts", (JsonObject body, DataStore db) =>
{
    db.ReplaceSection("texts", body);
    return Results.Ok(body);
}).RequireAuthorization();

// ============================================================
//  Legacy collections: skills / projects / education / experience / socials
// ============================================================
string[] collections = ["skills", "projects", "education", "experience", "socials"];
foreach (var name in collections)
{
    var group = api.MapGroup($"/{name}");
    group.MapGet("", (DataStore db) => Results.Ok(db.GetCollection(name)));
    group.MapPost("", (JsonObject body, DataStore db) =>
        Results.Ok(db.AddToCollection(name, body))).RequireAuthorization();
    group.MapPut("/{id:int}", (int id, JsonObject body, DataStore db) =>
    {
        var updated = db.UpdateInCollection(name, id, body);
        return updated is null ? Results.NotFound() : Results.Ok(updated);
    }).RequireAuthorization();
    group.MapDelete("/{id:int}", (int id, DataStore db) =>
        db.RemoveFromCollection(name, id) ? Results.NoContent() : Results.NotFound())
        .RequireAuthorization();
}

// ============================================================
//  File uploads
// ============================================================
api.MapPost("/upload", async (HttpRequest request, DataStore db) =>
{
    if (!request.HasFormContentType)
        return Results.BadRequest(new { message = "Expected multipart/form-data" });

    var form = await request.ReadFormAsync();
    var file = form.Files["file"] ?? form.Files.FirstOrDefault();
    if (file is null || file.Length == 0)
        return Results.BadRequest(new { message = "No file provided" });

    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
    string[] allowed = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".pdf"];
    if (!allowed.Contains(ext))
        return Results.BadRequest(new { message = $"Unsupported file type: {ext}" });

    var filename = $"{Guid.NewGuid():N}{ext}";
    var path = Path.Combine(db.UploadsDir, filename);
    await using (var stream = File.Create(path))
        await file.CopyToAsync(stream);

    return Results.Ok(new UploadResponse(filename));
}).RequireAuthorization().DisableAntiforgery();

// Public: serve an uploaded file by name.
api.MapGet("/uploads/{filename}", (string filename, DataStore db) =>
{
    // Guard against path traversal — only a bare filename is allowed.
    if (filename.Contains('/') || filename.Contains('\\') || filename.Contains(".."))
        return Results.BadRequest();

    var path = Path.Combine(db.UploadsDir, filename);
    if (!File.Exists(path)) return Results.NotFound();

    return Results.File(path, GetContentType(filename));
});

// ============================================================
//  Backup / restore (zip of content.json + collections + uploads)
// ============================================================
api.MapGet("/backup", (DataStore db) =>
{
    using var ms = new MemoryStream();
    using (var zip = new ZipArchive(ms, ZipArchiveMode.Create, leaveOpen: true))
    {
        zip.CreateEntryFromFile(db.ContentFile, "content.json");

        var collectionsPath = Path.Combine(db.DataDir, "collections.json");
        if (File.Exists(collectionsPath))
            zip.CreateEntryFromFile(collectionsPath, "collections.json");

        foreach (var file in Directory.GetFiles(db.UploadsDir))
            zip.CreateEntryFromFile(file, $"uploads/{Path.GetFileName(file)}");
    }

    var stamp = DateTime.UtcNow.ToString("yyyy-MM-dd-HH-mm-ss");
    return Results.File(ms.ToArray(), "application/zip", $"resume-backup-{stamp}.zip");
}).RequireAuthorization();

api.MapPost("/restore", async (HttpRequest request, DataStore db) =>
{
    if (!request.HasFormContentType)
        return Results.BadRequest(new { message = "Expected multipart/form-data" });

    var form = await request.ReadFormAsync();
    var file = form.Files["file"] ?? form.Files.FirstOrDefault();
    if (file is null || file.Length == 0)
        return Results.BadRequest(new { message = "No backup file provided" });

    await using var stream = file.OpenReadStream();
    using var zip = new ZipArchive(stream, ZipArchiveMode.Read);

    var contentEntry = zip.GetEntry("content.json");
    if (contentEntry is null)
        return Results.BadRequest(new { message = "Backup missing content.json" });

    using (var reader = new StreamReader(contentEntry.Open()))
        db.RestoreContentRaw(await reader.ReadToEndAsync());

    var collectionsEntry = zip.GetEntry("collections.json");
    if (collectionsEntry is not null)
        collectionsEntry.ExtractToFile(Path.Combine(db.DataDir, "collections.json"), overwrite: true);

    foreach (var entry in zip.Entries)
    {
        if (!entry.FullName.StartsWith("uploads/", StringComparison.Ordinal)) continue;
        if (string.IsNullOrEmpty(entry.Name)) continue; // directory entry
        var dest = Path.Combine(db.UploadsDir, Path.GetFileName(entry.Name));
        entry.ExtractToFile(dest, overwrite: true);
    }

    return Results.NoContent();
}).RequireAuthorization().DisableAntiforgery();

app.MapGet("/", () => "ResumeAPI is running. See /api/*");

app.Run();

static string GetContentType(string filename) => Path.GetExtension(filename).ToLowerInvariant() switch
{
    ".png" => "image/png",
    ".jpg" or ".jpeg" => "image/jpeg",
    ".gif" => "image/gif",
    ".webp" => "image/webp",
    ".svg" => "image/svg+xml",
    ".pdf" => "application/pdf",
    _ => "application/octet-stream",
};
