// src/Page/Admin/Messages/components/TabNavigation.jsx
import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
const TabNavigation = ({ activeTab, setActiveTab, tabs, colors }) => {
  return (
    <Box
      sx={{
        display: "flex",
        borderBottom: `2px solid ${
          colors.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
        }`,
        mb: "24px",
        gap: "12px",
        overflowX: "auto",
        pb: "2px",
      }}
    >
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          sx={{
            p: "10px 20px",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            borderBottom:
              activeTab === tab.id
                ? `3px solid ${colors.accent}`
                : "3px solid transparent",
            color: activeTab === tab.id ? colors.accent : colors.text,
            fontWeight: activeTab === tab.id ? 600 : 500,
            transition: "all 0.2s ease",
            mb: "-2px",
            borderRadius: "8px 8px 0 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            "&:hover": {
              background: colors.darkMode
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.01)",
              color:
                activeTab !== tab.id ? colors.accentLight : colors.accent,
            },
          }}
        >
          {tab.label}
          <Chip
            label={tab.count}
            size="small"
            sx={{
              height: "22px",
              fontSize: "12px",
              fontWeight: 600,
              background:
                activeTab === tab.id
                  ? colors.accent
                  : colors.darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              color:
                activeTab === tab.id
                  ? "#fff"
                  : colors.darkMode
                  ? "rgba(255,255,255,0.8)"
                  : colors.text,
            }}
          />
        </Button>
      ))}
    </Box>
  );
};

export default TabNavigation;
