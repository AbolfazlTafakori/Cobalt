using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ResumeAPI;

public class TokenService
{
    private readonly SymmetricSecurityKey _key;
    private readonly string _issuer;
    private readonly string _audience;

    public TokenService(IConfiguration config)
    {
        var secret = config["Jwt:Secret"]
            ?? "dev-only-super-secret-change-me-please-32bytes-minimum!!";
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        _issuer = config["Jwt:Issuer"] ?? "ResumeAPI";
        _audience = config["Jwt:Audience"] ?? "ResumeAPI";
    }

    public SymmetricSecurityKey Key => _key;
    public string Issuer => _issuer;
    public string Audience => _audience;

    public string Create(string username)
    {
        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(ClaimTypes.Name, username),
        };
        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
