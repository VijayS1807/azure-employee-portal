export interface ApplyLeaveRequest {
    leaveRequestId  : number;
    employeeId: number;
    fromDate: string;
    toDate: string;
    leaveType?: string;
    leaveTypeId: number;
    dayType: "Full Day" | "Half Day";
    totalDays: number;
    //reason: string;
    status: "Pending" | "Approved" | "Rejected" | "Cancelled" | "All";
    approvedBy?: string;    // default = 'admin', later from login
    appliedBy?: string;

        //daysUsed?: number;
  leavesTakenCl?: number;
  leavesTakenSl?: number;
  leavesTakenEl?: number;
  leavesTaken?: number;
  appliedDays?: number;
  leaveTypeName?: string;
}

export interface ApproveLeaveRequest {
    leaveRequestId  : number;
    //status: string;
    status: "Pending" | "Approved" | "Rejected" | "Cancelled" | "All";
    approvedBy?: string;
}

// export interface LeaveBalance {
//   totalLeaves: number;
//   usedLeaves: number;
//   remainingLeaves: number;
// }

export interface LeaveBalanceRequest {
  employeeId: number;
}

export interface LeaveBalanceResponse {
  // employeeId: number;
  // totalLeaves: number;      // total allocated leaves
  // leavesTaken: number;      // leaves used
  // remainingLeaves: number;  // balance leaves

  employeeId: number;
  leaveTypeId: number;
  leaveTypeName: string;
  totalLeaves: number;      // total allocated leaves
  leavesTaken: number;      // leaves used
  remainingLeaves: number;  // balance leaves
}

export interface LeaveResponse {

  leaveRequestId: number;
  employeeId: number;
  fromDate: Date;
  toDate: Date;
  leaveTypeId: number;
  dayType: string;
  totalDays: number;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled" | "All";
  approvedBy: string | null;
  createdAt: Date;
    //daysUsed?: number;
  leavesTakenCl?: number;
  leavesTakenSl?: number;
  leavesTakenEl?: number;
  leavesTaken?: number;
  appliedDays?: number;
}

export interface LeaveQueryParams {
  mode?: number;
  employeeId?: number;
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  status?: string;
}

// employeeId: editData?.approvedBy || 0,
// mode: 2,
// pageNumber: paginationModel.page + 1, // backend usually 1-based
// pageSize: paginationModel.pageSize,
// search:
//   filterModel.quickFilterValues?.[0] || "",
// sortBy: sortModel[0]?.field || "leaveRequestId",
// sortOrder: (sortModel[0]?.sort?.toUpperCase() as "ASC" | "DESC") || "DESC",
// status: "All",
