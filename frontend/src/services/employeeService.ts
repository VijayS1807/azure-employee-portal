// import axios from "axios";
// import type { Employee, EmployeeQueryParams, LeaveBalance } from "../types/employee";

// const API_BASE = "http://localhost:5000/api"; // change later

// export const getLeaveBalance = async (employeeId: number) => {
//   const res = await axios.get<LeaveBalance>(
//     //`${API_BASE}/employees/leave-balance/${employeeId}`
//     `${API_BASE}/leave/balance/${employeeId}`
//   );
//   return res.data;
// };

// export const getEmployees = async (params: EmployeeQueryParams) => {
//   const res = await axios.get(`${API_BASE}/employees`, {
//     params,
//   });
//   return res.data;
// };

// export const createEmployee = async (data: Employee) => {
//   return axios.post(`${API_BASE}/employees`, data);
// };

// export const updateEmployee = async (data: Employee) => {
//   return axios.put(`${API_BASE}/employees/${data.employeeId}`, data);
// };


/////////////


import { getEmployees, createEmployee, updateEmployee, getEmployee } from "../api/employee.api";
import type { Employee, EmployeeQueryParams, LeaveBalance } from "../types/employee";
import type { ApiResponse } from "../types/common/api-response.model";
import type { PaginatedResponse } from "../types/common/pagination";

// export const getLeaveBalanceService = async (employeeId: number): Promise<LeaveBalance> => {
//   return getLeaveBalance(employeeId);
// }

export const getEmployeesService = async (params: EmployeeQueryParams): Promise<PaginatedResponse<Employee>> => {
  const response = await getEmployees(params);
  return response.data;
} 

export const createEmployeeService = async (data: Employee): Promise<ApiResponse<Employee>> => {
  return createEmployee(data);
  // const response = await createEmployee(data);
  // return response.data;
}

export const updateEmployeeService = async (data: Employee): Promise<ApiResponse<Employee>> => {
  return updateEmployee(data);
}

export const getEmployeeByIdService = async (employeeId: number): Promise<Employee> => {
  const response = await getEmployee(employeeId);
  return response.data;
}
