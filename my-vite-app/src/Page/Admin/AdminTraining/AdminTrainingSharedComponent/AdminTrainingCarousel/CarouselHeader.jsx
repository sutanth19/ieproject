import React from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box        from "@mui/material/Box";
import Button     from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon    from "@mui/icons-material/Add";
import CloseIcon  from "@mui/icons-material/Close";

const CarouselHeader = ({ title, formOpen, onToggle }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb:3 }}>
      <Typography variant="h5" sx={{ fontWeight:700, letterSpacing:"-0.02em" }}>{title}</Typography>
      <Button
        variant={formOpen ? "outlined" : "contained"}
        color={formOpen ? "inherit" : "primary"}
        startIcon={formOpen ? <CloseIcon/> : <AddIcon/>}
        onClick={onToggle}
        sx={{
          fontWeight:600, px:2,
          backgroundColor: formOpen ? "transparent" : theme.palette.primary.light,
          border: formOpen ? `1px solid ${alpha(theme.palette.common.white,0.3)}` : "none",
          "&:hover": {
            backgroundColor: formOpen ? "transparent" : theme.palette.primary.main,
            border: formOpen ? `1px solid ${alpha(theme.palette.common.white,0.5)}` : "none"
          }
        }}
      >
        {formOpen ? "Cancel" : "Add Item"}
      </Button>
    </Box>
  );
};
export default CarouselHeader;
