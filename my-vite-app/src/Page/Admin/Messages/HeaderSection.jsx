// src/Page/Admin/Messages/components/HeaderSection.jsx
import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

const HeaderSection = ({
  searchTerm,
  setSearchTerm,
  searchFocused,
  setSearchFocused,
  fetchMessages,
  colors,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: "28px",
        flexWrap: { xs: "wrap", sm: "nowrap" },
        gap: "16px",
      }}
    >
      <Typography
        component="h2"
        sx={{
          m: 0,
          fontSize: { xs: "22px", sm: "26px" },
          fontWeight: 700,
          color: colors.darkMode ? colors.accentLight : colors.accentDark,
        }}
      >
        Contact Messages
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            flex: { xs: 1, sm: "none" },
            maxWidth: { xs: "100%", sm: "250px" },
          }}
        >
          <TextField
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                background: colors.searchBg,
                color: colors.text,
                transition: "all 0.2s ease-in-out",
                border: `1px solid ${
                  searchFocused
                    ? colors.accent
                    : colors.darkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)"
                }`,
                boxShadow: searchFocused
                  ? `0 0 0 3px ${colors.darkMode ? "rgba(52, 152, 219, 0.2)" : "rgba(37, 99, 235, 0.2)"}`
                  : "none",
                "&:hover": {
                  border: `1px solid ${colors.accent}`,
                },
                "& fieldset": { border: "none" },
              },
              "& .MuiInputBase-input": {
                py: "12px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: searchFocused ? colors.accent : colors.text,
                      opacity: searchFocused ? 1 : 0.5,
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchTerm("")}
                    sx={{
                      color: colors.text,
                      opacity: 0.7,
                      "&:hover": { opacity: 1 },
                    }}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button
          onClick={fetchMessages}
          sx={{
            background: colors.buttonSecondary,
            color: "#ffffff",
            border: "none",
            py: "12px",
            px: { xs: "12px", sm: "16px" },
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 600,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            boxShadow: colors.darkMode ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
            "&:hover": {
              background: colors.buttonSecondaryHover,
              transform: "translateY(-1px)",
            },
          }}
          startIcon={<RefreshIcon />}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "block" } }}>
            Refresh
          </Box>
        </Button>
      </Box>
    </Box>
  );
};

export default HeaderSection;
