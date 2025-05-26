import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MyThemeProvider, useTheme } from './themes/ThemeContext.jsx';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './themes/themes';

import App from './App.jsx';

function CombinedThemeProvider() {
  const { darkMode } = useTheme();
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
      <BrowserRouter basename='/ieportal'>
        <CombinedThemeProvider />
      </BrowserRouter>
    </MyThemeProvider>
  </StrictMode>
);