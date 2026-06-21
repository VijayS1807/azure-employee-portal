import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createHashRouter,
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import MainLayout from "./MainLayout";
import Layout from "../components/layout/Layout";
import EmployeeList from "../pages/employee/EmployeeList";
import LeaveList from "../pages/leaveManagement/LeaveList";
import PendingLeaveList from "../pages/leaveManagement/PendingLeaveList";
import EmployeeShow from "../pages/employee/EmployeeShow";
import EmployeeCreate from "../pages/employee/EmployeeCreate";
import EmployeeEdit from "../pages/employee/EmployeeEdit";
import NotificationsProvider from "../hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "../hooks/useDialogs/DialogsProvider";
import AppTheme from "../theme/AppTheme";
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from "../theme/customizations";
import { PropsWithChildren } from "react";
import { storage } from "../utils/storage";
import Login from "../pages/login/Login";
import { useAuth } from "../context/AuthContext";
import { AuthProvider } from "../context/AuthContext";
import ReportDataTableBuilder from "../pages/ReportBuilder/ReportDataTableBuilder";
import ReportDesigner from "../pages/ReportDesigner/ReportDesigner";
import QueryBuilderPage from "../pages/queryBuilder/QueryBuilderPage";
import QueryBuilderList from "../pages/queryBuilder/QueryBuilderList";

// const router = createHashRouter([
//   {
//     Component: Layout,
//     children: [
//       {
//         path: '/employees',
//         Component: EmployeeList,
//       },
//       {
//         path: '/employees/:employeeId',
//         Component: EmployeeShow,
//       },
//       {
//         path: '/employees/new',
//         Component: EmployeeCreate,
//       },
//       {
//         path: '/employees/:employeeId/edit',
//         Component: EmployeeEdit,
//       },
//       // Fallback route for the example routes in dashboard sidebar items
//       {
//         path: '*',
//         Component: EmployeeList,
//       },
//     ],
//   },
// ]);

///////

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

const role = getRole();
//console.log("User role from storage:", role);

const router = createBrowserRouter([
  // Public Route
  {
    path: "/login",
    element: <Login />,
  },

  // Protected Layout Wrapper
  {
    path: "/",
    element: role ? <Layout /> : <Navigate to="/login" />,
    children: [
      // Admin Routes
      ...(role === "Admin"
        ? [
            {
              path: "employee",
              element: <EmployeeList />,
            },
            // {
            //   path: "dashboard",
            //   element: <EmployeeDashboard />,
            // },
            // {
            //   path: "leaves/apply",
            //   element: <LeaveList />,
            // },
            {
              path: "leaves/approve",
              element: <PendingLeaveList />,
            },
            {
              path: "report/createReport",
              element: <ReportDataTableBuilder />,
            },
            {
              path: "report/createReportDesign",
              element: <ReportDesigner />,
            },
            {
              path: "queryBuilder",
              element: <QueryBuilderPage />,
            },
            {
              path: "queryBuilder/list",
              element: <QueryBuilderList />,
            },
          ]
        : []),

      // Employee Routes
      ...(role === "Employee"
        ? [
            // {
            //   path: "dashboard",
            //   element: <EmployeeDashboard />,
            // },
            {
              path: "leaves/apply",
              element: <LeaveList />,
            },
          ]
        : []),

      // Fallback inside protected area
      {
        path: "*",
        element: <Navigate to="/leaves/apply" />,
      },
    ],
  },

  // Global fallback
  {
    path: "*",
    //element: <Navigate to={role ? "/leaves/apply" : "/login"} />,
    element: <Navigate to={"/login"} />,
  },
]);

///////
// interface RequireAuthProps {
//   allowedRoles: string[];
//   children: React.ReactNode;
// }

// const RequireAuth = ({ allowedRoles, children }: RequireAuthProps) => {
//   const role = localStorage.getItem("role"); // or context

//   if (!role) return <Navigate to="/login" replace />;

//   if (!allowedRoles.includes(role))
//     return <Navigate to="/login" replace />;

//   return children;
// };

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       {
//         path: "employee",
//         element: (
//           <RequireAuth allowedRoles={["Admin"]}>
//             <EmployeeList />
//           </RequireAuth>
//         ),
//       },
//     ],
//   },
// ]);

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

//export default function AppLayout(props: { disableCustomTheme?: boolean }) {
export default function AppLayout(
  props: PropsWithChildren<{ disableCustomTheme?: boolean }>,
) {
  const { roleId } = useAuth();

  const router = createBrowserRouter([
    // Public Route
    {
      path: "/login",
      element: <Login />,
    },

    // Protected Layout Wrapper
    {
      path: "/",
      element: roleId ? <Layout /> : <Navigate to="/login" />,
      children: [
        // Admin Routes
        ...(roleId === 1
          ? [
              {
                path: "employee",
                element: <EmployeeList />,
              },
              // {
              //   path: "dashboard",
              //   element: <EmployeeDashboard />,
              // },
              // {
              //   path: "leaves/apply",
              //   element: <LeaveList />,
              // },
              {
                path: "leaves/approve",
                element: <PendingLeaveList />,
              },
              {
                path: "report/createReport",
                element: <ReportDataTableBuilder />,
              },
              {
                path: "report/createReportDesign",
                element: <ReportDesigner />,
              },
              {
                path: "queryBuilder",
                element: <QueryBuilderPage />,
              },
              {
                path: "queryBuilder/list",
                element: <QueryBuilderList />,
              },
            ]
          : []),

        // Employee Routes
        ...(roleId === 2
          ? [
              // {
              //   path: "dashboard",
              //   element: <EmployeeDashboard />,
              // },
              {
                path: "leaves/apply",
                element: <LeaveList />,
              },
            ]
          : []),

        // Fallback inside protected area
        {
          path: "*",
          element: <Navigate to="/leaves/apply" />,
        },
      ],
    },

    // Global fallback
    {
      path: "*",
      //element: <Navigate to={role ? "/leaves/apply" : "/login"} />,
      element: <Navigate to={"/login"} />,
    },
  ]);

  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <RouterProvider router={router} />
          {/* <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider> */}
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
