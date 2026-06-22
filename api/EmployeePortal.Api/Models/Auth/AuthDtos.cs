namespace EmployeePortal.Api.Models.Auth;

// Login input — "username" is the employee's email (matches legacy SP_LoginUser).
public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

// Login output — includes the JWT token the frontend stores.
public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public int EmployeeId { get; set; }
    public int RoleId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
}
