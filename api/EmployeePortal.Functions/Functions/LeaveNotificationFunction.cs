using System.Text.Json;
using EmployeePortal.Functions.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace EmployeePortal.Functions.Functions;

public class LeaveNotificationFunction
{
    private readonly ILogger<LeaveNotificationFunction> _logger;

    public LeaveNotificationFunction(ILogger<LeaveNotificationFunction> logger)
    {
        _logger = logger;
    }

    // Triggered whenever a message arrives in the "leave-notifications"
    // Azure Storage Queue. The main API enqueues a message here after
    // a manager approves or rejects a leave request.
    //
    // Azure Storage Queues automatically create the queue if it doesn't exist.
    // Connection = "AzureWebJobsStorage" is the default storage connection —
    // already set in local.settings.json and in the Function App settings in Azure.
    [Function("ProcessLeaveNotification")]
    public void Run(
        [QueueTrigger("leave-notifications", Connection = "AzureWebJobsStorage")] string messageJson)
    {
        var msg = JsonSerializer.Deserialize<LeaveNotificationMessage>(messageJson,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (msg is null)
        {
            _logger.LogWarning("LeaveNotification: Received an empty or unreadable message.");
            return;
        }

        // In a real system you would call SendGrid / SMTP / Teams webhook here.
        // For now we simulate it with a structured log entry.
        _logger.LogInformation(
            "NOTIFICATION → {Email} | Hi {Name}, your {LeaveType} leave " +
            "({From} to {To}, {Days} day(s)) has been {Status}.",
            msg.EmployeeEmail, msg.EmployeeName, msg.LeaveType,
            msg.FromDate, msg.ToDate, msg.TotalDays, msg.Status);
    }
}
