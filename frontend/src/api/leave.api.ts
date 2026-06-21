import axios from "axios";
import type { Employee, EmployeeQueryParams, LeaveBalance } from "../types/employee";
import type { LeaveQueryParams, LeaveResponse, LeaveBalanceResponse, LeaveBalanceRequest, ApplyLeaveRequest  } from "../types/leave";
import { storage } from "../utils/storage";
import {apiClient} from "./axios";
//import { ApiResponse} from "../models/ApiResponse";
import type { ApiResponse, BaseApiResponse } from "../types/common/api-response.model";


const API_BASE = "http://localhost:5000/api"; // change later
const token = storage.getToken()

export const getLeaveBalance = async (employeeId: number) => {
  //if (!token) throw new Error('You dont have a access token, please login')
//   const res = await axios.get<LeaveBalanceResponse>(
//     `${API_BASE}/leave/balance/${employeeId}`,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     }
//   );
    const res = await apiClient.get<ApiResponse<LeaveBalanceResponse[]>>(`/leave/balance/${employeeId}`);
  return res.data;
};

// export const getEmployees = async (params: EmployeeQueryParams) => {
//   if (!token) throw new Error('No token found')
//     console.log("Token:", token);
//     console.log("Fetching employees with params:", params);
//   const res = await axios.get(`${API_BASE}/employees`, {
//     params,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   });
//   console.log("Employees:", res);
//   return res.data;
// };

export const getLeaves = async (params: LeaveQueryParams, ) => {
  //if (!token) throw new Error('You dont have a access token, please login')
    // console.log("Token:", token);
    // console.log("Fetching leaves with params:", params);
    const employeeId = params.employeeId;
  //const res = await apiClient.get("/leave/history"  {params});
  const res = await apiClient.get(`/leave/history/${employeeId}`,{params});
  return res.data;
};

export const createLeave = async (data: ApplyLeaveRequest) => {
    if (!token) throw new Error('You dont have a access token, please login')
    const response = await apiClient.post("/leave/apply", data);
    return response.data;
};

export const updateLeave = async (data: ApplyLeaveRequest) => {
    if (!token) throw new Error('You dont have a access token, please login')
     const response = await apiClient.post(`/leaves/${data.leaveRequestId}`, data);
    return response.data;
};

// export const updateEmployee = async (data: Employee) => {
//     if (!token) throw new Error('No token found')
//     return axios.put(`${API_BASE}/employees/${data.employeeId}`, data, {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   });
// };

export const getLeave = async (leaveRequestId: number) => {
  if (!token) throw new Error('You dont have a access token, please login')
  const res = await apiClient.get(`/leaves/${leaveRequestId}`);
  return res.data;
}

export const getPendingLeaves = async (params: LeaveQueryParams) => {
  if (!token) throw new Error('You dont have a access token, please login')
  //const res = await apiClient.get(`/leaves/${status}`);
const status = params.status || "All"; // default to "Pending" if status is not provided
const res = await axios.get(
  `${API_BASE}/leave`,
  {
    params: { status: status },
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }
);
  return res.data;
}

export const updateLeaveStatus = 
  async (leaveRequestId: number, status: string, approvedBy: number) => 
{
  if (!token) throw new Error('You dont have a access token, please login')
    console.log("Updating leave status with data:", { leaveRequestId, status, approvedBy });
  console.log("Token for updating leave status:", token);
  const response = await axios.put(
    `${API_BASE}/leave/${leaveRequestId}/status`,
    { leaveRequestId, status, approvedBy },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
    
  );
  console.log("Update leave status response:", response);
  
  return response.data;
}
//   const response = await apiClient.put(`/leaves/${leaveRequestId}/status`, { status, employeeId });
//   return response.data;
// }