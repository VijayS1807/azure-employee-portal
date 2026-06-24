using System.ComponentModel.DataAnnotations;

namespace EmployeePortal.Functions.Entities;

public class Employee
{
    [Key]
    public int EmployeeId { get; set; }

    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
}
