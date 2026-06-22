using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeePortal.Api.Entities;

// Maps to the [Employees] table. EF Core Code-First will create/maintain this table.
public class Employee
{
    [Key]
    public int EmployeeId { get; set; }

    [MaxLength(10)]
    public string EmployeeCode { get; set; } = string.Empty;

    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Department { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Designation { get; set; } = string.Empty;

    [Column(TypeName = "date")]
    public DateTime DateOfJoining { get; set; }

    [MaxLength(20)]
    public string EmploymentType { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Status { get; set; } = "Active";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // 1 = Admin, 2 = Employee
    public int RoleId { get; set; }

    // Stored as a BCrypt hash (NOT plaintext like the legacy DB)
    [MaxLength(200)]
    public string Password { get; set; } = string.Empty;
}
