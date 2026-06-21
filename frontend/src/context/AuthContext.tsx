// // AuthContext.tsx
// import { createContext, useContext, useState } from "react";
// import {
//   setAuthStorage,
//   clearAuthStorage,
//   getRoleFromStorage
// } from "./storage";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [roleId, setRoleId] = useState(getRoleFromStorage());

//   const login = (data) => {
//     setAuthStorage(data);
//     setRoleId(data.roleId); // 🔥 triggers re-render
//   };

//   const logout = () => {
//     clearAuthStorage();
//     setRoleId(null); // 🔥 triggers re-render
//   };

//   return (
//     <AuthContext.Provider value={{ roleId, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


//////


// context/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { storage } from "../utils/storage";
import type { LoginResponse } from "../types/auth.types";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  token: string | null;
  roleId: number | null;
  login: (token: string, data: LoginResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [roleId, setRoleId] = useState<number | null>(storage.getRoleId());

  const login = (token: string, data: LoginResponse) => {
    storage.setAuth(token, data);
    setToken(token);
    setRoleId(data.roleId);
  };

  //const navigate = useNavigate();

  const logout = () => {
    storage.clearAuth();
    setToken(null);
    setRoleId(null);
    //navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      setRoleId(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, roleId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used inside AuthProvider");
  return context;
};