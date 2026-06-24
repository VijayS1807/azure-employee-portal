using EmployeePortal.Functions.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmployeePortal.Functions.Data;

// Lightweight DbContext for the Functions project.
// Maps only the tables the three functions actually read or write.
// Uses the same Azure SQL database as EmployeePortal.Api — no separate DB needed.
public class FunctionsDbContext : DbContext
{
    public FunctionsDbContext(DbContextOptions<FunctionsDbContext> options) : base(options) { }

    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<LeaveType> LeaveTypes => Set<LeaveType>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Match the exact table names from the main API schema.
        modelBuilder.Entity<LeaveRequest>().ToTable("LeaveRequests");
        modelBuilder.Entity<Employee>().ToTable("Employees");
        modelBuilder.Entity<LeaveType>().ToTable("LeaveTypes");
    }
}
