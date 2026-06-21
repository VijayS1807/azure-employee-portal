import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import UfoursCompanyLogo from '../../assets/UfoursCompanyLogo.webp';
import microsoftTeamsImage from '../../assets/microsoftTeamsImage.png';
import LogoutIcon from '@mui/icons-material/Logout';
import { storage } from '../../utils/storage';
import { useDialogs } from '../../hooks/useDialogs/useDialogs';
import useNotifications from '../../hooks/useNotifications/useNotifications'

import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { useAuth } from '../../context/AuthContext';
import Menu from "@mui/material/Menu";
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Button from '@mui/material/Button';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderWidth: 0,
  borderBottomWidth: 1,
  borderStyle: 'solid',
  borderColor: (theme.vars ?? theme).palette.divider,
  boxShadow: 'none',
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoContainer = styled('div')({
  position: 'relative',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  '& img': {
    maxHeight: 40,
  },
});

export interface HeaderProps {
  logo?: React.ReactNode;
  title?: string;
  menuOpen: boolean;
  onToggleMenu: (open: boolean) => void;
}

export default function Header({
  logo,
  title,
  menuOpen,
  onToggleMenu,
}: HeaderProps) {
  const { logout } = useAuth();
  
  const theme = useTheme();

  const handleMenuOpen = React.useCallback(() => {
    onToggleMenu(!menuOpen);
  }, [menuOpen, onToggleMenu]);

  const getMenuIcon = React.useCallback(
    (isExpanded: boolean) => {
      const expandMenuActionText = 'Expand';
      const collapseMenuActionText = 'Collapse';

      return (
        // <Tooltip
        //   title={`${isExpanded ? collapseMenuActionText : expandMenuActionText} menu`}
        //   enterDelay={1000}
        // >
        //   <div >
        //     <IconButton
        //       size="small"
        //       aria-label={`${isExpanded ? collapseMenuActionText : expandMenuActionText} navigation menu`}
        //       onClick={handleMenuOpen}
        //     >
        //       {isExpanded ? <MenuOpenIcon /> : <MenuIcon />}
        //     </IconButton>
        //   </div>
        // </Tooltip>

        //my custome code
        <Box
          display="flex"
          alignItems="center"
          gap={1}   // spacing between icon and logo
        >
          <IconButton
            size="small"
            aria-label={`${isExpanded ? collapseMenuActionText : expandMenuActionText} navigation menu`}
            onClick={handleMenuOpen}
          >
            {isExpanded ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>

          <Box
            component="img"
            //src={UfoursCompanyLogo}
            src={microsoftTeamsImage}
            alt="logo"
            sx={{
              height: 35,
              display: "block",
            }}
          />
        </Box>
      );
    },
    [handleMenuOpen],
  );

  const [openLogout, setOpenLogout] = React.useState(false);
const navigate = useNavigate();
const dialogs = useDialogs();
const notifications = useNotifications();

// const handleLogout = () => {
//   storage.clearAuth();
//   navigate("/login");
// };

 const handleLogout = React.useCallback(
    () => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to logout?`,
        {
          title: `Logout?`,
          severity: 'error',
          okText: 'Logout',
          cancelText: 'Cancel',
        },
      );

      if (confirmed) {
        // setIsLoading(true);
        try {
            // storage.clearAuth();
            // navigate("/login");
            logout();

          notifications.show('Logged out successfully.', {
            severity: 'success',
            autoHideDuration: 3000,
          });
          // loadData();
        } catch (logoutError) {
          notifications.show(
            `Failed to logout. Reason:' ${(logoutError as Error).message}`,
            {
              severity: 'error',
              autoHideDuration: 3000,
            },
          );
        }
        // setIsLoading(false);
      }
    },
    [dialogs, notifications, navigate],
  );


   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  type Props = {
  fullName: string;
  roleName: string;
};

const fullName = storage.getData()?.fullName || "";
const roleName = storage.getData()?.roleName || "";

  return (
    <AppBar color="inherit" position="absolute" sx={{ displayPrint: 'none' }}>
      <Toolbar sx={{ backgroundColor: 'inherit', mx: { xs: -0.75, sm: -1 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="between" spacing={2}>
            <Box sx={{ mr: 1 }}>{getMenuIcon(menuOpen)}</Box>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Stack direction="row" alignItems="center">
                {logo ? <LogoContainer>{logo}</LogoContainer> : null}
                {title ? (
                  <Typography
                    variant="h6"
                    sx={{
                      color: (theme.vars ?? theme).palette.primary.main,
                      fontWeight: '700',
                      ml: 1,
                      whiteSpace: 'nowrap',
                      lineHeight: 1,
                    }}
                  >
                    {title}
                  </Typography>
                ) : null}
              </Stack>
            </Link>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ marginLeft: 'auto' }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              {/* <Tooltip title="Logout" enterDelay={1000}>
                <IconButton
                  size="small"
                  aria-label="Logout"
                  onClick={handleLogout()}
                  sx={{
                    color: (theme.vars ?? theme).palette.primary.main,
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip> */}








              {/* <Tooltip title="User" enterDelay={1000}>
                <IconButton
                  size="small"
                  aria-label="User"
                  onClick={handleClick}
                  sx={{
                    color: (theme.vars ?? theme).palette.primary.main,
                  }}
                >
                  <AccountCircleIcon />
                </IconButton> */}

               
              <IconButton onClick={handleClick} size="small">
                <Avatar>
                  {fullName?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <Box px={1} py={1}  display="flex" alignItems="center" justifyContent="space-between">
                      <PersonIcon/>
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {fullName}
                      </Typography>
                    </Box>

                    {/* <Divider /> */}

                    <Box px={1} py={1} display="flex" alignItems="center" justifyContent="space-between">
                       <AdminPanelSettingsIcon/>
                      <Typography variant="body2" color="text.secondary">
                        {roleName}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box px={1} py={1} display="flex" alignItems="center" justifyContent="space-between">
                      {/* <IconButton
                        size="small"
                        aria-label="Logout"
                        onClick={handleLogout()}
                        sx={{
                          color: (theme.vars ?? theme).palette.primary.main,
                        }}
                      > */}
                        <LogoutIcon 
                         aria-label="Logout"
                         onClick={handleLogout()}
                         sx={{
                          color: (theme.vars ?? theme).palette.primary.main,
                         }}
                        /> 
                      {/* </IconButton>  */}
                       <Typography variant="body2" color="text.secondary">Logout</Typography>
                    </Box>
                     <Box sx={{ borderTop: '1px solid', borderColor: (theme.vars ?? theme).palette.divider, my: 1 }} />
                    {/*<Box px={1} py={1} display="flex" alignItems="center" justifyContent="space-between">
                        <Button
                          startIcon={<LogoutIcon />}
                          onClick={handleLogout}
                          color="error"
                        >
                          Logout
                      </Button>
                    </Box> */}
                  </Menu>
                  
              {/* </Tooltip> */}










              
              <Tooltip title="Logout" enterDelay={1000}>
                <IconButton
                  size="small"
                  aria-label="Logout"
                  // onClick={() => {
                  //   // Implement logout functionality here
                  //   setOpenLogout(true);
                  //   console.log('Logout clicked');
                  // }}
                  onClick={handleLogout()}
                  sx={{
                    color: (theme.vars ?? theme).palette.primary.main,
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
              <ThemeSwitcher />
            </Stack>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
