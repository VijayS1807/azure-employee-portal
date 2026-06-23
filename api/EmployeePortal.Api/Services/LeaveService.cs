using EmployeePortal.Api.Data;
using EmployeePortal.Api.Entities;
using EmployeePortal.Api.Models.Common;
using EmployeePortal.Api.Models.Leave;
using Microsoft.EntityFrameworkCore;
using Rd = EmployeePortal.Api.Models.Common.ReferenceData;

namespace EmployeePortal.Api.Services;

public interface ILeaveService
{
    Task<ApiResponse<LeaveResponse>> ApplyAsync(ApplyLeaveRequest request);
    Task<ApiResponse<PaginatedResponse<LeaveResponse>>> GetAllAsync(PaginationRequest pagination, string status);
    Task<ApiResponse<PaginatedResponse<LeaveResponse>>> GetByEmployeePagedAsync(int employeeId, PaginationRequest pagination);
    Task<ApiResponse<List<LeaveResponse>>> GetByEmployeeAsync(int employeeId);
    Task<ApiResponse<List<LeaveResponse>>> GetPendingAsync();
    Task<ApiResponse<string>> ActionAsync(int leaveRequestId, LeaveActionRequest request);
    Task<ApiResponse<string>> UpdateStatusAsync(int leaveRequestId, LeaveActionRequest request);
    Task<ApiResponse<List<LeaveBalanceResponse>>> GetBalanceAsync(int employeeId);
}

public class LeaveService : ILeaveService
{
    private readonly AppDbContext _db;

    public LeaveService(AppDbContext db) => _db = db;

    public async Task<ApiResponse<LeaveResponse>> ApplyAsync(ApplyLeaveRequest r)
    {
        if (!DateTime.TryParse(r.FromDate, out var from) || !DateTime.TryParse(r.ToDate, out var to))
            return ApiResponse<LeaveResponse>.Fail("Invalid dates", 400);

        if (to < from)
            return ApiResponse<LeaveResponse>.Fail("ToDate cannot be before FromDate", 400);

        var employee = await _db.Employees.FindAsync(r.EmployeeId);
        if (employee is null) return ApiResponse<LeaveResponse>.Fail("Employee not found", 404);

        var leaveType = await _db.LeaveTypes.FindAsync(r.LeaveTypeId);
        if (leaveType is null) return ApiResponse<LeaveResponse>.Fail("Invalid leave type", 400);

        if (!Rd.DayType.All.Contains(r.DayType, StringComparer.OrdinalIgnoreCase))
            return ApiResponse<LeaveResponse>.Fail(
                $"DayType must be one of: {string.Join(", ", Rd.DayType.All)}", 400);

        // Inclusive day count; halve for half-day requests.
        var days = (decimal)((to - from).Days + 1);
        if (r.DayType.Equals(Rd.DayType.HalfDay, StringComparison.OrdinalIgnoreCase)) days = 0.5m;

        var leave = new LeaveRequest
        {
            EmployeeId = r.EmployeeId,
            LeaveTypeId = r.LeaveTypeId,
            FromDate = from,
            ToDate = to,
            DayType = r.DayType,
            TotalDays = days,
            Status = "Pending",
            AppliedDate = DateTime.UtcNow
        };

        _db.LeaveRequests.Add(leave);
        await _db.SaveChangesAsync();

        return ApiResponse<LeaveResponse>.Ok(ToResponse(leave, employee.FullName, leaveType.LeaveName),
            "Leave applied successfully", 201);
    }

    public async Task<ApiResponse<List<LeaveResponse>>> GetByEmployeeAsync(int employeeId)
    {
        var rows = await BuildQuery(_db.LeaveRequests.Where(l => l.EmployeeId == employeeId));
        return ApiResponse<List<LeaveResponse>>.Ok(rows, "Leaves fetched successfully");
    }

    public async Task<ApiResponse<List<LeaveResponse>>> GetPendingAsync()
    {
        var rows = await BuildQuery(_db.LeaveRequests.Where(l => l.Status == "Pending"));
        return ApiResponse<List<LeaveResponse>>.Ok(rows, "Pending leaves fetched successfully");
    }

