//working
// import { loginApi } from '../api/auth.api'
// import { storage } from '../utils/storage'
// import type { LoginRequest, LoginResponse } from '../types/auth.types'
// import type { ApiResponse } from '../types/common/api-response.model'
// //import axios from 'axios'

// export const login = async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
//   try {
//     const res = await loginApi(payload)
//     //console.log('Login service response:', res)
//     //console.log('Login service req data:', payload) // Log the data property of the response
//     // if (!res.success) {
//     //   throw new Error(res.message || 'Login failed')
//     // }

//     storage.setAuth(res.data?.token || '', res.data || {} as LoginResponse)

//     return res
//   } catch (err: any) {
//     console.error('Login service error:', err)
//     throw new Error(err.message || 'Login failed')
//   }
// }


//////


// AuthContext.tsx
// import { createContext, useContext, useState } from "react";
// import { storage } from "../utils/storage";
// import type { LoginResponse } from "../types/auth.types";

// type AuthContextType = {
//   token: string | null;
//   roleId: number | null;
//   login: (token: string, data: LoginResponse) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [token, setToken] = useState(storage.getToken());
//   const [roleId, setRoleId] = useState(storage.getRoleId());

//   const login = (token: string, data: LoginResponse) => {
//     storage.setAuth(token, data);
//     setToken(token);
//     setRoleId(data.roleId);
//   };

//   const logout = () => {
//     storage.clearAuth();
//     setToken(null);
//     setRoleId(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, roleId, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used inside AuthProvider");
//   return context;
// };

////////


// services/auth.service.ts

import { loginApi } from '../api/auth.api'
import type { LoginRequest, LoginResponse } from '../types/auth.types'
import type { ApiResponse } from '../types/common/api-response.model'

export const loginService = async (
  payload: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const res = await loginApi(payload)
    return res
  } catch (err: any) {
    console.error('Login service error:', err)
    throw new Error(err.message || 'Login failed')
  }
}

//////////