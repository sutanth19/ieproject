import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Import components
import DashboardNavItem from './DashboardNavItem';
import TopicsCollapsibleNavbar from './TopicsCollapsibleNavbar';
import TrainingsCollapsibleNavbar from './TrainingsCollapsibleNavbar';
import MessagesCollapsibleNavbar from './MessagesCollapsibleNavbar';

const drawerWidth = 260;
const miniDrawerWidth = 72;

const CollapsibleNavbar = ({ 
  darkMode, 
  isDrawerCollapsed, 
  toggleDrawerCollapse, 
  mobileOpen, 
  handleDrawerToggle,
  isMobile 
}) => {
  const theme = useTheme();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState('/admin/dashboard');

  const isActiveLink = (path) => location.pathname === path || selectedItem === path;
  
  // Common style props to pass to child components
  const navItemProps = {
    darkMode,
    isDrawerCollapsed,
    isActiveLink,
    setSelectedItem
  };

  // Drawer content
  const drawer = (
    <Box 
      sx={{ 
        position: 'relative', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: darkMode ? '#000f2b' : '#eaeef4',
        transition: theme.transitions.create(['background-color', 'color'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        })
      }}
    >
      {/* Logo Section with collapse toggle */}
      <Box 
        sx={{
          display: 'flex',
          justifyContent: isDrawerCollapsed ? 'center' : 'space-between',
          alignItems: 'center',
          p: isDrawerCollapsed ? 1 : 2,
          pb: isDrawerCollapsed ? 1 : 1.5,
          pt: isDrawerCollapsed ? 1 : 1.5,
          borderBottom: '1px solid',
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
        }}
      >
        {!isDrawerCollapsed && (
          <Box 
            sx={{ 
              fontWeight: 700, 
              letterSpacing: '0.5px',
              color: darkMode ? '#fff' : '#1a2035',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            IE-ADMIN
          </Box>
        )}
        <Tooltip title={isDrawerCollapsed ? "" : ""}>
          <IconButton
            onClick={toggleDrawerCollapse}
            size="small"
            sx={{
              color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                transform: 'scale(1.1)',
              },
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              transition: 'all 0.2s ease-in-out',
              '& svg': {
                transition: 'transform 0.3s ease',
              },
              '&:hover svg': {
                transform: 'scale(1.2)',
              }
            }}
          >
            {isDrawerCollapsed ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Menu items */}
      <List 
        sx={{ 
          py: 2,
          px: 1,
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        {/* Dashboard Nav Item */}
        <DashboardNavItem {...navItemProps} />
        
        {/* Topics Section */}
        <TopicsCollapsibleNavbar {...navItemProps} />
        
        {/* Trainings Section */}
        <TrainingsCollapsibleNavbar {...navItemProps} />
        
        {/* Messages Nav Item */}
        <MessagesCollapsibleNavbar {...navItemProps} />
      </List>
    </Box>
  );

  // Mobile Drawer
  const mobileDrawer = (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          width: '85%', 
          maxWidth: '320px',
          backgroundColor: darkMode ? '#000f2b' : '#eaeef4',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          boxShadow: '-4px 0px 16px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s ease'
        },
      }}
      anchor="right"
    >
      {/* Mobile Drawer Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
        }}
      >
        <Box sx={{ 
          fontWeight: 700, 
          color: darkMode ? '#fff' : '#1a2035',
          fontSize: '1rem' 
        }}>
          IE ADMIN
        </Box>
        <IconButton 
          onClick={handleDrawerToggle} 
          sx={{ 
            color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            p: 0.5,
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            }
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
      {drawer}
    </Drawer>
  );

  // Permanent Drawer for Desktop
  const desktopDrawer = (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: isDrawerCollapsed ? miniDrawerWidth : drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
          backgroundColor: darkMode ? '#000f2b' : '#eaeef4',
          boxShadow: darkMode ? 'none' : '0 0 20px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          marginTop: '50px', // Account for navbar height
          transition: theme.transitions.create(['width', 'background-color'], {
            easing: theme.transitions.easing.sharp,
            duration: isDrawerCollapsed
              ? theme.transitions.duration.leavingScreen
              : theme.transitions.duration.enteringScreen,
          }),
        },
      }}
      open
    >
      {drawer}
    </Drawer>
  );

  return (
    <>
      {desktopDrawer}
      {mobileDrawer}
    </>
  );
};

export default CollapsibleNavbar;