import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArticleIcon from '@mui/icons-material/Article';
import BuildIcon from '@mui/icons-material/Build';
import MessageIcon from '@mui/icons-material/Message';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

/**
 * Desktop navigation component with user dropdown menu
 */
function DesktopNavigation({ user, authenticated, handleMessageClick, handleLogout, basePath = '' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const isUserMenuOpen = Boolean(userMenuAnchor);

  // Helper functions
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

  // User menu handlers
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileClick = () => {
    navigate(`${basePath}/profile`);
    handleUserMenuClose();
  };

  const handleLogoutClick = async () => {
    // Close the menu first
    handleUserMenuClose();
    
    // Call the provided logout function
    await handleLogout();
    
    // Navigate to the correct URL with the base path
    navigate(`${basePath}/home`);
  };

  const scrollToSectionOrNavigate = (path, sectionId) => {
    if (path === '/home' && sectionId) {
      navigate(`${basePath}/home#${sectionId}`);
    } else {
      navigate(`${basePath}${path}`);
    }
  };

  const handleLoginClick = () => {
    // FIXED: Always use the basePath for login navigation
    const loginPath = `${basePath}/login`;
    
    // For login, use direct navigation to ensure proper page reset
    window.location.href = loginPath;
  };

  const handleRightClick = (e, path, sectionId) => {
    const fullPath = sectionId ? `${basePath}${path}#${sectionId}` : `${basePath}${path}`;
    e.currentTarget.setAttribute('href', fullPath);
  };

  const getPages = () => {
    const pages = [
      { name: 'Topic', icon: <ArticleIcon fontSize="small" />, path: '/home', sectionId: 'topic' },
      { name: 'Training', icon: <BuildIcon fontSize="small" />, path: '/home', sectionId: 'training' },
      { name: 'Message', icon: <MessageIcon fontSize="small" />, onClick: handleMessageClick },
      { name: 'Gantt', icon: <DateRangeIcon fontSize="small" />, path: '/gantt' },
    ];
    
    // Add user button with dropdown if authenticated
    if (authenticated && user) {
      pages.push({ 
        name: getDisplayName(user), 
        icon: <PersonIcon fontSize="small" />,
        endIcon: <KeyboardArrowDownIcon fontSize="small" />,
        onClick: handleUserMenuOpen 
      });
    } else {
      // Add login button if not authenticated
      pages.push({ 
        name: 'Login', 
        icon: <LoginIcon fontSize="small" />, 
        onClick: handleLoginClick 
      });
    }
    
    return pages;
  };

  return (
    <>
      {getPages().map(({ name, icon, endIcon, path, sectionId, onClick }) => {
        const isActive = path ? isActiveLink(path, sectionId) : false;
        
        // For items with path, 'll create a Link that supports right-click
        if (path && !onClick) {
          const fullPath = sectionId ? `${basePath}${path}#${sectionId}` : `${basePath}${path}`;
          
          return (
            <Button
              key={name}
              component={Link}
              to={fullPath}
              onClick={(e) => {
                // For left-click, prevent default and use our navigation
                if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  scrollToSectionOrNavigate(path, sectionId);
                }
              }}
              onContextMenu={(e) => handleRightClick(e, path, sectionId)}
              startIcon={icon}
              endIcon={endIcon}
              sx={{
                color: isActive ? '#4BAAD1' : '#fff',
                textTransform: 'none',
                fontWeight: isActive ? 600 : 400,
                marginLeft: { xs: 0, md: 1 },
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                borderRadius: '4px',
                padding: '6px 12px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {name}
            </Button>
          );
        }
        
        // For items with onClick (like Message or User dropdown)
        return (
          <Button
            key={name}
            onClick={onClick}
            startIcon={icon}
            endIcon={endIcon}
            aria-controls={name === getDisplayName(user) ? 'user-menu' : undefined}
            aria-haspopup={name === getDisplayName(user) ? 'true' : undefined}
            aria-expanded={name === getDisplayName(user) ? isUserMenuOpen : undefined}
            sx={{
              color: isActive ? '#4BAAD1' : '#fff',
              textTransform: 'none',
              fontWeight: isActive ? 600 : 400,
              marginLeft: { xs: 0, md: 1 },
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
              borderRadius: '4px',
              padding: '6px 12px',
              backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {name}
          </Button>
        );
      })}

      {/* User Menu Dropdown - UPDATED with improved UI/UX */}
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchor}
        open={isUserMenuOpen}
        onClose={handleUserMenuClose}
        MenuListProps={{
          'aria-labelledby': 'user-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 320,
            borderRadius: '12px',
            overflow: 'visible',
            backgroundColor: '#1e2a45',
            color: '#fff',
            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.3))',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: '#1e2a45',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Avatar sx={{ 
              bgcolor: '#4BAAD1', 
              width: 48, 
              height: 48,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              {user && getDisplayName(user).charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ ml: 2 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#fff',
                  mb: 0.5,
                  lineHeight: 1.2
                }}
              >
                {user && getDisplayName(user)}
              </Typography>
              
              {user && user.email && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: '0.85rem',
                    lineHeight: 1.2
                  }}
                >
                  {user.email}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 1 }} />
        
        <MenuItem onClick={handleLogoutClick} sx={{ 
          py: 1.5,
          px: 2.5,
          color: '#fff',
          borderRadius: '0 0 8px 8px',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        }}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  );
}

export default DesktopNavigation;