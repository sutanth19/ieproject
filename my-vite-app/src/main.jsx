import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Import  custom ThemeContext provider and hook
import { ThemeProvider as MyThemeProvider, useTheme } from './context_themes/ThemeContext';

// Import MUI’s ThemeProvider and  two themes
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './themes/themes';

import App from './App.jsx';

function CombinedThemeProvider() {
  // Access darkMode boolean from  custom context
  const { darkMode } = useTheme();
  
  // Decide which MUI theme to apply based on darkMode
  const muiTheme = darkMode ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={muiTheme}>

      <App />
    </MuiThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <MyThemeProvider>
      <BrowserRouter basename='/ieportal' >
        <CombinedThemeProvider />
      </BrowserRouter>
    </MyThemeProvider>
  </StrictMode>
);
