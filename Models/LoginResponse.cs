namespace PeopleAnalytics.Api.Models;

public class LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public UserInfo User { get; set; } = null!;
}

public class UserInfo
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = "EMPLOYEE";
}
