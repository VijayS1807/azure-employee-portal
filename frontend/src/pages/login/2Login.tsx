import {
  //Grid,
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  useMediaQuery,
  InputAdornment,
  IconButton 
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
//import { login } from '../../services/auth.service'
import { loginService as login } from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import loginBackground from '../../assets/LoginBackground.jpg'

const BRAND_PRIMARY = '#7367F0'

const Login = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);


  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    username: '',
    password: ''
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
    anchorOrigin: { vertical: 'top', horizontal: 'right' }
  })
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    })

    setErrors({
    ...errors,
    [e.target.name]: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors = {
      username: '',
      password: ''
    }

    let isValid = true

    if (!formValues.username) {
      newErrors.username  = 'Username or Email is required'
      //console.log("Validation error: Username is required");
      isValid = false
    }

    if (!formValues.password) {
      newErrors.password  = 'Password is required'
      //console.log("Validation error: Password is required");  
      isValid = false
    }

    setErrors(newErrors)

    if (!isValid) return

      try {
        setLoading(true)

        const payload = {
          ...formValues,
          // Login_Latitude: 0.1,
          // Login_Longitude: 0.1,
          // Login_Accuracy: 0.1,
          // Show_Password: true
        }

        console.log("Submitting login with payload:", payload, "formValues:", formValues); 

        const response = await login(payload)

        setSnackbar({
          open: true,
          message: response.message || 'Login successful',
          severity: 'success',
          anchorOrigin: { vertical: "top", horizontal: "right" }
        })

        setTimeout(() => navigate('/employee'), 1200)
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error.message || 'Invalid username or password',
          severity: 'error',
          anchorOrigin: { vertical: "top", horizontal: "right" }
        })
      } finally {
      setLoading(false)
    }
  }

  return (
    <Grid
      container
      sx={{
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #eef2f7 0%, #dfe7f3 100%)'
      }}
    >
      {/* LEFT IMAGE – Desktop Only */}
      {isMdUp && (
        <Grid   
          size ={{ xs: 0, md: 7 }}      
          //md={7}
          sx={{
            height: '100vh',
            backgroundImage: `url(${loginBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}

      {/* RIGHT LOGIN FORM */}
      <Grid
        size={{ xs: 12, md: 5 }}
        // xs={12}
        // md={5}
        sx={{
          display: 'flex',
          alignItems: isMdUp ? 'center' : 'flex-start',
          justifyContent: 'center',
          padding: isMdUp ? 6 : 3,
          backgroundColor: '#fff'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Card
            elevation={0}
            sx={{
              p: 0
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              gutterBottom
            >
              Welcome You... 👋
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Please sign-in to your account to continue.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 4 }}
              noValidate
            >
              <TextField
                fullWidth
                size="medium"
                label="Username / Email"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                //required
                error={!!errors.username}
                helperText={errors.username}
                margin="normal"
                // 
                 slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon sx={{ color: BRAND_PRIMARY }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formValues.password}
                onChange={handleChange}
                //required
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                // InputProps={{
                //   startAdornment: (
                //     <LockOutlinedIcon
                //       sx={{ mr: 1, color: BRAND_PRIMARY }}
                //     />
                //   )
                // }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: BRAND_PRIMARY }} />
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  fontWeight: 500,
                  backgroundColor: BRAND_PRIMARY,
                  '&:hover': {
                    backgroundColor: BRAND_PRIMARY
                  }
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Box>

            {/* CONTACT ICONS */}
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                gap: 4
              }}
            >
              <MailOutlineIcon sx={{ color: BRAND_PRIMARY }} />
              <PhoneOutlinedIcon sx={{ color: BRAND_PRIMARY }} />
              <WhatsAppIcon sx={{ color: BRAND_PRIMARY }} />
            </Box>
          </Card>
        </Box>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() =>
          setSnackbar({ ...snackbar, open: false })
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default Login;
