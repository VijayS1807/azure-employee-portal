import axios from "axios"
import { apiClient } from "./axios";
import { useAuth } from "../context/AuthContext";
import { EmployeeQueryParams } from "../types/employee";
import { Employee } from "../types/employee";
import { QueryModel, QueryTemplate,QueryBuilderQueryParams } from "../types/queryTypes";
import { storage } from "../utils/storage";

const API_BASE = "http://localhost:5000/api";
//const { token } = useAuth();
const token = storage.getToken()

export async function runQuery(queryModel:any){

    console.log("Running query with model:", queryModel);
 //const res = await axios.post(`${API_BASE}/query/run`,queryModel)
  const res = await apiClient.post("/query/run", queryModel);

 return res.data

}



export const getQueryTemplates = async (params: QueryBuilderQueryParams) => {
  const res = await apiClient.get("/query/templates", {params});
  return res.data;
};

export const createQueryTemplates = async (data: QueryTemplate) => {
    if (!token) throw new Error('No token found')

    
    const response = await axios.post(`${API_BASE}/query/templates`, data, {
                        headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                        }
                    });  
  console.log("Create query template response in Api:", response); 
    return response.data;
};

export const updateQueryTemplates = async (data: QueryTemplate) => {
    if (!token) throw new Error('No token found')

    const response = await axios.put(`${API_BASE}/query/templates/${data.id}`, data, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const getQueryTemplateById = async (id: number) => {
  if (!token) throw new Error('No token found')
  const res = await axios.get(`${API_BASE}/query/templates/${id}`, {  
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
}

export const deleteQueryTemplate = async (id: number) => {
  if (!token) throw new Error('No token found')
  const res = await axios.delete(`${API_BASE}/query/templates/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
    });
    return res.data;
}
