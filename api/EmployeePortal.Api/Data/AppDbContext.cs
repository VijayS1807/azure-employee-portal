using EmployeePortal.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmployeePortal.Api.Data;

// The DbContext is EF Core's representation of the database.
// Each DbSet<T> becomes a table.
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<LeaveType> LeaveTypes => Set<LeaveType>();
    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<LeaveRequestDetail> LeaveRequestDetails => Set<LeaveRequestDetail>();
    public DbSet<EmployeeLeaveBalance> EmployeeLeaveBalances => Set<EmployeeLeaveBalance>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Email must be unique (used as the login username).
        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.Email)
            .IsUnique();

        // Explicit table names to match the original schema.
        modelBuilder.Entity<Employee>().ToTable("Employees");
        modelBuilder.Entity<LeaveType>().ToTable("LeaveTypes");
        modelBuilder.Entity<LeaveRequest>().ToTable("LeaveRequests");
        modelBuilder.Entity<LeaveRequestDetail>().ToTable("LeaveRequestDetails");
        modelBuilder.Entity<EmployeeLeaveBalance>().ToTable("EmployeeLeaveBalance");

        // Seed the leave types (master data).
        modelBuilder.Entity<LeaveType>().HasData(
            new LeaveType { LeaveTypeId = 1, LeaveCode = "CL", LeaveName = "Casual Leave", AnnualLimit = 12 },
            new LeaveType { LeaveTypeId = 2, LeaveCode = "SL", LeaveName = "Sick Leave", AnnualLimit = 10 },
            new LeaveType { LeaveTypeId = 3, LeaveCode = "LOP", LeaveName = "Loss of Pay", AnnualLimit = null }
        );
    }
}
