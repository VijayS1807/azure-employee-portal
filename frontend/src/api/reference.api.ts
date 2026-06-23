import { apiClient } from "./axios";

export interface ReferenceData {
  employmentTypes: string[];
  employeeStatuses: string[];
  dayTypes: string[];
  leaveStatuses: string[];
}

export const EMPTY_REFERENCE_DATA: ReferenceData = {
  employmentTypes: [],
  employeeStatuses: [],
  dayTypes: [],
  leaveStatuses: [],
};

export const getReferenceData = async (): Promise<ReferenceData> => {
  const res = await apiClient.get<ReferenceData>("/reference");
  return res.data;
};
