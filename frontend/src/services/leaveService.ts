//import {getLeaveBalance, getEmployees, createEmployee, updateEmployee, getEmployee } from "../api/employee.api";
import {getLeaves, createLeave, updateLeave, getLeave, getLeaveBalance, getPendingLeaves, updateLeaveStatus } from "../api/leave.api";
//import type { Employee, EmployeeQueryParams, LeaveBalance } from "../types/employee";
import type { ApplyLeaveRequest, LeaveBalanceRequest, LeaveBalanceResponse, LeaveResponse, LeaveQueryParams, ApproveLeaveRequest  } from "../types/leave";
import type { ApiResponse, BaseApiResponse } from "../types/common/api-response.model";
import type { PaginatedResponse } from "../types/common/pagination";
import { LeaveBalance } from "../types/employee";
import { storage } from "../utils/storage";

const getEmployeeId = (): number => {
  const data = storage.getData();
  //console.log("Data from storage:", data);
  const employeeId = data?.employeeId || 0;
  return employeeId;
};

// export const getLeaveBalanceService = async (employeeId: number): Promise<LeaveBalance> => {
//   return getLeaveBalance(employeeId);
//   //throw error("Not Implemented");
// }

//export const getLeaveBalanceService = async (employeeId: number): Promise<LeaveBalanceResponse> => {
export const getLeaveBalanceService = async (): Promise<ApiResponse<LeaveBalanceResponse[]>> => {
  //return getLeaveBalance(employeeId);
  //throw error("Not Implemented");
  //throw new Error('No token found')
  const employeeId = getEmployeeId();
  const response = await getLeaveBalance(employeeId);
  return response;
  //return response?.data;
}

export const getLeaveService = async (params: LeaveQueryParams): Promise<PaginatedResponse<ApplyLeaveRequest>> => {
  const employeeId = getEmployeeId();
  if (!employeeId) {
    console.error('No employee ID found in storage');
    throw new Error('No employee ID found in storage');
  }
  const paramsWithEmployeeId = { ...params, employeeId };
  const response = await getLeaves(paramsWithEmployeeId);
  return response.data;
} 


export const createLeaveService = async (data: ApplyLeaveRequest): Promise<ApiResponse<ApplyLeaveRequest>> => {
  const employeeId = getEmployeeId();
  if (!employeeId) throw new Error('No employee ID found in storage');
  const dataWithEmployeeId = { ...data, employeeId };
  return createLeave(dataWithEmployeeId);
  // const response = await createLeave(dataWithEmployeeId);
  // return response.data;
}

export const updateLeaveService = async (data: ApplyLeaveRequest): Promise<ApiResponse<ApplyLeaveRequest>> => {
  const employeeId = getEmployeeId();
  if (!employeeId) throw new Error('No employee ID found in storage');
  const dataWithEmployeeId = { ...data, employeeId };
  return updateLeave(dataWithEmployeeId);
}

export const getLeaveByIdService = async (leaveRequestId: number): Promise<ApplyLeaveRequest> => {
  const employeeId = getEmployeeId();
  if (!employeeId) throw new Error('No employee ID found in storage');
  const dataWithEmployeeId = { employeeId };
  const response = await getLeave(leaveRequestId);
  return response.data;
}

export  const getPendingLeavesService = async (params: LeaveQueryParams): Promise<PaginatedResponse<ApplyLeaveRequest>> => {
  const employeeId = getEmployeeId();
  if (!employeeId) throw new Error('No employee ID found in storage');
  //const dataWithEmployeeId = { employeeId };
    const response = await getPendingLeaves(params);
  return response.data;
}

//export const updateLeaveStatusService = async (leaveRequestId: number, status: string): Promise<ApiResponse<BaseApiResponse>> => {
export const updateLeaveStatusService = async (
  data: ApproveLeaveRequest
) => {
  const employeeId = getEmployeeId();
  if (!employeeId) throw new Error('No employee ID found in storage');

  const currentUserName = storage.getData()?.fullName ?? String(employeeId);
  return updateLeaveStatus(data.leaveRequestId, data.status, data.approvedBy || currentUserName);
}