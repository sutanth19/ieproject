// TopNavBar.jsx
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './../themes/ThemeContext';
import { SunMoonSwitch } from './../themes/SunMoonSwitch';
import './TopNavBar.css';
import ContactModal from '../Page/Home/ContactModal';
import { useAuth } from '../Page/Auth/AuthContext';
import LogoComponent from './LogoComponent';
import DesktopNavigation from './DesktopNavigation';
import MobileMenuButton from './MobileMenuButton';
import MobileDrawer from './MobileDrawer';
import { getUserInfoFromToken } from '../Page/Auth/tokenUtils';

function TopNavBar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get base path from current location - IMPROVED
  const getBasePath = () => {
    // Always check if 're in the 'ieportal' context
    const pathParts = window.location.pathname.split('/');
    return pathParts[1] === 'ieportal' ? '/ieportal' : '';
  };
  
  const basePath = getBasePath();
  
  // Use the auth context directly
  const auth = useAuth();
  
  // Use auth context if available, otherwise use local state
  const user = auth?.user || userData;
  const authenticated = auth?.isAuthenticated || isAuthenticated;
  const authLogout = auth?.logout;

  // Debug log to check user data
  useEffect(() => {
    if (auth?.user) {
      console.log('Auth user data:', auth.user);
    }
    if (authenticated) {
      console.log('Current user data being used:', user);
    }
  }, [auth?.user, user, authenticated]);

  useEffect(() => {
    if (!auth?.isAuthenticated) {
      // Check if user is logged in by looking for token in localStorage or cookies
      const checkLoginStatus = () => {
        // First check localStorage for token
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Extract user info from token
          const userInfo = getUserInfoFromToken(token);
          if (userInfo) {
            setUserData(userInfo);
            setIsAuthenticated(true);
            console.log('User data extracted from localStorage token:', userInfo);
            return;
          }
        }
        
        // Check for session cookie as fallback
        const cookies = document.cookie.split(';');
        const userSessionCookie = cookies.find(cookie => cookie.trim().startsWith('_userSession='));
        
        if (userSessionCookie) {
          // Extract the token value from the cookie
          const cookieToken = userSessionCookie.split('=')[1];
          
          // Extract user info from cookie token
          const userInfo = getUserInfoFromToken(cookieToken);
          if (userInfo) {
            setUserData(userInfo);
            setIsAuthenticated(true);
            console.log('User data extracted from cookie token:', userInfo);
            return;
          }
        }
        
        setIsAuthenticated(false);
      };

      checkLoginStatus();
    }
  }, [auth]);

  // Handle message button click
  const handleMessageClick = (e) => {
    if (e) e.preventDefault();
    setContactModalOpen(true);
  };

  // Handle login/logout with proper URL handling
  const handleLogout = async () => {
    try {
      if (authLogout) {
        // Use AuthContext logout if available
        const result = await authLogout();
        if (result?.success) {
          setIsAuthenticated(false);
          setUserData(null);
          // Let the component handle the redirect
          return true;
        }
      } else {
        const response = await fetch('/api/auth/logout', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          setIsAuthenticated(false);
          setUserData(null);
          // Let the component handle the redirect
          return true;
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout UI state even if API fails
      setIsAuthenticated(false);
      setUserData(null);
      return true;
    }
    
    setDrawerOpen(false);
    return true;
  };

  // Override navigation function to always use base path
  const navigateWithBasePath = (path) => {
    // Always use the basePath for consistent navigation
    const fullPath = path.startsWith(basePath) ? path : `${basePath}${path}`;
    navigate(fullPath);
  };

  return (
    <>
      {/* AppBar Header */}
      <AppBar
        position="fixed"
        className="appBar"
        elevation={0}
        variant="dense"
        sx={{ backgroundColor: '#002b49 !important' }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 50, justifyContent: 'space-between' }}>
          <LogoComponent basePath={basePath} />

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <DesktopNavigation 
              user={user} 
              authenticated={authenticated} 
              handleMessageClick={handleMessageClick}
              handleLogout={handleLogout}
              basePath={basePath}
            />
            <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <Box sx={{ ml: 2 }}>
                <SunMoonSwitch checked={darkMode} onClick={toggleDarkMode} />
              </Box>
            </Tooltip>
          </Box>

          {/* Mobile Navigation Controls */}
          <MobileMenuButton 
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            setDrawerOpen={setDrawerOpen}
          />
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer 
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        darkMode={darkMode}
        user={user}
        authenticated={authenticated}
        handleMessageClick={handleMessageClick}
        handleLogout={handleLogout}
        basePath={basePath}
      />

      {/* Offset for the fixed AppBar */}
      <Toolbar variant="dense" sx={{ minHeight: 50 }} />

      {/* Contact Modal */}
      <ContactModal 
        open={contactModalOpen} 
        onClose={() => setContactModalOpen(false)} 
        darkMode={darkMode}
      />
    </>
  );
}

export default TopNavBar;