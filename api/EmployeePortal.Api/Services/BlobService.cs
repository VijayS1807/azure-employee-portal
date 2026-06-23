using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace EmployeePortal.Api.Services;

public interface IBlobService
{
    Task<string> UploadAsync(IFormFile file, string containerName);
    Task DeleteAsync(string blobUrl, string containerName);
}

public class BlobService : IBlobService
{
    private readonly string? _connectionString;
    private BlobServiceClient? _client;

    public BlobService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("BlobStorage");
    }

    private BlobServiceClient Client =>
        _client ??= !string.IsNullOrEmpty(_connectionString)
            ? new BlobServiceClient(_connectionString)
            : throw new InvalidOperationException(
                "BlobStorage connection string is not configured. Add it to appsettings or Azure App Service connection strings.");

    public async Task<string> UploadAsync(IFormFile file, string containerName)
    {
        var container = Client.GetBlobContainerClient(containerName);

        // Unique file name: guid + original extension (prevents overwrites)
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var blobName = $"{Guid.NewGuid()}{ext}";

        var blob = container.GetBlobClient(blobName);

        using var stream = file.OpenReadStream();
        await blob.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });

        return blob.Uri.ToString();
    }

    public async Task DeleteAsync(string blobUrl, string containerName)
    {
        var uri = new Uri(blobUrl);
        var blobName = Path.GetFileName(uri.LocalPath);
        var container = Client.GetBlobContainerClient(containerName);
        await container.GetBlobClient(blobName).DeleteIfExistsAsync();
    }
}
