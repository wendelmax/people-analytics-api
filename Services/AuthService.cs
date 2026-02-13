using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PeopleAnalytics.Api.Data;
using PeopleAnalytics.Api.Models;

namespace PeopleAnalytics.Api.Services;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<LoginResponse?> LoginAsync(string email, string _)
    {
        var employee = await _db.Employees
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Email == email);
        if (employee == null)
            return null;

        var admin = await _db.Admins.AsNoTracking().FirstOrDefaultAsync(a => a.EmployeeId == employee.Id);
        var role = "EMPLOYEE";
        if (admin != null)
            role = admin.Role switch
            {
                "SUPER_ADMIN" => "SUPER_ADMIN",
                "ORG_ADMIN" => "ADMIN",
                "HR_ADMIN" => "HR_MANAGER",
                _ => role
            };
        else if (employee.ManagerId != null)
            role = "MANAGER";

        var secret = _config["Jwt:Secret"] ?? Environment.GetEnvironmentVariable("JWT_SECRET") ?? "dev-secret-change-in-production";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
            new Claim("id", employee.Id.ToString()),
            new Claim(ClaimTypes.Email, employee.Email),
            new Claim(ClaimTypes.Role, role)
        };
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );
        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        return new LoginResponse
        {
            AccessToken = accessToken,
            Token = accessToken,
            User = new UserInfo
            {
                Id = employee.Id,
                Email = employee.Email,
                Name = employee.Name,
                Role = role
            }
        };
    }
}
