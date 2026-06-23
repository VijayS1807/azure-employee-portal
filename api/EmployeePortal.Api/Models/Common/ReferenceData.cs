namespace EmployeePortal.Api.Models.Common;

// Single source of truth for all enum-like string values.
// Used by services for validation, by the seeder for defaults,
// and exposed via GET /api/reference so the frontend can consume the same values.
public static class ReferenceData
{
    public static class DayType
    {
        public const string FullDay = "Full Day";
        public const string HalfDay = "Half Day";
        public static readonly string[] All = [FullDay, HalfDay];
    }

    public static class EmploymentType
    {
        public const string Permanent = "Permanent";
        public const string Contract = "Contract";
        public static readonly string[] All = [Permanent, Contract];
    }

    public static class EmployeeStatus
    {
        public const string Active = "Active";
        public const string OnHold = "On Hold";
        public const string Resigned = "Resigned";
        public static readonly string[] All = [Active, OnHold, Resigned];
    }

    public static class LeaveStatus
    {
        public const string Pending = "Pending";
        public const string Approved = "Approved";
        public const string Rejected = "Rejected";
        public const string Cancelled = "Cancelled";
        public static readonly string[] All = [Pending, Approved, Rejected, Cancelled];
    }
}
