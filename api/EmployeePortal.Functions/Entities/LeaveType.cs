using System.ComponentModel.DataAnnotations;

namespace EmployeePortal.Functions.Entities;

public class LeaveType
{
    [Key]
    public int LeaveTypeId { get; set; }

    [MaxLength(50)]
    public string LeaveName { get; set; } = string.Empty;
}
