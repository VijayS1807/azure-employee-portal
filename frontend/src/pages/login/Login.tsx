import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
//import ForgotPassword from './components/ForgotPassword';
import AppTheme from '../../../src/theme/AppTheme';
import ColorModeSelect from '../../theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../../components/CustomIcons';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

//import { login } from '../../services/authService'

import { loginService as loginService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
//import { useNavigate } from 'react-router/dist/lib/hooks';

import { useNavigate } from "react-router-dom";
//import loginBackground from '../../assets/LoginBackground.jpg'
import Grid from '@mui/material/Grid';
//import UfoursCompanyLogo from '../../assets/UfoursCompanyLogo.webp';
//import microsoftteams-image.png from '../../assets/microsoftteams-image.png';
import microsoftTeamsImage from '../../assets/microsoftTeamsImage.png';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import { storage } from '../../utils/storage';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Login(props: { disableCustomTheme?: boolean }) {
  const { login } = useAuth();
  const { token, roleId } = useAuth();
  const navigate = useNavigate();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (!token) return;
    const role = Number(roleId);
    if (role === 1) {
      navigate("/employee", { replace: true });
    } else if (role === 2) {
      navigate("/leaves/apply", { replace: true });
    }
  }, [token, roleId, navigate]);

  const [loading, setLoading] = React.useState(false)
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
    anchorOrigin: { vertical: 'top', horizontal: 'right' }
  })
  const [formValues, setFormValues] = React.useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = React.useState(false);

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   if (emailError || passwordError) {
  //     event.preventDefault();
  //     return;
  //   }
  //   // const data = new FormData(event.currentTarget);
  //   // console.log({
  //   //   email: data.get('email'),
  //   //   password: data.get('password'),
  //   // });

  //   //my custom code

  //         try {
  //           setLoading(true)
    
  //           const payload = {
  //             ...formValues,
  //             // Login_Latitude: 0.1,
  //             // Login_Longitude: 0.1,
  //             // Login_Accuracy: 0.1,
  //             // Show_Password: true
  //           }
    
  //           const response = await login(payload)
    
  //           setSnackbar({
  //             open: true,
  //             message: response.message || 'Login successful',
  //             severity: 'success',
  //             anchorOrigin: { vertical: "top", horizontal: "right" }
  //           })
    
  //           setTimeout(() => navigate('/employees'), 1200)
  //         } catch (error: any) {
  //           setSnackbar({
  //             open: true,
  //             message: error.message || 'Invalid username or password',
  //             severity: 'error',
  //             anchorOrigin: { vertical: "top", horizontal: "right" }
  //           })
  //         } finally {
  //         setLoading(false)
  //   //////
  // };
const notifications = useNotifications();

const handleSubmit = async (
event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault(); // always prevent first

  if (emailError || passwordError) {
    return;
  }

  try {
    setLoading(true);

    const payload = {
      ...formValues,
    };

    // const response = await login(payload);

    // //console.log("Login response:", response);

    // // setSnackbar({
    // //   open: true,
    // //   message: response.message || "Login successful",
    // //   severity: "success",
    // //   anchorOrigin: { vertical: "top", horizontal: "right" },
    // // });
    // // console.log("Navigating to /employee after successful login");
    // //setTimeout(() => navigate("/employee"), 1200);
    // if(response.success) {
    //   // setSnackbar({
    //   //   open: true,
    //   //   message: response.message || "Login successful",
    //   //   severity: "success",
    //   //   anchorOrigin: { vertical: "top", horizontal: "right" },
    //   // });
    //   const tokenFromStorage = localStorage.getItem('auth_token');
    //   //console.log("Token from storage before notification:", tokenFromStorage);
    //   notifications.show('Logged in successfully.', {
    //     severity: 'success',
    //     autoHideDuration: 3000,
    //     //onClose: () => navigate("/employee")
    //   });
    //   //console.log("Token from storage after notification:", tokenFromStorage);

    //   const role =  storage.getRoleId();
    //   //console.log("User role from storage:", role);
    //   if(role === 1) {
    //     navigate("/employee", { replace: true });
    //   } else {
    //     navigate("/leaves/apply", { replace: true });
    //   }
    //   //setTimeout(() => navigate("/employee"), 1200);
    //   //setRedirect(true);
    //   //console.log("Navigating to /employee after successful login");

    //   window.location.href = role === 1 ? "/employee" : "/leaves/apply";
    // } else {
    //   // setSnackbar({
    //   //   open: true,
    //   //   message: response.message || "Login failed",
    //   //   severity: "error",
    //   //   anchorOrigin: { vertical: "top", horizontal: "right" },
    //   // });
    //   notifications.show(response.message || 'Login failed', {
    //     severity: 'error',
    //     autoHideDuration: 3000,
    //   });
    //   console.error("Login failed, response:", response); 
    // }


      const response = await loginService(payload);

      if (response.success) {
        storage.setAuth(response.data?.token || "", response?.data! || {});
        login(response.data?.token || "", response?.data! || {});
        notifications.show("Logged in successfully.", {
          severity: "success",
          autoHideDuration: 3000,
        });
        // navigation is handled by the auth useEffect (token/roleId change)
      } else {
        notifications.show(response.message || "Login failed", {
          severity: "error",
          autoHideDuration: 3000,
        });
      }

  } catch (error: any) {
    console.error("Login error:", error);
    // if(error.response?.success === false) {
    //   setSnackbar({
    //     open: true,
    //     message: "Unauthorized: Invalid username or password",
    //     severity: "error",
    //     anchorOrigin: { vertical: "top", horizontal: "right" },
    //   });
    // } else {
    //   setSnackbar({
    //     open: true,
    //     message: error?.message || "Invalid username or password",
    //     severity: "error",
    //     anchorOrigin: { vertical: "top", horizontal: "right" },
    // });
    // }

  } finally {
    setLoading(false);
  }
};


  const validateInputs = () => {
    const email = document.getElementById('username') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  //my custome code

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    })

    // setErrors({
    // ...errors,
    // [e.target.name]: ''
    // })
  }

  /////
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          {/* <SitemarkIcon /> */}
          {/* <Grid   
            size ={{ xs: 0, md: 7 }}      
            //md={7}
            sx={{
              height: '100vh',
              backgroundImage: `url(${loginBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat'
            }}
          /> */}
          <Box
            component="img"
            src={microsoftTeamsImage}
            alt="logo"
            sx={{
              height: "auto",
              display: "block",
              width: "clamp(150px, 40%, 300px)",
              marginBottom: 2,
              marginTop: 2,
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="username">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="username"
                type="email"
                name="username"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                //type="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                onChange={handleChange}
                                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon 
                        //sx={{ color: BRAND_PRIMARY }} 
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign in
            </Button>
            {/* <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link> */}
          </Box>
          {/* <Divider>or</Divider> */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button> */}
            {/* <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/material-ui/getting-started/templates/sign-in/"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign up
              </Link>
            </Typography> */}
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
