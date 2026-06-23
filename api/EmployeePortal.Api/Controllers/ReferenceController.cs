using EmployeePortal.Api.Models.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeePortal.Api.Controllers;

[ApiController]
[Route("api/reference")]
[AllowAnonymous]
public class ReferenceController : ControllerBase
{
    // Returns all enum-like lookup values the frontend needs.
    // Anonymous — no auth required; data is not sensitive.
    [HttpGet]
    public IActionResult Get() => Ok(new
    {
        employmentTypes = ReferenceData.EmploymentType.All,
        employeeStatuses = ReferenceData.EmployeeStatus.All,
        dayTypes = ReferenceData.DayType.All,
        leaveStatuses = ReferenceData.LeaveStatus.All,
    });
}
