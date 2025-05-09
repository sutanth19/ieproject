// src/Page/Admin/CollapsibleNavbar/MessagesCollapsibleNavbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import MessageIcon from '@mui/icons-material/Message';

// Highlight color constants
const highlightColor = '#4BAAD1';
const highlightBgLight = 'rgba(75,170,209,0.15)';
const highlightBgDark = 'rgba(75,170,209,0.2)';

const MessagesCollapsibleNavbar = ({ darkMode, isDrawerCollapsed, isActiveLink, setSelectedItem }) => {
  const navigate = useNavigate();
  const path = '/admin/messages';
  const isActive = isActiveLink(path);
  const badgeCount = 3; // Static badge count

  const handleClick = () => {
    setSelectedItem(path);
    // Navigate to the /admin/messages route
    navigate(path);
  };

  return (
    <ListItem disablePadding sx={{ display: 'block', mb: 0.8 }}>
      <Tooltip title={isDrawerCollapsed ? "Messages" : ""} placement="right" arrow>
        <ListItemButton
          onClick={handleClick}
          sx={{
            minHeight: 48,
            px: isDrawerCollapsed ? 2 : 2.5,
            py: 1.2,
            justifyContent: isDrawerCollapsed ? 'center' : 'flex-start',
            borderRadius: '12px',
            position: 'relative',
            background: isActive
              ? darkMode
                ? highlightBgDark
                : highlightBgLight
              : 'transparent',
            '&:hover': {
              background: isActive
                ? darkMode
                  ? 'linear-gradient(90deg, rgba(75,170,209,0.25) 0%, rgba(75,170,209,0.15) 100%)'
                  : 'linear-gradient(90deg, rgba(75,170,209,0.2) 0%, rgba(75,170,209,0.1) 100%)'
                : darkMode
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.03)',
              transform: 'translateX(2px)'
            },
            '&::before': isActive
              ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '35%',
                  height: '30%',
                  width: '4px',
                  borderRadius: '0 4px 4px 0',
                  backgroundColor: highlightColor,
                  transition: 'opacity 0.3s ease, transform 0.3s ease'
                }
              : {},
            transition: 'all 0.2s ease !important'
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: isDrawerCollapsed ? 0 : 40,
              mr: isDrawerCollapsed ? 0 : 2,
              justifyContent: 'center',
              color: isActive ? highlightColor : darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
            }}
          >
            <Badge
              badgeContent={badgeCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6rem',
                  height: '16px',
                  minWidth: '16px',
                  padding: '0 4px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }
              }}
            >
              <MessageIcon sx={{ transition: 'color 0.2s ease' }} />
            </Badge>
          </ListItemIcon>
          {!isDrawerCollapsed && (
            <ListItemText
              primary="Messages"
              primaryTypographyProps={{
                sx: {
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? highlightColor : darkMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
                  whiteSpace: 'nowrap',
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease'
                }
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

export default MessagesCollapsibleNavbar;
