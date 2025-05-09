import React from 'react';
import IconButton from '@mui/material/IconButton';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';

const SunMoonSwitch = ({ checked, onClick }) => {
  // Pick colors directly in code:
  const activeColor   = checked ? '#1E90FF' : '#FFF';   

  const iconComponent = checked 
    ? <Brightness2Icon fontSize="small" /> 
    : <WbSunnyIcon   fontSize="small" />;

  return (
    <IconButton
      onClick={onClick}
      aria-label="toggle theme"
      sx={{
        border:        '1px solid',
        borderColor:   activeColor,          // border color
        borderRadius:  '4px',
        backgroundColor: 'transparent',
        padding:       '4px',
        color:         activeColor,          // icon color
      
       
      }}
    >
      {iconComponent}
    </IconButton>
  );
};

export { SunMoonSwitch };
