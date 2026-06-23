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
  const response = await apiClient.put(`/employees/${data.employeeId}`, data);
  return response.data;
};

export const getEmployee = async (employeeId: number) => {
  const res = await apiClient.get(`/employees/${employeeId}`);
  return res.data;
};
