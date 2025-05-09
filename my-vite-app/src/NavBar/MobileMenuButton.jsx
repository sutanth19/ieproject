import React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import { SunMoonSwitch } from '../themes/SunMoonSwitch';

/**
 * Mobile menu button component with theme toggle
 */
function MobileMenuButton({ darkMode, toggleDarkMode, setDrawerOpen }) {
  return (
    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
      <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
        <Box sx={{ mr: 1 }}>
          <SunMoonSwitch checked={darkMode} onClick={toggleDarkMode} size="small" />
        </Box>
      </Tooltip>
      <IconButton
        size="small"
        onClick={() => setDrawerOpen(true)}
        color="inherit"
        edge="end"
        sx={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '6px',
        }}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );
}

export default MobileMenuButton;