using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeePortal.Api.Entities;

// Maps to the [LeaveRequestDetails] table — per-leave-type breakdown of a request.
public class LeaveRequestDetail
{
    [Key]
    public int DetailId { get; set; }

    public int LeaveRequestId { get; set; }

    public int LeaveTypeId { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal DaysUsed { get; set; }

    [ForeignKey(nameof(LeaveRequestId))]
    public LeaveRequest? LeaveRequest { get; set; }
}
