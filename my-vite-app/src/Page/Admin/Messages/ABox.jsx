// src/Page/Admin/Messages/components/ABox.jsx
import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import CloseIcon from "@mui/icons-material/Close";

const ABox = ({ alert, setAlert, colors }) => {
  return (
    <Fade in={alert !== null}>
      <Box
        sx={{
          p: "14px 18px",
          mb: "20px",
          borderRadius: "10px",
          background: alert?.error ? colors.error : colors.success,
          color: "#ffffff",
          display: alert ? "flex" : "none",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>{alert?.msg}</Typography>
        <IconButton
          onClick={() => setAlert(null)}
          sx={{
            color: "#ffffff",
            opacity: 0.8,
            "&:hover": { opacity: 1 },
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Fade>
  );
};

export default ABox;
