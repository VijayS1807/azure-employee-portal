using EmployeePortal.Functions.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EmployeePortal.Functions.Functions;

public class AutoCancelLeaveFunction
{
    private readonly FunctionsDbContext _db;
    private readonly ILogger<AutoCancelLeaveFunction> _logger;

    public AutoCancelLeaveFunction(FunctionsDbContext db, ILogger<AutoCancelLeaveFunction> logger)
    {
        _db = db;
        _logger = logger;
    }

    // Runs every day at 23:59 (11:59 PM).
    // CRON format for Functions: {second} {minute} {hour} {day} {month} {day-of-week}
    // "0 59 23 * * *" = at second 0, minute 59, hour 23, every day.
    [Function("AutoCancelPendingLeave")]
    public async Task Run([TimerTrigger("0 59 23 * * *")] TimerInfo timer)
    {
        var tomorrow = DateTime.Today.AddDays(1).Date;

        // Find all leave requests that:
        //   1. Start tomorrow (employee can't wait any longer)
        //   2. Are still Pending (manager never responded)
        var toCancel = await _db.LeaveRequests
            .Where(l => l.Status == "Pending" && l.FromDate.Date == tomorrow)
            .Include(l => l.Employee)
            .ToListAsync();

        if (toCancel.Count == 0)
        {
            _logger.LogInformation("AutoCancelPendingLeave: No pending requests starting on {Date}.", tomorrow.ToString("yyyy-MM-dd"));
            return;
        }

        foreach (var leave in toCancel)
        {
            leave.Status = "AutoCancelled";
            _logger.LogInformation(
                "Auto-cancelled leave #{Id} for {Name} (EmployeeId: {EmpId}) — was starting {Date}.",
                leave.LeaveRequestId, leave.Employee?.FullName ?? "Unknown",
                leave.EmployeeId, tomorrow.ToString("yyyy-MM-dd"));
        }

        await _db.SaveChangesAsync();

        _logger.LogInformation("AutoCancelPendingLeave: Cancelled {Count} request(s).", toCancel.Count);
    }
}
