
//hotel
// import axios from 'axios'
// import { LoginRequest, LoginResponse } from '../types/auth.types'

// const API_URL = 'https://www.citl.co.in/api'

// export const loginApi = async (
//   data: LoginRequest
// ): Promise<LoginResponse> => {
//   try {
//     const response = await axios.post<LoginResponse>(
//       `${API_URL}/Authentication/Login`,
//       data,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Tenant-Name': 'CITLDT7'
//         }
//       }
//     )

//     return response.data
//   } catch (error: any) {
//     if (axios.isAxiosError(error) && error.response?.data) {
//       return error.response.data as LoginResponse
//     }

//     throw error
//   }
// }


////////////////



import axios from 'axios'
import type { LoginRequest, LoginResponse } from '../types/auth.types'
import type { ApiResponse } from "../types/common/api-response.model";

const API_URL = 'http://localhost:5000/api'

export const loginApi = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await axios.post<ApiResponse<LoginResponse>>(
      `${API_URL}/auth/login`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
            // 'X-Tenant-Name': 'CITLDT7'
        }
      }
    )

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as ApiResponse<LoginResponse>
    }

    throw error
  }
}


