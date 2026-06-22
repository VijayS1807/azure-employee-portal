using EmployeePortal.Api.Auth;
using EmployeePortal.Api.Data;
using EmployeePortal.Api.Models.Auth;
using EmployeePortal.Api.Models.Common;
using Microsoft.EntityFrameworkCore;

namespace EmployeePortal.Api.Services;

public interface IAuthService
{
    Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IJwtTokenGenerator _jwt;

    public AuthService(AppDbContext db, IJwtTokenGenerator jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return ApiResponse<LoginResponse>.Fail("Username and password are required", 400);

        // Username = Email (matches legacy behaviour).
        var employee = await _db.Employees
            .FirstOrDefaultAsync(e => e.Email == request.Username && e.Status == "Active");

        // Verify the BCrypt-hashed password.
        if (employee is null || !BCrypt.Net.BCrypt.Verify(request.Password, employee.Password))
            return ApiResponse<LoginResponse>.Fail("Invalid username or password", 403);

        var response = new LoginResponse
        {
            Token = _jwt.GenerateToken(employee),
            EmployeeId = employee.EmployeeId,
            RoleId = employee.RoleId,
            FullName = employee.FullName,
            Email = employee.Email,
            RoleName = employee.RoleId == 1 ? "Admin" : "Employee"
        };

        return ApiResponse<LoginResponse>.Ok(response, "Login successful");
    }
}
