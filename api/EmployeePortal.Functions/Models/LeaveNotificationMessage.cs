namespace EmployeePortal.Functions.Models;

// Serialised as JSON and placed on the "leave-notifications" Azure Storage Queue
// by the main API when a leave request is approved or rejected.
// The LeaveNotificationFunction deserialises and processes it.
public record LeaveNotificationMessage(
    int LeaveRequestId,
    int EmployeeId,
    string EmployeeName,
    string EmployeeEmail,
    string LeaveType,
    string Status,         // "Approved" or "Rejected"
    string FromDate,
    string ToDate,
    decimal TotalDays
);
