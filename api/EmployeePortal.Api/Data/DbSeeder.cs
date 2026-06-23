using EmployeePortal.Api.Entities;
using EmployeePortal.Api.Models.Common;
using Microsoft.EntityFrameworkCore;

namespace EmployeePortal.Api.Data;

// Seeds initial data (an admin + a sample employee) with BCrypt-hashed passwords.
// Runs on startup; only inserts if the table is empty.
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Employees.AnyAsync()) return;

        var employees = new List<Employee>
        {
            new()
            {
                EmployeeCode = "EMP001",
                FullName = "Vijay S",
                Email = "vijay@test.com",
                Department = "IT",
                Designation = "Admin",
                DateOfJoining = new DateTime(2023, 1, 1),
                EmploymentType = ReferenceData.EmploymentType.Permanent,
                Status = "Active",
                RoleId = 1, // Admin
                Password = BCrypt.Net.BCrypt.HashPassword("Temp@123"),
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                EmployeeCode = "EMP002",
                FullName = "Sankar",
                Email = "sankar@ufours.com",
                Department = "Development",
                Designation = "Developer",
                DateOfJoining = new DateTime(2023, 6, 1),
                EmploymentType = ReferenceData.EmploymentType.Permanent,
                Status = "Active",
                RoleId = 2, // Employee
                Password = BCrypt.Net.BCrypt.HashPassword("Temp@123"),
                CreatedAt = DateTime.UtcNow
            }
        };

        db.Employees.AddRange(employees);
        await db.SaveChangesAsync();

        // Give each employee a leave balance for the current year.
        var year = DateTime.UtcNow.Year;
        var balances = new List<EmployeeLeaveBalance>();
        foreach (var emp in employees)
        {
            balances.Add(new EmployeeLeaveBalance { EmployeeId = emp.EmployeeId, LeaveTypeId = 1, Year = year, TotalAllowed = 12, Used = 0, Remaining = 12 });
            balances.Add(new EmployeeLeaveBalance { EmployeeId = emp.EmployeeId, LeaveTypeId = 2, Year = year, TotalAllowed = 10, Used = 0, Remaining = 10 });
        }
        db.EmployeeLeaveBalances.AddRange(balances);
        await db.SaveChangesAsync();
    }
}

