export interface ApiResponse<T> {
  success: boolean;
  status?: number;
  message: string;
  data?: T;
}

export interface BaseApiResponse {
  success: boolean;
  status?: number;
  message: string;
}
