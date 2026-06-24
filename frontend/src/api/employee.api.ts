import type { Employee, EmployeeQueryParams } from "../types/employee";
import { apiClient } from "./axios";

export const getEmployees = async (params: EmployeeQueryParams) => {
  const res = await apiClient.get("/employees", { params });
  return res.data;
};

export const createEmployee = async (data: Employee) => {
  const response = await apiClient.post("/employees", data);
  return response.data;
};

export const updateEmployee = async (data: Employee) => {
  // Backend uses EmployeeId > 0 to detect update; both paths use POST /employees
  const response = await apiClient.post("/employees", data);
  return response.data;
};

export const updateEmployeeStatus = async (employeeId: number, status: string) => {
  const response = await apiClient.put(`/employees/${employeeId}/status`, { status });
  return response.data;
};

export const uploadEmployeePhoto = async (employeeId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post(`/employees/${employeeId}/photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getEmployee = async (employeeId: number) => {
  const res = await apiClient.get(`/employees/${employeeId}`);
  return res.data;
};
