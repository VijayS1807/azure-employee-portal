export interface Employee {
  employeeId: number;
  employeeCode: string;
  fullName: string;
  email: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  employmentType: "Permanent" | "Contract";
  status: "Active" | "On Hold" | "Resigned";
  profilePhotoUrl?: string;
}

export interface LeaveBalance {
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
}

export interface EmployeeQueryParams {
  mode?: number;
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}