    public async Task<ApiResponse<string>> ActionAsync(int leaveRequestId, LeaveActionRequest r)
    {
        var leave = await _db.LeaveRequests.FindAsync(leaveRequestId);
        if (leave is null) return ApiResponse<string>.Fail("Leave request not found", 404);

        if (r.Status != "Approved" && r.Status != "Rejected")
            return ApiResponse<string>.Fail("Status must be Approved or Rejected", 400);

        leave.Status = r.Status;
        leave.ApprovedBy = r.ApprovedBy;
        leave.ApprovedDate = DateTime.UtcNow;

        // On approval, decrement the employee's balance for that leave type.
        if (r.Status == "Approved")
        {
            var bal = await _db.EmployeeLeaveBalances.FirstOrDefaultAsync(b =>
                b.EmployeeId == leave.EmployeeId &&
                b.LeaveTypeId == leave.LeaveTypeId &&
                b.Year == leave.FromDate.Year);

            if (bal is not null)
            {
                bal.Used += leave.TotalDays;
                bal.Remaining = bal.TotalAllowed - bal.Used;
            }
        }

        await _db.SaveChangesAsync();
        return ApiResponse<string>.Ok("OK", $"Leave {r.Status.ToLower()} successfully");
    }

    public async Task<ApiResponse<List<LeaveBalanceResponse>>> GetBalanceAsync(int employeeId)
    {
        var balances = await _db.EmployeeLeaveBalances
            .Where(b => b.EmployeeId == employeeId && b.Year == DateTime.UtcNow.Year)
            .Join(_db.LeaveTypes, b => b.LeaveTypeId, lt => lt.LeaveTypeId, (b, lt) => new LeaveBalanceResponse
            {
                LeaveTypeId = b.LeaveTypeId,
                LeaveTypeName = lt.LeaveName,
                TotalLeaves = b.TotalAllowed,
                LeavesTaken = b.Used,
                RemainingLeaves = b.Remaining
            })
            .ToListAsync();

        return ApiResponse<List<LeaveBalanceResponse>>.Ok(balances, "Leave balance fetched successfully");
    }

    public async Task<ApiResponse<PaginatedResponse<LeaveResponse>>> GetAllAsync(PaginationRequest p, string status)
    {
        var source = _db.LeaveRequests.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
            source = source.Where(l => l.Status == status);

        var result = await BuildPagedQuery(source, p);
        return ApiResponse<PaginatedResponse<LeaveResponse>>.Ok(result, "Leaves fetched successfully");
    }

    public async Task<ApiResponse<PaginatedResponse<LeaveResponse>>> GetByEmployeePagedAsync(int employeeId, PaginationRequest p)
    {
        var source = _db.LeaveRequests.Where(l => l.EmployeeId == employeeId);
        var result = await BuildPagedQuery(source, p);
        return ApiResponse<PaginatedResponse<LeaveResponse>>.Ok(result, "Leaves fetched successfully");
    }

    public async Task<ApiResponse<string>> UpdateStatusAsync(int leaveRequestId, LeaveActionRequest r)
    {
        var leave = await _db.LeaveRequests.FindAsync(leaveRequestId);
        if (leave is null) return ApiResponse<string>.Fail("Leave request not found", 404);

        if (!Rd.LeaveStatus.All.Contains(r.Status, StringComparer.OrdinalIgnoreCase))
            return ApiResponse<string>.Fail(
                $"Invalid status. Allowed: {string.Join(", ", Rd.LeaveStatus.All)}", 400);

        leave.Status = r.Status;
        leave.ApprovedBy = r.ApprovedBy;

        if (r.Status == "Approved")
        {
            leave.ApprovedDate = DateTime.UtcNow;
            var bal = await _db.EmployeeLeaveBalances.FirstOrDefaultAsync(b =>
                b.EmployeeId == leave.EmployeeId &&
                b.LeaveTypeId == leave.LeaveTypeId &&
                b.Year == leave.FromDate.Year);

            if (bal is not null)
            {
                bal.Used += leave.TotalDays;
                bal.Remaining = bal.TotalAllowed - bal.Used;
            }
        }

        await _db.SaveChangesAsync();
        return ApiResponse<string>.Ok("OK", $"Leave {r.Status.ToLower()} successfully");
    }

