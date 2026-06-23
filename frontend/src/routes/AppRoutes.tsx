//hotel

// import { Routes, Route, Navigate } from 'react-router-dom'
// import Login from '../pages/login/Login'
// import Dashboard from '../pages/dashboard/Dashboard'
// import ProtectedRoute from '../components/common/ProtectedRoute'
// import AppLayout from '../layouts/AppLayout'
// //import DynamicPage from '../pages/DynamicPage'

// const AppRoutes = () => (
//   <Routes>
//     {/* Public */}
//     <Route path="/login" element={<Login />} />

//     {/* Protected Layout */}
//     <Route
//       element={
//         <ProtectedRoute>
//           <AppLayout />
//         </ProtectedRoute>
//       }
//     >
//       <Route path="/dashboard" element={<Dashboard />} />
//        {/* Catch all dynamic paths */}
//        {/* <Route path="/*" element={<DynamicPage />} /> */}
//     </Route>

//     {/* Fallback */}
//     <Route path="*" element={<Navigate to="/login" replace />} />
//   </Routes>
// )

// export default AppRoutes

/////

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/login/Login";
import EmployeeList from "../pages/employee/EmployeeList";
//import EmployeeDashboard from "../pages/Dashboard/EmployeeDashboard";
//import LeaveManagement from "../pages/LeaveManagement/LeaveManagement";
import { storage } from "../utils/storage";
import Layout from "../components/layout/Layout";
import AppLayout from "../layouts/AppLayout";
import LeaveList from "../pages/leaveManagement/LeaveList";
import PendingLeaveList from "../pages/leaveManagement/PendingLeaveList";
import ReportDataTableBuilder from "../pages/ReportBuilder/ReportDataTableBuilder";
import ReportDesigner from "../pages/ReportDesigner/ReportDesigner";
import QueryBuilderPage from "../pages/queryBuilder/QueryBuilderPage";
import QueryBuilderList from "../pages/queryBuilder/QueryBuilderList";

const getRole = (): "Admin" | "Employee" | null => {
  // const token = localStorage.getItem("auth_token");
  // const role = localStorage.getItem("auth_role"); // better store role separately
  // return token && role ? (role as "Admin" | "Employee") : null;
  const data = storage.getData();
  //console.log("Data from storage:", data);
  const roleName = data?.roleName;
  if (roleName === "Admin" || roleName === "Employee") {
    return roleName;
  }
  return null;
};

const AppRoutes = () => {
  //console.log("Checking user role for routing...");
  const role = getRole();
  //console.log("User role from storage:", role);

  return (
    // <AppLayout>
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        {role ? (
          <Route element={<Layout />}>
            {/* Admin Routes */}
            {role === "Admin" && (
              <>
                {/* <Route path="/dashboard" element={<EmployeeDashboard />} /> */}
                <Route path="employee" element={<EmployeeList />} />
                {/* <Route path="leaves/apply" element={<LeaveList />} /> */}
                <Route path="leaves/approve" element={<PendingLeaveList />} />
                <Route
                  path="report/createReport"
                  element={<ReportDataTableBuilder />}
                />
                <Route
                  path="report/createReportDesign"
                  element={<ReportDesigner />}
                />
                <Route path="queryBuilder" element={<QueryBuilderPage />} />
                <Route
                  path="queryBuilder/list"
                  element={<QueryBuilderList />}
                />
                {/* <Outlet /> */}
              </>
            )}

            {/* Employee Routes */}
            {role === "Employee" && (
              <>
                {/* <Route path="/dashboard" element={<EmployeeDashboard />} /> */}
                <Route path="leaves/apply" element={<LeaveList />} />
              </>
            )}

            {/* Redirect unknown paths to the role's home */}
            <Route
              path="*"
              element={
                <Navigate to={role === "Admin" ? "/employee" : "/leaves/apply"} replace />
              }
            />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
    // </AppLayout>
  );
};

export default AppRoutes;
