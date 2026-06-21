
import type { ApiResponse } from "../types/common/api-response.model";
import type { PaginatedResponse } from "../types/common/pagination";
import { QueryBuilderQueryParams,QueryModel, QueryTemplate } from "../types/queryTypes";
import { 
    createQueryTemplates, 
    getQueryTemplateById, 
    getQueryTemplates, 
    updateQueryTemplates, 
    deleteQueryTemplate 
}  from "../api/query.api";

export const getQueryTemplatesService = async (params: QueryBuilderQueryParams): Promise<PaginatedResponse<QueryTemplate>> => {
  const response = await getQueryTemplates(params);
  return response.data;
} 

export const createQueryTemplateService = async (data: QueryTemplate): Promise<ApiResponse<QueryTemplate>> => {
  return createQueryTemplates(data);
}

export const updateQueryTemplateService = async (data: QueryTemplate): Promise<ApiResponse<QueryTemplate>> => {
  return updateQueryTemplates(data);
}

export const getQueryTemplateByIdService = async (id: number): Promise<QueryTemplate> => {
  const response = await getQueryTemplateById(id);
  return response.data;
}

export const deleteQueryTemplateService = async (id: number): Promise<ApiResponse<void>> => {
  return deleteQueryTemplate(id);
}
