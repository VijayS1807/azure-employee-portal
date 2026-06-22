using EmployeePortal.Api.Models.Common;
using EmployeePortal.Api.Models.Employee;
using EmployeePortal.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeePortal.Api.Controllers;

[ApiController]
[Route("api/employees")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _service;
    private readonly IBlobService _blob;

    public EmployeesController(IEmployeeService service, IBlobService blob)
    {
        _service = service;
        _blob = blob;
    }

    // GET /api/employees?pageNumber=1&pageSize=10&search=&sortBy=&sortOrder=
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] PaginationRequest pagination)
    {
        var result = await _service.GetEmployeesAsync(pagination);
        return StatusCode(result.Status, result);
    }

    // GET /api/employees/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return StatusCode(result.Status, result);
    }

    // POST /api/employees  (create or update)
    [HttpPost]
    public async Task<IActionResult> CreateOrUpdate([FromBody] CreateEmployeeRequest request)
    {
        var result = await _service.CreateOrUpdateAsync(request);
        return StatusCode(result.Status, result);
    }

    // PUT /api/employees/{id}/status
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateEmployeeStatusRequest request)
    {
        var result = await _service.UpdateStatusAsync(id, request.Status);
        return StatusCode(result.Status, result);
    }

    // POST /api/employees/{id}/photo  (multipart/form-data, field: "file")
    [HttpPost("{id:int}/photo")]
    public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { success = false, message = "No file provided" });

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowed.Contains(ext))
            return BadRequest(new { success = false, message = "Only jpg, png, webp allowed" });

        if (file.Length > 2 * 1024 * 1024)
            return BadRequest(new { success = false, message = "File must be under 2 MB" });

        var result = await _service.UpdatePhotoAsync(id, file, _blob);
        return StatusCode(result.Status, result);
    }
}
