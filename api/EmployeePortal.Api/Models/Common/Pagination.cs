namespace EmployeePortal.Api.Models.Common;

// Query parameters for paged/searched/sorted lists.
public class PaginationRequest
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string Search { get; set; } = string.Empty;
    public string SortBy { get; set; } = "EmployeeId";
    public string SortOrder { get; set; } = "DESC";   // ASC / DESC
}

// Paged result wrapper.
public class PaginatedResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalRecords { get; set; }
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
}
