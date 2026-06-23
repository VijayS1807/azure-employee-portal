import type { LeaveQueryParams, LeaveBalanceResponse, ApplyLeaveRequest } from "../types/leave";
import { apiClient } from "./axios";
import type { ApiResponse } from "../types/common/api-response.model";

export const getLeaveBalance = async (employeeId: number) => {
  const res = await apiClient.get<ApiResponse<LeaveBalanceResponse[]>>(`/leave/balance/${employeeId}`);
  return res.data;
};

export const getLeaves = async (params: LeaveQueryParams) => {
  const { employeeId, pageNumber, pageSize, search, sortBy, sortOrder } = params;
  const res = await apiClient.get(`/leave/employee/${employeeId}`, {
    params: { pageNumber, pageSize, search, sortBy, sortOrder },
  });
  return res.data;
};

export const createLeave = async (data: ApplyLeaveRequest) => {
  const response = await apiClient.post("/leave", data);
  return response.data;
};

export const updateLeave = async (data: ApplyLeaveRequest) => {
  const response = await apiClient.put(`/leave/${data.leaveRequestId}`, data);
  return response.data;
};

export const getLeave = async (leaveRequestId: number) => {
  const res = await apiClient.get(`/leave/${leaveRequestId}`);
  return res.data;
};

export const getPendingLeaves = async (params: LeaveQueryParams) => {
  const { status, pageNumber, pageSize, search, sortBy, sortOrder } = params;
  const res = await apiClient.get("/leave", {
    params: {
      status: status || "All",
      pageNumber,
      pageSize,
      search,
      sortBy,
      sortOrder,
    },
  });
  return res.data;
};

export const updateLeaveStatus = async (
  leaveRequestId: number,
  status: string,
  approvedBy: string,
) => {
  const response = await apiClient.put(`/leave/${leaveRequestId}/status`, {
    status,
    approvedBy,
  });
  return response.data;
};
