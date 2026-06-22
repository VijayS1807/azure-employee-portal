using EmployeePortal.Api.Models.Leave;
using EmployeePortal.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeePortal.Api.Controllers;

[ApiController]
[Route("api/leave")]
[Authorize]
public class LeaveController : ControllerBase
{
    private readonly ILeaveService _service;

    public LeaveController(ILeaveService service) => _service = service;

    // POST /api/leave  (apply for leave)
    [HttpPost]
    public async Task<IActionResult> Apply([FromBody] ApplyLeaveRequest request)
    {
        var result = await _service.ApplyAsync(request);
        return StatusCode(result.Status, result);
    }

    // GET /api/leave/employee/{employeeId}
    [HttpGet("employee/{employeeId:int}")]
    public async Task<IActionResult> GetByEmployee(int employeeId)
    {
        var result = await _service.GetByEmployeeAsync(employeeId);
        return StatusCode(result.Status, result);
    }

    // GET /api/leave/pending
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var result = await _service.GetPendingAsync();
        return StatusCode(result.Status, result);
    }

    // PUT /api/leave/{id}/action  (approve / reject)
    [HttpPut("{id:int}/action")]
    public async Task<IActionResult> Action(int id, [FromBody] LeaveActionRequest request)
    {
        var result = await _service.ActionAsync(id, request);
        return StatusCode(result.Status, result);
    }

    // GET /api/leave/balance/{employeeId}
    [HttpGet("balance/{employeeId:int}")]
    public async Task<IActionResult> GetBalance(int employeeId)
    {
        var result = await _service.GetBalanceAsync(employeeId);
        return StatusCode(result.Status, result);
    }
}
