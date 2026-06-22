using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeePortal.Api.Entities;

// Maps to the [LeaveTypes] table (e.g. CL = Casual Leave, SL = Sick Leave, LOP = Loss of Pay).
public class LeaveType
{
    [Key]
    public int LeaveTypeId { get; set; }

    [MaxLength(10)]
    public string LeaveCode { get; set; } = string.Empty;

    [MaxLength(50)]
    public string LeaveName { get; set; } = string.Empty;

    [Column(TypeName = "decimal(5,2)")]
    public decimal? AnnualLimit { get; set; }
}
