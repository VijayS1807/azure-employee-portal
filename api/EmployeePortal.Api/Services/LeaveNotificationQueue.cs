using System.Text.Json;
using Azure.Storage.Queues;
using Azure.Storage.Queues.Models;

namespace EmployeePortal.Api.Services;

// Shape of the message placed on the queue.
// Must match what EmployeePortal.Functions.Models.LeaveNotificationMessage expects.
public record LeaveNotificationMessage(
    int LeaveRequestId,
    int EmployeeId,
    string EmployeeName,
    string EmployeeEmail,
    string LeaveType,
    string Status,
    string FromDate,
    string ToDate,
    decimal TotalDays
);

public interface ILeaveNotificationQueue
{
    Task EnqueueAsync(LeaveNotificationMessage message);
}

public class LeaveNotificationQueue : ILeaveNotificationQueue
{
    private readonly QueueClient _queue;
    private readonly ILogger<LeaveNotificationQueue> _logger;

    public LeaveNotificationQueue(IConfiguration config, ILogger<LeaveNotificationQueue> logger)
    {
        _logger = logger;

        // Reuse the same storage account as Blob Storage.
        var connStr = config.GetConnectionString("BlobStorage");

        // Base64 encoding is required — the Functions Queue trigger expects it.
        _queue = new QueueClient(connStr, "leave-notifications",
            new QueueClientOptions { MessageEncoding = QueueMessageEncoding.Base64 });
    }

    public async Task EnqueueAsync(LeaveNotificationMessage message)
    {
        try
        {
            // Creates the queue if it doesn't exist yet (safe to call every time).
            await _queue.CreateIfNotExistsAsync();

            var json = JsonSerializer.Serialize(message);
            await _queue.SendMessageAsync(json);

            _logger.LogInformation(
                "LeaveNotification queued for {Name} — Leave #{Id} {Status}.",
                message.EmployeeName, message.LeaveRequestId, message.Status);
        }
        catch (Exception ex)
        {
            // Queue failure must not block the leave approval — log and continue.
            _logger.LogError(ex, "Failed to enqueue leave notification for Leave #{Id}.", message.LeaveRequestId);
        }
    }
}
