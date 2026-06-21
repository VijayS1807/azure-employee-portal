export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  data: T[];
}