using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeePortal.Api.Entities;

// Maps to the [EmployeeLeaveBalance] table — remaining leave per employee/type/year.
public class EmployeeLeaveBalance
{
    [Key]
    public int BalanceId { get; set; }

    public int EmployeeId { get; set; }

    public int LeaveTypeId { get; set; }

    public int Year { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal TotalAllowed { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal Used { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal Remaining { get; set; }

    [ForeignKey(nameof(EmployeeId))]
    public Employee? Employee { get; set; }

    [ForeignKey(nameof(LeaveTypeId))]
    public LeaveType? LeaveType { get; set; }
}
