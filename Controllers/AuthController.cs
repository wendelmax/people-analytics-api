using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PeopleAnalytics.Api.Models;
using PeopleAnalytics.Api.Services;

namespace PeopleAnalytics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;

    public AuthController(AuthService auth) => _auth = auth;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _auth.LoginAsync(request.Email, request.Password);
        if (result == null)
            return Unauthorized(new { message = "Credenciais invalidas" });
        return Ok(result);
    }
}
