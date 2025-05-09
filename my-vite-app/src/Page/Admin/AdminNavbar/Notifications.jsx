import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Notifications = () => {
  // Notification state
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: 'New production report available', 
      time: '10 min ago', 
      read: false 
    },
    { 
      id: 2, 
      message: 'System maintenance scheduled for 10PM', 
      time: '1 hour ago', 
      read: false 
    },
    { 
      id: 3, 
      message: 'Weekly metrics updated', 
      time: '3 hours ago', 
      read: true 
    }
  ]);
  
  // Menu state for notifications dropdown
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const notificationMenuOpen = Boolean(notificationAnchorEl);
  
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleNotificationRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <>
      {/* Notification Bell */}
      <Tooltip title="Notifications">
        <IconButton 
          size="small" 
          color="inherit" 
          onClick={handleNotificationClick}
          sx={{
            marginRight: 1,
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={notificationMenuOpen}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 360,
            overflow: 'auto',
            marginTop: 1.5,
            '& .MuiList-root': {
              padding: 0
            },
            animation: 'slideIn 0.3s ease',
            '@keyframes slideIn': {
              from: {
                opacity: 0,
                transform: 'translateY(-10px)'
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{
          padding: 2,
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Notifications</Typography>
        </Box>
        
        {notifications.length === 0 ? (
          <MenuItem sx={{ padding: '16px', color: 'text.secondary' }}>
            <Typography variant="body2">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  button
                  alignItems="flex-start"
                  onClick={() => {
                    handleNotificationRead(notification.id);
                    handleNotificationClose();
                  }}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'rgba(0, 43, 73, 0.05)',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 43, 73, 0.1)'
                    },
                    position: 'relative',
                    '&::before': !notification.read ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: '#002b49',
                      borderRadius: '2px'
                    } : {}
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: '#002b49' }}>
                      <NotificationsIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                    primaryTypographyProps={{
                      fontWeight: notification.read ? 400 : 600,
                      variant: 'body2'
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      color: 'text.secondary'
                    }}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
        
        <Box sx={{
          padding: 1,
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}>
          <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary' }}>
              View all notifications
            </Typography>
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default Notifications;