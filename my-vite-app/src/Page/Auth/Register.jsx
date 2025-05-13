import React, { useState, useEffect } from 'react';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from '../../themes/ThemeContext';
import '../Css/Global.css';

const Register = () => {
  const { darkMode } = useTheme();
  const { register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [userNtId, setUserNtId] = useState('');
  const [userRole, setUserRole] = useState('User');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});

  // Get the basePath for correct navigation
  const getBasePath = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[1] === 'ieportal' ? '/ieportal' : '';
  };
  
  const basePath = getBasePath();
  
  useEffect(() => {
    const currentPath = location.pathname;
    const correctPath = `${basePath}/register`;
    
    if (currentPath !== correctPath && currentPath !== '/register') {
      window.location.href = `${window.location.origin}${correctPath}`;
    }
  }, [location.pathname, basePath]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!userNtId || userNtId.trim() === '') {
      newErrors.userNtId = 'User ID is required';
    }
    
    if (!userRole) {
      newErrors.userRole = 'User Role is required';
    } else if (!['Admin', 'User', 'Guest'].includes(userRole)) {
      newErrors.userRole = 'Role must be Admin, User, or Guest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const result = await register(userNtId, userRole);
      
      if (result.success) {
        setAlert({
          open: true,
          message: result.message || 'Registration successful! You can now login.',
          severity: 'success'
        });
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate(`${basePath}/login`);
        }, 2000);
      } else {
        setAlert({
          open: true,
          message: result.message || 'Registration failed. Please try again.',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
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

  return (
    <Box className={`register-container ${darkMode ? 'dark-mode' : ''}`}>
      <Container maxWidth="sm" className="register-content-wrapper">
        <Card raised className={`register-card ${darkMode ? 'dark-mode' : ''}`}>
          <CardContent className="register-card-content">
            <Box className="register-header">
              <PersonAddIcon className="register-icon" />
              <Typography
                variant="h5"
                component="h1"
                className={`register-title ${darkMode ? 'dark-mode' : ''}`}
              >
                Register
              </Typography>
              <Typography
                variant="body2" 
                className={`register-subtitle ${darkMode ? 'dark-mode' : ''}`}
              >
                Create a new account for the IE Portal
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} className="register-form">
              <Box className="form-field-register">
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
              
              <Box className="form-field-role">
                <FormControl 
                  fullWidth 
                  error={!!errors.userRole}
                  variant="outlined"
                  size="small"
                  className={`select-field ${darkMode ? 'dark-mode' : ''}`}
                >
                  <InputLabel id="role-label">User Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="userRole"
                    value={userRole}
                    label="User Role"
                    onChange={(e) => setUserRole(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        className: `select-menu ${darkMode ? 'dark-mode' : ''}`,
                      }
                    }}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                  </Select>
                  {errors.userRole && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.userRole}
                    </Typography>
                  )}
                </FormControl>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="register-button"
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'REGISTER'}
              </Button>
              
              <Typography 
                variant="body2" 
                className={`login-text ${darkMode ? 'dark-mode' : ''}`}
              >
                Already have an account?{' '}
                <Link 
                  to={`${basePath}/login`}
                  className="login-link"
                >
                  Login
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
          className="register-alert"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;