using EmployeePortal.Api.Models.Common;
using EmployeePortal.Api.Models.Employee;
using EmployeePortal.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeePortal.Api.Controllers;

[ApiController]
[Route("api/employees")]
[Authorize] // all employee endpoints require a valid JWT
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _service;

    public EmployeesController(IEmployeeService service) => _service = service;

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
}
