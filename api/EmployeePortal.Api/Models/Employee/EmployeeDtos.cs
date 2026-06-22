namespace EmployeePortal.Api.Models.Employee;

// Create/Update employee request. EmployeeId null/0 = create, > 0 = update.
public class CreateEmployeeRequest
{
    public int? EmployeeId { get; set; }
    public string? EmployeeCode { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string DateOfJoining { get; set; } = string.Empty; // yyyy-MM-dd
    public string EmploymentType { get; set; } = string.Empty;
    public string? Status { get; set; } = "Active";
    public string? Password { get; set; }   // optional on create; defaulted if empty
}

// Employee data returned to the frontend.
public class EmployeeResponse
{
    public int EmployeeId { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string DateOfJoining { get; set; } = string.Empty;
    public string EmploymentType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ProfilePhotoUrl { get; set; }
}

public class UpdateEmployeeStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
