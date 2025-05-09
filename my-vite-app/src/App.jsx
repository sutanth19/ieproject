// Updated App.jsx with improved routing and admin access handling
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Typography from '@mui/material/Typography';
import { useTheme } from './context_themes/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import TopNavBar from './NavBar/TopNavBar';
import MainRoutes from './routes/MainRoutes';
import { AuthProvider, useAuth } from './Page/Auth/AuthContext';
import './App.css';

function App() {
  const { darkMode } = useTheme();
  const [showHomePopup, setShowHomePopup] = useState(false);

  return (
    <AuthProvider>
      <AppContent 
        showHomePopup={showHomePopup} 
        setShowHomePopup={setShowHomePopup} 
        darkMode={darkMode}
      />
    </AuthProvider>
  );
}

function AppContent({ showHomePopup, setShowHomePopup, darkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const getBasePath = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[1] === 'ieportal' ? '/ieportal' : '';
  };
  
  const basePath = getBasePath();
  const [loginKey, setLoginKey] = useState(0);
  const isAdminPath = location.pathname.includes('/admin');

  // Scroll to top when navigating to home
  useEffect(() => {
    if ((location.pathname === '/home' || location.pathname === '/ieportal/home') && !location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Toggle dark mode on body element
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // Redirect authenticated users away from login page
  useEffect(() => {
    if ((location.pathname === '/login' || location.pathname === '/ieportal/login') && isAuthenticated) {
      navigate(`${basePath}/home`);
    }
  }, [location.pathname, isAuthenticated, navigate, basePath]);

  // IMPORTANT: This is added to allow admin routes to work without login during development
  // Remove the "import.meta.env.DEV &&" part for production to enforce login for admin routes
  useEffect(() => {
    const isAdminRoute = location.pathname.includes('/admin');
    // Only redirect if not in development mode or if we want to enforce auth in development too
    if (isAdminRoute && !isAuthenticated && !import.meta.env.DEV) {
      // Redirect unauthenticated users trying to access admin routes
      navigate(`${basePath}/login`);
    }
  }, [location.pathname, isAuthenticated, navigate, basePath]);

  // Handle login page path and remounting
  useEffect(() => {
    if (location.pathname.endsWith('/login')) {
      setLoginKey(prev => prev + 1);
      
      const currentPath = location.pathname;
      const correctPath = `${basePath}/login`;
      
      // Redirect if not at the correct path
      if (currentPath !== correctPath && location.key !== 'default') {
        window.location.href = `${window.location.origin}${correctPath}`;
      }
    }
  }, [location.pathname, basePath, location.key]);

  return (
    <Box
      className="app-root"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: darkMode ? '#1e2a45' : '#f5f5f5',
        color: darkMode ? '#ffffff' : '#000000',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Show the top nav bar except on admin paths */}
      {!isAdminPath || showHomePopup ? <TopNavBar /> : null}

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1 }}>
        {showHomePopup ? (
          <div key={`home-popup-${Date.now()}`}>
            <MainRoutes basePath={basePath} loginKey={loginKey} />
          </div>
        ) : (
          <MainRoutes basePath={basePath} loginKey={loginKey} />
        )}
      </Box>

      {/* Show footer except on admin paths */}
      {!isAdminPath || showHomePopup ? (
        <Box
          component="footer"
          sx={{
            backgroundColor: '#002b49',
            color: 'white',
            textAlign: 'center',
            padding: '10px 20px',
          }}
        >
          <Typography sx={{ fontSize: '0.9rem' }}>
            © Jabil Penang IE Department - 2025
          </Typography>
        </Box>
      ) : null}

      {/* Scroll-to-top Button */}
      <IconButton
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        sx={{
          color: 'white',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#46BFE8',
          borderRadius: '50%',
          padding: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          zIndex: 1300,
          '&:hover': { backgroundColor: '#46BFE8' },
          transition: 'all 0.2s ease',
          opacity: 0.9,
        }}
      >
        <ArrowUpwardIcon />
      </IconButton>
    </Box>
  );
}

export default App;