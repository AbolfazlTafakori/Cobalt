using System.Text.Json.Nodes;

namespace ResumeAPI;

// ---- Auth DTOs ----
public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

// ---- Upload response ----
public record UploadResponse(string Filename);

// The admin credentials persisted to disk (password stored as a PBKDF2 hash).
public class AdminAccount
{
    public string Username { get; set; } = "admin";
    public string PasswordHash { get; set; } = "";
}

// Wrapper for the collection endpoints (skills/projects/education/experience/socials).
// Each item is a free-form JSON object that always carries an integer "id".
public class CollectionItem
{
    public int Id { get; set; }
    public JsonObject Data { get; set; } = new();
}
