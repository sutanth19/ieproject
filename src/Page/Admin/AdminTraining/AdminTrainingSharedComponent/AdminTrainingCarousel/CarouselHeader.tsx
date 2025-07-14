import React from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

interface CarouselHeaderProps {
  title: string;
  formOpen: boolean;
  onToggle: () => void;
}

const CarouselHeader: React.FC<CarouselHeaderProps> = ({ title, formOpen, onToggle }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2
      }}
    >
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      
      <Button
        variant="contained"
        startIcon={formOpen ? <CloseIcon /> : <AddIcon />}
        onClick={onToggle}
        sx={{
          fontWeight: 600,
          px: 2,
          backgroundColor: formOpen ? "transparent" : theme.palette.primary.light,
          border: formOpen ? `1px solid ${alpha(theme.palette.common.white, 0.3)}` : "none",
          "&:hover": {
            backgroundColor: formOpen ? "transparent" : theme.palette.primary.main,
            border: formOpen ? `1px solid ${alpha(theme.palette.common.white, 0.5)}` : "none"
          }
        }}
      >
        {formOpen ? "Cancel" : "Add Item"}
      </Button>
    </Box>
  );
};

export default CarouselHeader;