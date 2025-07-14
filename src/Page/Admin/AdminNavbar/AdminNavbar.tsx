import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { SunMoonSwitch } from '../../../themes/SunMoonSwitch'; 
import Notifications from './Notifications';
import jabilLogo from '../../../assets/jabil2.svg';

interface AdminNavbarProps {
  handleDrawerToggle: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isDrawerCollapsed: boolean;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ 
  handleDrawerToggle, 
  darkMode, 
  toggleDarkMode, 
  isDrawerCollapsed 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveLink = (path: string): boolean => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  const handleLogoClick = (): void => {
    navigate('/admin');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: '#002b49 !important',
        width: '100%',
        transition: 'all 0.3s ease',
        zIndex: 1201 
      }}
    >
      <Toolbar 
        variant="dense" 
        sx={{
          minHeight: 50,
          justifyContent: 'space-between'
        }}
      >
        {/* Logo Section with IE Admin Panel text */}
        <Box
          sx={{
            marginRight: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.3s ease'
          }}
          onClick={handleLogoClick}
        >
          <img 
            src={jabilLogo} 
            alt="Jabil Logo" 
            style={{
              height: '24px',
              width: 'auto'
            }} 
          />
          <Typography
            variant="subtitle1"
            sx={{
              marginLeft: '8px',
              color: '#fff',
              fontWeight: 500,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            IE Admin Panel
          </Typography>
        </Box>

        {/* Right side with controls */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center'
        }}>
          {/* Notifications Component */}
          <Notifications />

          {/* Dark Mode Toggle */}
          <Box sx={{
            marginRight: '8px'
          }}>
            <SunMoonSwitch checked={darkMode} onClick={toggleDarkMode} />
          </Box>

          {/* Mobile menu button */}
          <Box sx={{
            display: { xs: 'flex', md: 'none' }
          }}>
            <IconButton
              size="small"
              onClick={handleDrawerToggle}
              color="inherit"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '6px',
                transition: 'background-color 0.3s ease'
              }}
              edge="end"
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;