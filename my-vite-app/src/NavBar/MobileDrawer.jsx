import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import BuildIcon from '@mui/icons-material/Build';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MessageIcon from '@mui/icons-material/Message';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

/**
 * Mobile navigation drawer component with user profile dropdown
 */
function MobileDrawer({ 
  drawerOpen, 
  setDrawerOpen, 
  darkMode, 
  user, 
  authenticated,
  handleMessageClick,
  handleLogout,
  basePath = ''
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Helper functions (moved from external utils)
  const getDisplayName = (user) => {
    if (!user) return 'User';
    return user.unique_name || user.name || user.username || user.email?.split('@')[0] || 'User';
  };

  const isActiveLink = (path, sectionId) => {
    const fullPath = `${basePath}${path}`;
    
    // For path with section
    if (sectionId) {
      return (location.pathname.toLowerCase() === fullPath.toLowerCase() || 
              location.pathname.toLowerCase() === path.toLowerCase()) && 
             location.hash.toLowerCase() === `#${sectionId}`.toLowerCase();
    }
    // For path without section
    return (location.pathname.toLowerCase() === fullPath.toLowerCase() || 
            location.pathname.toLowerCase() === path.toLowerCase()) && 
           (!location.hash || location.hash === '');
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLoginClick = () => {
    // Force a page reload when navigating to login to ensure it properly renders
    // even when clicking login multiple times or after logging out
    setDrawerOpen(false);
    if (location.pathname.includes('/login')) {
      // If  already on the login page, force reload the page
      window.location.href = `${basePath}/login`;
    } else {
      // Otherwise use standard navigation
      navigate(`${basePath}/login`);
    }
  };

  const handleProfileClick = () => {
    navigate(`${basePath}/profile`);
    setDrawerOpen(false);
  };

  // Modified logout handler to use the correct URL path
  const handleLogoutClick = async () => {
    // Close the drawer
    setDrawerOpen(false);
    
    // Call the provided logout function
    await handleLogout();
    
    // Navigate to the correct URL with the base path
    navigate(`${basePath}/home`);
  };

  // Modified navigation items for the mobile drawer
  const getNavItems = () => {
    const items = [
      { name: 'Home', icon: <HomeIcon />, path: '/home' },
      { name: 'Topic', icon: <ArticleIcon />, path: '/home', sectionId: 'topic' },
      { name: 'Training', icon: <BuildIcon />, path: '/home', sectionId: 'training' },
      { name: 'Gantt', icon: <DateRangeIcon />, path: '/gantt' },
      { name: 'Message', icon: <MessageIcon />, onClick: handleMessageClick },
    ];
    
    // Add profile dropdown or login based on authentication status
    if (authenticated && user) {
      items.push({ 
        name: getDisplayName(user), 
        icon: <PersonIcon />, 
        expandable: true,
        onClick: handleUserMenuToggle,
        subItems: [
          { name: 'My Profile', icon: <PersonIcon />, onClick: handleProfileClick },
          { name: 'Settings', icon: <SettingsIcon />, onClick: () => {} },
          { name: 'Logout', icon: <ExitToAppIcon />, onClick: handleLogoutClick }
        ]
      });
    } else {
      items.push({ name: 'Login', icon: <LoginIcon />, onClick: handleLoginClick });
    }
    
    return items;
  };

  const handleNavigation = (path, sectionId, onClick) => {
    if (onClick) {
      onClick();
    } else if (path) {
      if (path === '/home' && sectionId) {
        navigate(`${basePath}/home#${sectionId}`);
      } else {
        navigate(`${basePath}${path}`);
      }
      setDrawerOpen(false);
    }
  };

  // Handle right-click for drawer items
  const handleDrawerItemRightClick = (e, path, sectionId) => {
    if (!path) return;
    // Prepare the full URL for opening in new tab
    const fullPath = sectionId ? `${basePath}${path}#${sectionId}` : `${basePath}${path}`;
    e.currentTarget.setAttribute('href', fullPath);
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '85%',
          maxWidth: '300px',
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px',
          backgroundColor: darkMode ? '#000f2b' : '#ffffff',
          boxShadow: '-4px 0px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: '#002b49',
          color: 'white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Menu
        </Typography>
        <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* User info section if logged in */}
      {authenticated && user && (
        <>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#4BAAD1', mr: 2 }}>
              {getDisplayName(user).charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: darkMode ? '#fff' : '#333' }}>
                {getDisplayName(user)}
              </Typography>
              {user.email && (
                <Typography variant="body2" sx={{ color: darkMode ? '#bbb' : '#666', fontSize: '0.8rem' }}>
                  {user.email}
                </Typography>
              )}
            </Box>
          </Box>
          <Divider sx={{ mb: 1 }} />
        </>
      )}

      <List sx={{ pt: 1 }}>
        {getNavItems().map((item) => {
          const isActive = item.path ? isActiveLink(item.path, item.sectionId) : false;
          
          // Expandable items (like user menu)
          if (item.expandable) {
            return (
              <React.Fragment key={item.name}>
                <ListItem
                  onClick={item.onClick}
                  sx={{
                    backgroundColor: userMenuOpen ? 'rgba(73, 172, 209, 0.1)' : 'transparent',
                    borderLeft: userMenuOpen ? '4px solid #4BAAD1' : '4px solid transparent',
                    mb: 0.5,
                    borderRadius: '0 8px 8px 0',
                    transition: 'all 0.2s ease',
                  }}
                  button
                >
                  <ListItemIcon
                    sx={{
                      color: userMenuOpen ? '#4BAAD1' : darkMode ? 'white' : '#555',
                      minWidth: '40px',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: userMenuOpen ? 600 : 400,
                        color: userMenuOpen ? '#4BAAD1' : darkMode ? 'white' : '#333',
                      },
                    }}
                  />
                  {userMenuOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={userMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem
                        key={subItem.name}
                        button
                        onClick={() => handleNavigation(null, null, subItem.onClick)}
                        sx={{
                          pl: 4,
                          py: 1,
                          borderRadius: '0 8px 8px 0',
                          mb: 0.5,
                          '&:hover': {
                            backgroundColor: 'rgba(73, 172, 209, 0.05)',
                          }
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: darkMode ? 'white' : '#555',
                            minWidth: '40px',
                          }}
                        >
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.name}
                          primaryTypographyProps={{
                            sx: {
                              color: darkMode ? 'white' : '#333',
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }
          
          // Normal items with path
          if (item.path) {
            const fullPath = item.sectionId ? `${basePath}${item.path}#${item.sectionId}` : `${basePath}${item.path}`;
            
            return (
              <ListItem
                key={item.name}
                component={Link}
                to={fullPath}
                onClick={(e) => {
                  if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    handleNavigation(item.path, item.sectionId);
                  }
                }}
                onContextMenu={(e) => handleDrawerItemRightClick(e, item.path, item.sectionId)}
                sx={{
                  backgroundColor: isActive ? 'rgba(73, 172, 209, 0.1)' : 'transparent',
                  borderLeft: isActive ? '4px solid #4BAAD1' : '4px solid transparent',
                  mb: 0.5,
                  borderRadius: '0 8px 8px 0',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none', 
                }}
                button
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#4BAAD1' : darkMode ? 'white' : '#555',
                    minWidth: '40px',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#4BAAD1' : darkMode ? 'white' : '#333',
                    },
                  }}
                />
              </ListItem>
            );
          }
          
          // Items with onClick (like Message)
          return (
            <ListItem
              key={item.name}
              onClick={() => handleNavigation(null, null, item.onClick)}
              sx={{
                backgroundColor: isActive ? 'rgba(73, 172, 209, 0.1)' : 'transparent',
                borderLeft: isActive ? '4px solid #4BAAD1' : '4px solid transparent',
                mb: 0.5,
                borderRadius: '0 8px 8px 0',
                transition: 'all 0.2s ease',
              }}
              button
            >
              <ListItemIcon
                sx={{
                  color: isActive ? '#4BAAD1' : darkMode ? 'white' : '#555',
                  minWidth: '40px',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#4BAAD1' : darkMode ? 'white' : '#333',
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* Improved footer with padding for the up arrow button */}
      <Box sx={{ mt: 'auto', p: 2, pb: 7, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: darkMode ? '#aaa' : '#777' }}>
          © Jabil Penang IE Department - 2025
        </Typography>
      </Box>
    </Drawer>
  );
}

export default MobileDrawer;