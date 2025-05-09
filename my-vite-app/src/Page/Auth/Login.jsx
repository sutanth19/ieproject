import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from '../../context_themes/ThemeContext';
import '../Css/Global.css';

const Login = ({ onLoginSuccess }) => {
  const { darkMode } = useTheme();
  const { login, handleLoginSuccess } = useAuth(); 
  const [userNtId, setUserNtId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!userNtId || userNtId.trim() === '') {
      newErrors.userNtId = 'User ID is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const result = await login(userNtId, password);
      
      if (result.success) {
        setAlert({
          open: true,
          message: 'Login successful!',
          severity: 'success'
        });
        
        setTimeout(() => {
          handleLoginSuccess();
          
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 1500);
      } else {
        setAlert({
          open: true,
          message: result.message || 'Login failed. Please check credentials.',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setAlert({
        open: true,
        message: 'Network error. Please check connection.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Get the basePath for correct navigation
  const getBasePath = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[1] === 'ieportal' ? '/ieportal' : '';
  };
  
  const basePath = getBasePath();

  return (
    <Box className={`login-container ${darkMode ? 'dark-mode' : ''}`}>
      <Container maxWidth="sm" className="login-content-wrapper">
        <Card raised className={`login-card ${darkMode ? 'dark-mode' : ''}`}>
          <CardContent className="login-card-content">
            <Box className="login-header">
              <LoginIcon className="login-icon" />
              <Typography
                variant="h5"
                component="h1"
                className={`login-title ${darkMode ? 'dark-mode' : ''}`}
              >
                Login
              </Typography>
              <Typography
                variant="body2" 
                className={`login-subtitle ${darkMode ? 'dark-mode' : ''}`}
              >
                Enter credentials to access the IE Portal
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} className="login-form">
              <Box className="form-field">
                <TextField
                  required
                  fullWidth
                  id="userNtId"
                  label="User ID"
                  name="userNtId"
                  autoComplete="username"
                  autoFocus
                  value={userNtId}
                  onChange={(e) => setUserNtId(e.target.value)}
                  error={!!errors.userNtId}
                  helperText={errors.userNtId}
                  size="small" 
                  className={`input-field ${darkMode ? 'dark-mode' : ''}`}
                />
              </Box>
              
              <Box className="form-field-password">
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  size="small"
                  className={`input-field ${darkMode ? 'dark-mode' : ''}`}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          size="small"
                          className={`password-toggle-button ${darkMode ? 'dark-mode' : ''}`}
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'LOGIN'}
              </Button>
              
              <Typography 
                variant="body2" 
                className={`signup-text ${darkMode ? 'dark-mode' : ''}`}
              >
                Don't have an account?{' '}
                <Link 
                  to={`${basePath}/register`}
                  className="signup-link"
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
      
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          variant="filled"
          elevation={6}
          className="login-alert"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;