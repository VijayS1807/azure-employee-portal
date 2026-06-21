export interface LoginRequest {
  username: string
  password: string

//   Login_Latitude: number
//   Login_Longitude: number
//   Login_Accuracy: number
//   Show_Password: boolean
}


export interface LoginResponse {
//   ResultCode: number
//   ResultType: string
//   ResultMessage: string
//   CorrelationId: string
//   Timestamp: string
//   Version: string
//   Data: {
//     AccessToken: string
//     AccessTokenExpiryDateTime: string
//     RefreshToken: string
//     RefreshTokenExpiryDateTime: string
//   }
// success: boolean
// message: string
// token: string
  employeeId: number;
  roleId: number;
  fullName: string;
  email: string;
  roleName: "Admin" | "Employee";
  token: string;
}
