// src/Page/Admin/AdminDashboard/AdminDashboard.jsx
import React, { useState } from "react";
import { useTheme as useAppTheme } from "../../../context_themes/ThemeContext";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import CollapsibleNavbar from "../CollapsibleNavbar/CollapsibleNavbar";
import { Outlet } from "react-router-dom";

const drawerWidth = 260;
const miniDrawerWidth = 72;

const AdminDashboard = () => {
  /* global dark‑mode state */
  const { darkMode, toggleDarkMode } = useAppTheme();

  /* MUI theme only for breakpoints / transitions */
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: darkMode ? "#000f2b" : "#eaeef4",
        color: darkMode ? "white" : "inherit",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <CssBaseline />

      {/* ---------- top navbar ---------- */}
      <AdminNavbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        isDrawerCollapsed={isDrawerCollapsed}
      />

      {/* ---------- side navbar ---------- */}
      <CollapsibleNavbar
        darkMode={darkMode}
        isDrawerCollapsed={isDrawerCollapsed}
        toggleDrawerCollapse={() => setIsDrawerCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        isMobile={isMobile}
      />

      {/* ---------- main content ---------- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { md: `${isDrawerCollapsed ? miniDrawerWidth : drawerWidth}px` },
          width: {
            md: `calc(100% - ${isDrawerCollapsed ? miniDrawerWidth : drawerWidth}px)`,
          },
          bgcolor: darkMode ? "#121e34" : "#eaeef4",
          transition: muiTheme.transitions.create(
            ["margin", "width", "background-color"],
            {
              easing: muiTheme.transitions.easing.sharp,
              duration: isDrawerCollapsed
                ? muiTheme.transitions.duration.leavingScreen
                : muiTheme.transitions.duration.enteringScreen,
            }
          ),
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 50 }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
