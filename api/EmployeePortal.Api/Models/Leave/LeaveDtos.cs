namespace EmployeePortal.Api.Models.Leave;

// Apply for leave.
public class ApplyLeaveRequest
{
    public int EmployeeId { get; set; }
    public int LeaveTypeId { get; set; }
    public string FromDate { get; set; } = string.Empty; // yyyy-MM-dd
    public string ToDate { get; set; } = string.Empty;   // yyyy-MM-dd
    public string DayType { get; set; } = "Full";        // Full / Half
}

// Approve / reject a leave request.
public class LeaveActionRequest
{
    public string Status { get; set; } = string.Empty;   // Approved / Rejected
    public string? ApprovedBy { get; set; }
}

// Leave request returned to the frontend (with friendly names).
public class LeaveResponse
{
    public int LeaveRequestId { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public int LeaveTypeId { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;
    public string FromDate { get; set; } = string.Empty;
    public string ToDate { get; set; } = string.Empty;
    public string DayType { get; set; } = string.Empty;
    public decimal TotalDays { get; set; }
    public string Status { get; set; } = string.Empty;
    public string AppliedDate { get; set; } = string.Empty;
}

// Remaining leave balance per type.
public class LeaveBalanceResponse
{
    public int LeaveTypeId { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;
    public decimal TotalAllowed { get; set; }
    public decimal Used { get; set; }
    public decimal Remaining { get; set; }
}
