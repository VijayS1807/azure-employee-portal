using EmployeePortal.Api.Data;
using EmployeePortal.Api.Entities;
using EmployeePortal.Api.Models.Common;
using EmployeePortal.Api.Models.Employee;
using Microsoft.EntityFrameworkCore;

namespace EmployeePortal.Api.Services;

public interface IEmployeeService
{
    Task<ApiResponse<PaginatedResponse<EmployeeResponse>>> GetEmployeesAsync(PaginationRequest pagination);
    Task<ApiResponse<EmployeeResponse>> GetByIdAsync(int id);
    Task<ApiResponse<EmployeeResponse>> CreateOrUpdateAsync(CreateEmployeeRequest request);
    Task<ApiResponse<string>> UpdateStatusAsync(int id, string status);
    Task<ApiResponse<EmployeeResponse>> UpdatePhotoAsync(int id, IFormFile file, IBlobService blob);
}

public class EmployeeService : IEmployeeService
{
    private readonly AppDbContext _db;

    public EmployeeService(AppDbContext db) => _db = db;

    public async Task<ApiResponse<PaginatedResponse<EmployeeResponse>>> GetEmployeesAsync(PaginationRequest p)
    {
        var query = _db.Employees.AsQueryable();

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim();
            query = query.Where(e =>
                e.FullName.Contains(s) ||
                e.Email.Contains(s) ||
                e.EmployeeCode.Contains(s) ||
                e.Department.Contains(s));
        }

        // Dynamic sort (whitelist columns to avoid invalid input).
        bool desc = p.SortOrder.Equals("DESC", StringComparison.OrdinalIgnoreCase);
        query = p.SortBy.ToLower() switch
        {
            "fullname" => desc ? query.OrderByDescending(e => e.FullName) : query.OrderBy(e => e.FullName),
            "email" => desc ? query.OrderByDescending(e => e.Email) : query.OrderBy(e => e.Email),
            "department" => desc ? query.OrderByDescending(e => e.Department) : query.OrderBy(e => e.Department),
            _ => desc ? query.OrderByDescending(e => e.EmployeeId) : query.OrderBy(e => e.EmployeeId)
        };

        var total = await query.CountAsync();

        var employees = await query
            .Skip((p.PageNumber - 1) * p.PageSize)
            .Take(p.PageSize)
            .Select(e => ToResponse(e))
            .ToListAsync();

        var result = new PaginatedResponse<EmployeeResponse>
        {
            Data = employees,
            TotalRecords = total,
            TotalPages = (int)Math.Ceiling(total / (double)p.PageSize),
            CurrentPage = p.PageNumber,
            PageSize = p.PageSize
        };

        return ApiResponse<PaginatedResponse<EmployeeResponse>>.Ok(result, "Employees fetched successfully");
    }

    public async Task<ApiResponse<EmployeeResponse>> GetByIdAsync(int id)
    {
        var e = await _db.Employees.FindAsync(id);
        return e is null
            ? ApiResponse<EmployeeResponse>.Fail("Employee not found", 404)
            : ApiResponse<EmployeeResponse>.Ok(ToResponse(e), "Employee fetched successfully");
    }

    public async Task<ApiResponse<EmployeeResponse>> CreateOrUpdateAsync(CreateEmployeeRequest r)
    {
        DateTime.TryParse(r.DateOfJoining, out var doj);

        // Update path
        if (r.EmployeeId is > 0)
        {
            var existing = await _db.Employees.FindAsync(r.EmployeeId.Value);
            if (existing is null)
                return ApiResponse<EmployeeResponse>.Fail("Employee not found", 404);

            existing.FullName = r.FullName;
            existing.Email = r.Email;
            existing.Department = r.Department;
            existing.Designation = r.Designation;
            existing.DateOfJoining = doj;
            existing.EmploymentType = r.EmploymentType;
            existing.Status = r.Status ?? existing.Status;
            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return ApiResponse<EmployeeResponse>.Ok(ToResponse(existing), "Employee updated successfully");
        }

        // Create path — block duplicate email
        if (await _db.Employees.AnyAsync(e => e.Email == r.Email))
            return ApiResponse<EmployeeResponse>.Fail("An employee with this email already exists", 400);

        var employee = new Employee
        {
            EmployeeCode = string.IsNullOrWhiteSpace(r.EmployeeCode)
                ? await GenerateEmployeeCodeAsync()
                : r.EmployeeCode!,
            FullName = r.FullName,
            Email = r.Email,
            Department = r.Department,
            Designation = r.Designation,
            DateOfJoining = doj,
            EmploymentType = r.EmploymentType,
            Status = r.Status ?? "Active",
            RoleId = 2, // default new employees to "Employee"
            Password = BCrypt.Net.BCrypt.HashPassword(
                string.IsNullOrWhiteSpace(r.Password) ? "Temp@123" : r.Password),
            CreatedAt = DateTime.UtcNow
        };

        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();
        return ApiResponse<EmployeeResponse>.Ok(ToResponse(employee), "Employee created successfully", 201);
    }

    public async Task<ApiResponse<string>> UpdateStatusAsync(int id, string status)
    {
        var e = await _db.Employees.FindAsync(id);
        if (e is null) return ApiResponse<string>.Fail("Employee not found", 404);

        e.Status = status;
        e.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return ApiResponse<string>.Ok("OK", "Employee status updated successfully");
    }

    public async Task<ApiResponse<EmployeeResponse>> UpdatePhotoAsync(int id, IFormFile file, IBlobService blob)
    {
        var e = await _db.Employees.FindAsync(id);
        if (e is null) return ApiResponse<EmployeeResponse>.Fail("Employee not found", 404);

        // Delete old photo from blob if one exists
        if (!string.IsNullOrEmpty(e.ProfilePhotoUrl))
            await blob.DeleteAsync(e.ProfilePhotoUrl, "profile-photos");

        e.ProfilePhotoUrl = await blob.UploadAsync(file, "profile-photos");
        e.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return ApiResponse<EmployeeResponse>.Ok(ToResponse(e), "Profile photo updated successfully");
    }

    private async Task<string> GenerateEmployeeCodeAsync()
    {
        var count = await _db.Employees.CountAsync();
        return $"EMP{(count + 1):D5}";
    }

    private static EmployeeResponse ToResponse(Employee e) => new()
    {
        EmployeeId = e.EmployeeId,
        EmployeeCode = e.EmployeeCode,
        FullName = e.FullName,
        Email = e.Email,
        Department = e.Department,
        Designation = e.Designation,
        DateOfJoining = e.DateOfJoining.ToString("yyyy-MM-dd"),
        EmploymentType = e.EmploymentType,
        Status = e.Status,
        ProfilePhotoUrl = e.ProfilePhotoUrl
    };
}
