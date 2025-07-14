// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI } from './../../services/authAPI';
import { getUserInfoFromToken, isTokenExpired, getTokenFromCookies } from './tokenUtils';

// Define types for user information
interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  exp: Date | null;
  iat: Date | null;
  [key: string]: any; // Allow for additional properties
}

// Define types for API responses
interface AuthResponse {
  success: boolean;
  message: string;
}

interface LoginResponse extends AuthResponse {
  data?: string; // Token
}

// Define the context type
interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  register: (userNtid: string, userRole: string) => Promise<AuthResponse>;
  login: (userNtId: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  handleLoginSuccess: () => Promise<boolean>;
  token: string | null;
}

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async (): Promise<void> => {
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
  const register = async (userNtid: string, userRole: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authAPI.register(userNtid, userRole);
      console.log('Registration response:', response.data);
      
      return { 
        success: true, 
        message: response.data.message || 'Registration successful!' 
      };
    } catch (error: any) {
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
  const login = async (userNtId: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authAPI.login(userNtId, password);
      console.log('Login response:', response.data);
      
      // Store token in API 
      if (response.data && response.data.data) {
        const loginToken: string = response.data.data;
        localStorage.setItem('authToken', loginToken);
        setToken(loginToken);
        console.log('Token stored in localStorage');
        
        const userInfo = getUserInfoFromToken(loginToken);
        if (userInfo) {
          setUser(userInfo);
          setIsLoggedIn(true);
          console.log('User info extracted from token after login:', userInfo);
          return { success: true, message: 'Login successful' };
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
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'Invalid credentials. Please check username and password.';
      } else if (error.response && error.response.status === 404) {
        errorMessage = 'Login endpoint not found. Please check the API configuration.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error. Please check connection.';
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<AuthResponse> => {
    setLoading(true);
    try {
      await authAPI.logout();
      
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('authToken');
      setToken(null);
      
      return { success: true, message: 'Logout successful' };
    } catch (error: any) {
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

  const handleLoginSuccess = async (): Promise<boolean> => {
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

  const value: AuthContextType = {
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