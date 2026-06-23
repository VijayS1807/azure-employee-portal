using EmployeePortal.Api.Models.Common;
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

    // GET /api/leave?status=All&pageNumber=1&pageSize=10&search=&sortBy=leaveRequestId&sortOrder=DESC
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PaginationRequest pagination, [FromQuery] string status = "All")
    {
        var result = await _service.GetAllAsync(pagination, status);
        return StatusCode(result.Status, result);
    }

    // POST /api/leave  (apply for leave)
    [HttpPost]
    public async Task<IActionResult> Apply([FromBody] ApplyLeaveRequest request)
    {
        var result = await _service.ApplyAsync(request);
        return StatusCode(result.Status, result);
    }

    // GET /api/leave/employee/{employeeId}?pageNumber=1&pageSize=10&...
    [HttpGet("employee/{employeeId:int}")]
    public async Task<IActionResult> GetByEmployee(int employeeId, [FromQuery] PaginationRequest pagination)
    {
        var result = await _service.GetByEmployeePagedAsync(employeeId, pagination);
        return StatusCode(result.Status, result);
    }

    // GET /api/leave/pending
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var result = await _service.GetPendingAsync();
        return StatusCode(result.Status, result);
    }

    // PUT /api/leave/{id}/action  (approve / reject — original endpoint)
    [HttpPut("{id:int}/action")]
    public async Task<IActionResult> Action(int id, [FromBody] LeaveActionRequest request)
    {
        var result = await _service.ActionAsync(id, request);
        return StatusCode(result.Status, result);
    }

    // PUT /api/leave/{id}/status  (approve / reject / cancel / revert — used by frontend)
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] LeaveActionRequest request)
    {
        var result = await _service.UpdateStatusAsync(id, request);
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
