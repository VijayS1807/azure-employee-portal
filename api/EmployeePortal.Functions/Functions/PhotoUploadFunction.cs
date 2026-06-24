using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace EmployeePortal.Functions.Functions;

public class PhotoUploadFunction
{
    private readonly ILogger<PhotoUploadFunction> _logger;

    public PhotoUploadFunction(ILogger<PhotoUploadFunction> logger)
    {
        _logger = logger;
    }

    // Triggered automatically whenever a file is uploaded to the
    // "profile-photos" container in Azure Blob Storage.
    // {name} is a route binding — it captures the blob's file name.
    // Connection = "BlobStorage" tells the runtime to look for a
    // setting named "BlobStorage" in local.settings.json (locally)
    // or App Settings (in Azure).
    [Function("LogPhotoUpload")]
    public void Run(
        [BlobTrigger("profile-photos/{name}", Connection = "BlobStorage")] Stream blobStream,
        string name)
    {
        var extension = Path.GetExtension(name).ToLowerInvariant();
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

        if (!allowedExtensions.Contains(extension))
        {
            _logger.LogWarning("PhotoUpload: Unexpected file type uploaded — {Name} ({Ext}). Only images expected.", name, extension);
            return;
        }

        _logger.LogInformation(
            "PhotoUpload: {Name} | Size: {Size:N0} bytes | Type: {Ext}",
            name, blobStream.Length, extension);
    }
}
