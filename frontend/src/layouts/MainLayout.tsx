// // import { useState } from "react";
// // import { Box } from "@mui/material";
// // import Header from "../components/layout/Header";
// // import Sidebar from "./../components/layout/Sidebar";

// // const Layout = ({ children }: any) => {
// //   const [open, setOpen] = useState(true);

// //   const toggleSidebar = () => setOpen(!open);

// //   return (
// //     <Box sx={{ display: "flex" }}>
// //       <Header open={open} toggleSidebar={toggleSidebar} />
// //       <Sidebar open={open} />

// //       {/* MAIN BODY */}
// //       <Box
// //         component="main"
// //         sx={{
// //           flexGrow: 1,
// //           marginTop: "64px",
// //         //   marginLeft: open ? "240px" : "70px",
// //         //   transition: "0.3s",
// //           marginLeft: open ? "240px" : "70px",
// //           transition: "margin-left 0.3s ease",

// //           p: 3,
// //           minHeight: "100vh",
// //           backgroundColor: "#f5f6fa",
// //         }}
// //       >
// //         {children}
// //       </Box>
// //     </Box>
// //   );

// // // return (
// // //   <Box sx={{ display: "flex" }}>
// // //     {/* SIDEBAR FIRST */}
// // //     <Sidebar open={open} />

// // //     {/* HEADER AFTER SIDEBAR */}
// // //     <Header open={open} toggleSidebar={toggleSidebar} />

// // //     {/* MAIN BODY */}
// // //     <Box
// // //       component="main"
// // //       sx={{
// // //         flexGrow: 1,
// // //         marginTop: "64px",
// // //         marginLeft: open ? "240px" : "70px",
// // //         transition: "0.3s",
// // //         p: 3,
// // //         minHeight: "100vh",
// // //         backgroundColor: "#f5f6fa",
// // //       }}
// // //     >
// // //       {children}
// // //     </Box>
// // //   </Box>
// // // );


// // };

// // export default Layout;


// import { useState } from "react";
// import { Box } from "@mui/material";
// import Header from "../components/layout/Header";
// import Sidebar from "../components/layout/Sidebar";
// import { Outlet } from "react-router-dom";

// const drawerWidth = 240;
// const collapsedWidth = 70;

// const Layout = ({ children }: any) => {
//   const [open, setOpen] = useState(true);

//   const sidebarWidth = open ? drawerWidth : collapsedWidth;

//   return (
//     <>
//     <Box sx={{ display: "flex", height: "100vh" }}>
      
//        {/* SIDEBAR */}
//      <Sidebar open={open} />

//       {/* RIGHT SIDE */}
//     <Box
//         sx={{
//           flexGrow: 1,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Header open={open} toggleSidebar={() => setOpen(!open)} />

//         <Box
//           sx={{
//             flexGrow: 1,
//             backgroundColor: "#f5f6fa",
//             p: 3,
//             overflow: "auto",
//           }}
//         >
//           {children}
//               <Outlet />
//         </Box>
//       </Box>
//     </Box>
//     </>
//   );
// };

// export default Layout;


////////


import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Outlet } from 'react-router';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import SitemarkIcon from '../components/layout/SitemarkIcon';

export default function MainLayout() {
  const theme = useTheme();

  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] =
    React.useState(true);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] =
    React.useState(false);

  const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));

  const isNavigationExpanded = isOverMdViewport
    ? isDesktopNavigationExpanded
    : isMobileNavigationExpanded;

  const setIsNavigationExpanded = React.useCallback(
    (newExpanded: boolean) => {
      if (isOverMdViewport) {
        setIsDesktopNavigationExpanded(newExpanded);
      } else {
        setIsMobileNavigationExpanded(newExpanded);
      }
    },
    [
      isOverMdViewport,
      setIsDesktopNavigationExpanded,
      setIsMobileNavigationExpanded,
    ],
  );

  const handleToggleHeaderMenu = React.useCallback(
    (isExpanded: boolean) => {
      setIsNavigationExpanded(isExpanded);
    },
    [setIsNavigationExpanded],
  );

  const layoutRef = React.useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={layoutRef}
      sx={{
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
      }}
    >
      <Header
        logo={<SitemarkIcon />}
        title=""
        menuOpen={isNavigationExpanded}
        onToggleMenu={handleToggleHeaderMenu}
      />
      <Sidebar
        expanded={isNavigationExpanded}
        setExpanded={setIsNavigationExpanded}
        container={layoutRef?.current ?? undefined}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
        }}
      >
        <Toolbar sx={{ displayPrint: 'none' }} />
        <Box
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
