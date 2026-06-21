// import React, { useState } from "react";
// import {
//   Drawer,
//   Box,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import EventNoteIcon from "@mui/icons-material/EventNote";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   open: boolean;
// }

// const drawerWidth = 240;
// const collapsedWidth = 70;

// const Sidebar: React.FC<Props> = ({ open }) => {
//   const navigate = useNavigate();
//   const [hovered, setHovered] = useState(false);

//   const expanded = open || hovered;

//   const renderMenuItem = (
//     label: string,
//     icon: React.ReactNode,
//     path: string
//   ) => (
//     <Tooltip
//       title={!expanded ? label : ""}
//       placement="right"
//       arrow
//     >
//       <ListItemButton
//         onClick={() => navigate(path)}
//         sx={{
//           px: 2,
//           py: 1.5,
//           "&:hover": { backgroundColor: "#374151" },
//         }}
//       >
//         <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
//           {icon}
//         </ListItemIcon>

//         {expanded && (
//           <ListItemText
//             primary={label}
//             // primaryTypographyProps={{ fontSize: 14 }}
//           />
//         )}
//       </ListItemButton>
//     </Tooltip>
//   );

//   return (
//     <Drawer
//       variant="permanent"
//       onMouseEnter={() => !open && setHovered(true)}
//       onMouseLeave={() => !open && setHovered(false)}
//       sx={{
//         width: expanded ? drawerWidth : collapsedWidth,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: expanded ? drawerWidth : collapsedWidth,
//           transition: "0.3s",
//           backgroundColor: "#2f3e4e",
//           color: "#fff",
//           overflowX: "hidden",
//         },
//       }}
//     >
//       {/* LOGO AREA */}
//       <Box
//         sx={{
//           height: 64,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: expanded ? "flex-start" : "center",
//           px: 2,
//           borderBottom: "1px solid rgba(255,255,255,0.1)",
//         }}
//       >
//         <img
//           src="/assets/UfoursCompanyLogo.webp"
//           alt="logo"
//           style={{ height: 35, marginRight: expanded ? 10 : 0 }}
//         />
//         {expanded && (
//           <Typography variant="h6" fontWeight={600}>
//             UFOURS
//           </Typography>
//         )}
//       </Box>

//       {/* MENU ITEMS */}
//       <List sx={{ mt: 1 }}>
//         {renderMenuItem(
//           "Employee Dashboard",
//           <DashboardIcon />,
//           "/dashboard"
//         )}

//         {renderMenuItem(
//           "Employee Management",
//           <PeopleIcon />,
//           "/employee"
//         )}

//         {renderMenuItem(
//           "Leave Management",
//           <EventNoteIcon />,
//           "/leave-management"
//         )}
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;
