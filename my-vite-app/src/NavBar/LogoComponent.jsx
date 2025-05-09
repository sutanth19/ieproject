import React from 'react';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Logo component with navigation capability and base path support
 */
function LogoComponent({ basePath = '' }) {
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      navigate(`${basePath}/home`);
    }
  };

  return (
    <Box
      component={Link}
      to={`${basePath}/home`}
      className="logo-container"
      sx={{
        mr: 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
      }}
      onClick={handleLogoClick}
    >
      <img
        src={new URL('../assets/jabil2.svg', import.meta.url).href}
        alt="Jabil Logo"
        style={{ height: 24 }}
      />
    </Box>
  );
}

export default LogoComponent;