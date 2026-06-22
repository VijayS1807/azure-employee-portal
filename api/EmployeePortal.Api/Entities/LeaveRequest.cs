using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeePortal.Api.Entities;

// Maps to the [LeaveRequests] table — one row per leave application.
public class LeaveRequest
{
    [Key]
    public int LeaveRequestId { get; set; }

    public int EmployeeId { get; set; }

    [Column(TypeName = "date")]
    public DateTime FromDate { get; set; }

    [Column(TypeName = "date")]
    public DateTime ToDate { get; set; }

    public int LeaveTypeId { get; set; }

    [MaxLength(10)]
    public string DayType { get; set; } = "Full";   // Full / Half

    [Column(TypeName = "decimal(5,2)")]
    public decimal TotalDays { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "Pending";  // Pending / Approved / Rejected

    public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

    public DateTime? ApprovedDate { get; set; }

    [MaxLength(50)]
    public string? ApprovedBy { get; set; }

    // Navigation properties (EF Core uses these to understand relationships)
    [ForeignKey(nameof(EmployeeId))]
    public Employee? Employee { get; set; }

    [ForeignKey(nameof(LeaveTypeId))]
    public LeaveType? LeaveType { get; set; }
}
