namespace EmployeePortal.Api.Services;

/// <summary>
/// Fallback IBlobService that stores files under wwwroot/uploads and serves
/// them as static files. Used when Azure Blob Storage is not configured.
/// </summary>
public class LocalBlobService : IBlobService
{
    private readonly IWebHostEnvironment _env;
    private readonly IHttpContextAccessor _http;

    public LocalBlobService(IWebHostEnvironment env, IHttpContextAccessor http)
    {
        _env = env;
        _http = http;
    }

    public async Task<string> UploadAsync(IFormFile file, string containerName)
    {
        var root = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var dir = Path.Combine(root, "uploads", containerName);
        Directory.CreateDirectory(dir);

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var fileName = $"{Guid.NewGuid()}{ext}";

        using var stream = File.Create(Path.Combine(dir, fileName));
        await file.CopyToAsync(stream);

        var req = _http.HttpContext!.Request;
        return $"{req.Scheme}://{req.Host}/uploads/{containerName}/{fileName}";
    }

    public Task DeleteAsync(string blobUrl, string containerName)
    {
        try
        {
            var fileName = Path.GetFileName(new Uri(blobUrl).LocalPath);
            var root = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var filePath = Path.Combine(root, "uploads", containerName, fileName);
            if (File.Exists(filePath)) File.Delete(filePath);
        }
        catch { /* best-effort delete */ }
        return Task.CompletedTask;
    }
}
