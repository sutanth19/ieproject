// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from './../../services/authAPI';
import { getUserInfoFromToken, isTokenExpired, getTokenFromCookies } from './tokenUtils';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const savedToken = localStorage.getItem('authToken');
        
        if (savedToken) {
          if (isTokenExpired(savedToken)) {
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem('authToken');
            console.log('Token expired, clearing auth state');
            setLoading(false);
            return;
          }
          
          setToken(savedToken);
        
          const userInfo = getUserInfoFromToken(savedToken);
          if (userInfo) {
            setUser(userInfo);
            setIsLoggedIn(true);
            console.log('User data extracted from token:', userInfo);
          } else {
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem('authToken');
            setToken(null);
            console.log('Failed to extract user data from token');
          }
        } else {
          const cookieToken = getTokenFromCookies();
          if (cookieToken && !isTokenExpired(cookieToken)) {
            setToken(cookieToken);
            
            const userInfo = getUserInfoFromToken(cookieToken);
            if (userInfo) {
              setUser(userInfo);
              setIsLoggedIn(true);
              console.log('User data extracted from cookie token:', userInfo);
            } else {
              console.log('No valid authentication found');
              setUser(null);
              setIsLoggedIn(false);
            }
          } else {
            console.log('No valid authentication found');
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error('Failed to check authentication status:', error);
        setError('Authentication check failed');
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Register function
  const register = async (userNtid, userRole) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userNtid, userRole);
      console.log('Registration response:', response.data);
      
      return { 
        success: true, 
        message: response.data.message || 'Registration successful!' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (userNtId, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(userNtId, password);
      console.log('Login response:', response.data);
      
      // Store token in API 
      if (response.data && response.data.data) {
        const loginToken = response.data.data;
        localStorage.setItem('authToken', loginToken);
        setToken(loginToken);
        console.log('Token stored in localStorage');
        
        const userInfo = getUserInfoFromToken(loginToken);
        if (userInfo) {
          setUser(userInfo);
          setIsLoggedIn(true);
          console.log('User info extracted from token after login:', userInfo);
          return { success: true };
        } else {
          return { 
            success: false, 
            message: 'Could not retrieve user information from token' 
          };
        }
      } else {
        return {
          success: false,
          message: 'No token received from server'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'Invalid credentials. Please check  username and password.';
      } else if (error.response && error.response.status === 404) {
        errorMessage = 'Login endpoint not found. Please check the API configuration.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error. Please check  connection.';
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('authToken');
      setToken(null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('authToken');
      setToken(null);
      return { success: false, message: 'Logout failed, but you have been logged out locally.' };
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      const currentToken = localStorage.getItem('authToken');
      if (currentToken) {
        const userInfo = getUserInfoFromToken(currentToken);
        if (userInfo) {
          setUser(userInfo);
          setIsLoggedIn(true);
          console.log('User info extracted from token in handleLoginSuccess:', userInfo);
          return true;
        }
      }
      
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Error in handleLoginSuccess:', error);
      return false;
    }
  };

  const isAuthenticated = !!user || isLoggedIn || !!token;

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    isLoggedIn,
    setIsLoggedIn,
    handleLoginSuccess,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;