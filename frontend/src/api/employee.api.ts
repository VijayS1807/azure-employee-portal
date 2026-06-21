import axios from "axios";
import type { Employee, EmployeeQueryParams, LeaveBalance } from "../types/employee";
import { storage } from "../utils/storage";
import {apiClient} from "./axios";

const API_BASE = "http://localhost:5000/api"; // change later
const token = storage.getToken()


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

export const getEmployees = async (params: EmployeeQueryParams) => {
  // if (!token) {
  //   console.warn('No token found in api, token:', token);
  //   throw new Error('No token found')
  // }
    //console.log("Token:", token);
    //console.log("Fetching employees with params:", params);
  const res = await apiClient.get("/employees", {params});
  return res.data;
};

export const createEmployee = async (data: Employee) => {
    if (!token) throw new Error('No token found')
        const response = await axios.post(`${API_BASE}/employees`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });  
  console.log("Create employee response in Api:", response); 
    return response.data;
};

export const updateEmployee = async (data: Employee) => {
    if (!token) throw new Error('No token found')
    const response = await axios.put(`${API_BASE}/employees/${data.employeeId}`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
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

export const getEmployee = async (employeeId: number) => {
  if (!token) throw new Error('No token found')
  const res = await axios.get(`${API_BASE}/employees/${employeeId}`, {  
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
}
