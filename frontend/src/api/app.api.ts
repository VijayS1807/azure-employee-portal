import axios from 'axios'
import { AppResponse } from '../types/app.types'
import { storage } from '../utils/storage'

const API_URL = 'https://www.citl.co.in/api'

export const getAppDetailsApi = async (): Promise<AppResponse> => {
  const token = storage.getToken()
  if (!token) throw new Error('No token found')

  const res = await axios.get<AppResponse>(
    `${API_URL}/Application/GetAppDetails`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Tenant-Name': 'CITLDT7'
      }
    }
  )

  return res.data
}
