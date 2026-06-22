namespace EmployeePortal.Api.Models.Common;

// Standard response envelope — matches the existing frontend's expected shape:
// { success, status, message, data }
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public int Status { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Success", int status = 200) =>
        new() { Success = true, Status = status, Message = message, Data = data };

    public static ApiResponse<T> Fail(string message, int status = 400) =>
        new() { Success = false, Status = status, Message = message };
}