    // --- helpers ---
    private async Task<List<LeaveResponse>> BuildQuery(IQueryable<LeaveRequest> source)
    {
        var raw = await (
            from l in source
            join e in _db.Employees on l.EmployeeId equals e.EmployeeId
            join t in _db.LeaveTypes on l.LeaveTypeId equals t.LeaveTypeId
            orderby l.LeaveRequestId descending
            select new
            {
                l.LeaveRequestId, l.EmployeeId,
                EmployeeName = e.FullName,
                l.LeaveTypeId, LeaveTypeName = t.LeaveName,
                l.FromDate, l.ToDate, l.DayType, l.TotalDays,
                l.Status, l.AppliedDate, l.ApprovedBy
            }).ToListAsync();

        return raw.Select(r => new LeaveResponse
        {
            LeaveRequestId = r.LeaveRequestId,
            EmployeeId = r.EmployeeId,
            AppliedBy = r.EmployeeName,
            LeaveTypeId = r.LeaveTypeId,
            LeaveTypeName = r.LeaveTypeName,
            FromDate = r.FromDate.ToString("yyyy-MM-dd"),
            ToDate = r.ToDate.ToString("yyyy-MM-dd"),
            DayType = r.DayType,
            AppliedDays = r.TotalDays,
            Status = r.Status,
            AppliedDate = r.AppliedDate.ToString("yyyy-MM-dd"),
            ApprovedBy = r.ApprovedBy
        }).ToList();
    }

    private async Task<PaginatedResponse<LeaveResponse>> BuildPagedQuery(
        IQueryable<LeaveRequest> source, PaginationRequest p)
    {
        var query = from l in source
                    join e in _db.Employees on l.EmployeeId equals e.EmployeeId
                    join t in _db.LeaveTypes on l.LeaveTypeId equals t.LeaveTypeId
                    select new
                    {
                        l.LeaveRequestId, l.EmployeeId,
                        EmployeeName = e.FullName,
                        l.LeaveTypeId, LeaveTypeName = t.LeaveName,
                        l.FromDate, l.ToDate, l.DayType, l.TotalDays,
                        l.Status, l.AppliedDate, l.ApprovedBy
                    };

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim();
            query = query.Where(x =>
                x.EmployeeName.Contains(s) ||
                x.LeaveTypeName.Contains(s) ||
                x.Status.Contains(s));
        }

        bool desc = p.SortOrder.Equals("DESC", StringComparison.OrdinalIgnoreCase);
        query = p.SortBy.ToLower() switch
        {
            "status" => desc ? query.OrderByDescending(x => x.Status) : query.OrderBy(x => x.Status),
            "applieddate" => desc ? query.OrderByDescending(x => x.AppliedDate) : query.OrderBy(x => x.AppliedDate),
            _ => desc ? query.OrderByDescending(x => x.LeaveRequestId) : query.OrderBy(x => x.LeaveRequestId)
        };

        var total = await query.CountAsync();
        var raw = await query
            .Skip((p.PageNumber - 1) * p.PageSize)
            .Take(p.PageSize)
            .ToListAsync();

        var data = raw.Select(x => new LeaveResponse
        {
            LeaveRequestId = x.LeaveRequestId,
            EmployeeId = x.EmployeeId,
            AppliedBy = x.EmployeeName,
            LeaveTypeId = x.LeaveTypeId,
            LeaveTypeName = x.LeaveTypeName,
            FromDate = x.FromDate.ToString("yyyy-MM-dd"),
            ToDate = x.ToDate.ToString("yyyy-MM-dd"),
            DayType = x.DayType,
            AppliedDays = x.TotalDays,
            Status = x.Status,
            AppliedDate = x.AppliedDate.ToString("yyyy-MM-dd"),
            ApprovedBy = x.ApprovedBy
        }).ToList();

        return new PaginatedResponse<LeaveResponse>
        {
            Data = data,
            TotalRecords = total,
            TotalPages = (int)Math.Ceiling(total / (double)p.PageSize),
            CurrentPage = p.PageNumber,
            PageSize = p.PageSize
        };
    }

    private static LeaveResponse ToResponse(LeaveRequest l, string empName, string typeName) => new()
    {
        LeaveRequestId = l.LeaveRequestId,
        EmployeeId = l.EmployeeId,
        AppliedBy = empName,
        LeaveTypeId = l.LeaveTypeId,
        LeaveTypeName = typeName,
        FromDate = l.FromDate.ToString("yyyy-MM-dd"),
        ToDate = l.ToDate.ToString("yyyy-MM-dd"),
        DayType = l.DayType,
        AppliedDays = l.TotalDays,
        Status = l.Status,
        AppliedDate = l.AppliedDate.ToString("yyyy-MM-dd"),
        ApprovedBy = l.ApprovedBy
    };
}
