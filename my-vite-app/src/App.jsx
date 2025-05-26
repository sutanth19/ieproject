import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Typography from '@mui/material/Typography';
import { useTheme } from './themes/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import TopNavBar from './TopNavBar';
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
  const [loginKey, setLoginKey] = useState(0);
  const isAdminPath = location.pathname.includes('/admin');

  useEffect(() => {
    if ((location.pathname === '/' || location.pathname === '/home') && !location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const isAdminRoute = location.pathname.includes('/admin');
    if (isAdminRoute && !isAuthenticated && !import.meta.env.DEV) {
      navigate('/home');
    }
  }, [location.pathname, isAuthenticated, navigate]);

  useEffect(() => {
    if (location.pathname === '/login') {
      setLoginKey(prev => prev + 1);
    }
  }, [location.pathname]);

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
      {!isAdminPath || showHomePopup ? <TopNavBar /> : null}

      <Box component="main" sx={{ flex: 1 }}>
        {showHomePopup ? (
          <div key={`home-popup-${Date.now()}`}>
            <MainRoutes loginKey={loginKey} />
          </div>
        ) : (
          <MainRoutes loginKey={loginKey} />
        )}
      </Box>

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