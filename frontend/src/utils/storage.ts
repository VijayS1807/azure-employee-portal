import type { LoginResponse } from "../types/auth.types"
import { useState } from "react";

const TOKEN_KEY = 'auth_token'
const DATA_KEY = 'auth_data'

//const [roleId, setRoleId] = useState<number | null>(null)

export const storage = {
  //const data = JSON.stringify(data),

  setAuth: (token: string, data: LoginResponse) => {
    storage.clearAuth();
    localStorage.setItem(TOKEN_KEY, (token))
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
    const roleIdStored = storage.getRoleId();
    //setRoleId(roleIdStored);
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getData: () => {
    const data = localStorage.getItem(DATA_KEY)
    return data ? JSON.parse(data) : null
  },

  getRoleId: () => {
    const data = localStorage.getItem(DATA_KEY)
    if (data) {
      const parsedData = JSON.parse(data)
      return parsedData.roleId || null
    }
    return null
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(DATA_KEY)
    //setRoleId(null);
  }
}
