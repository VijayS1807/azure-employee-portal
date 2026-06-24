using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;

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
        // Private access — public access is disabled at the storage account level.
        // We return a SAS URL so the browser can load the image directly.
        await container.CreateIfNotExistsAsync(PublicAccessType.None);

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var blobName = $"{Guid.NewGuid()}{ext}";
        var blob = container.GetBlobClient(blobName);

        using var stream = file.OpenReadStream();
        await blob.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });

        // Generate a read-only SAS URL valid for 5 years (profile photos rarely change).
        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = containerName,
            BlobName = blobName,
            Resource = "b",
            ExpiresOn = DateTimeOffset.UtcNow.AddYears(5)
        };
        sasBuilder.SetPermissions(BlobSasPermissions.Read);

        return blob.GenerateSasUri(sasBuilder).ToString();
    }

    public async Task DeleteAsync(string blobUrl, string containerName)
    {
        // blobUrl may be a SAS URL — strip the query string to get the blob name.
        var uri = new Uri(blobUrl);
        var blobName = Path.GetFileName(uri.LocalPath);
        var container = Client.GetBlobContainerClient(containerName);
        await container.GetBlobClient(blobName).DeleteIfExistsAsync();
    }
}
