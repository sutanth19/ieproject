import React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useAuth } from '../Page/Auth/AuthContext';
import { getUserInfoFromToken } from '../Page/Auth/tokenUtils';

const UserDropdown = () => {
  // Use the auth context to get user data
  const { user: authUser } = useAuth();
  
  // Fallback to getting user from token if not available in context
  const getUserFromToken = () => {
    // Try localStorage first
    const token = localStorage.getItem('authToken');
    if (token) {
      return getUserInfoFromToken(token);
    }
    
    // Try cookies next
    const cookies = document.cookie.split(';');
    const userSessionCookie = cookies.find(cookie => cookie.trim().startsWith('_userSession='));
    if (userSessionCookie) {
      const cookieToken = userSessionCookie.split('=')[1];
      return getUserInfoFromToken(cookieToken);
    }
    
    return { name: 'User', email: '' };
  };
  
  // Use authenticated user or fetch from token
  const user = authUser || getUserFromToken();
  
  // Get the first letter of the user's name for Avatar
  const getInitial = (name) => {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : 'U';
  };
  
  const handleLogout = (popupState) => {
    popupState.close();
    
    // Access logout function from auth context
    const { logout } = useAuth();
    if (logout) {
      logout();
    } else {
      console.log('Logout function not available');
    }
  };
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, backgroundColor: '#002b49' }}>
      <PopupState variant="popover" popupId="user-menu">
        {(popupState) => (
          <>
            <Button
              {...bindTrigger(popupState)}
              startIcon={<PersonIcon sx={{ color: '#fff' }} />}
              endIcon={<KeyboardArrowDownIcon sx={{ color: '#fff' }} />}
              aria-controls="user-menu"
              sx={{
                color: '#fff',
                textTransform: 'none',
                fontSize: '0.95rem',
                borderRadius: '4px',
                padding: '6px 12px',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {user.name}
            </Button>

            <Menu
              {...bindMenu(popupState)}
              id="user-menu"
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
                    {getInitial(user.name)}
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
                      {user.name}
                    </Typography>
                    
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
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 1 }} />
              
              <MenuItem onClick={() => handleLogout(popupState)} sx={{ 
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
        )}
      </PopupState>
    </Box>
  );
};

export default UserDropdown;