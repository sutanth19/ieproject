// CarouselForm.jsx
import React, { useState, useEffect } from "react";
import { alpha, useTheme } from "@mui/material/styles";

// MUI components
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

const CarouselForm = ({ open, editingItem, onCancel, onSubmit }) => {
  const theme = useTheme();
  const isEditing = Boolean(editingItem);

  // local state
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [drag, setDrag] = useState(false);

  /* Populate form when "Edit" pressed */
  useEffect(() => {
    if (isEditing) {
      setTitle(editingItem.title);
      setSubTitle(editingItem.subTitle);
      setPreview(
        editingItem.image
          ? `http://localhost:5001/uploads/${editingItem.image}`
          : null
      );
    } else {
      reset();
    }
  }, [editingItem]);

  const reset = () => {
    setTitle("");
    setSubTitle("");
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, subTitle }, file).catch(() => {});
  };

  /* drag‑and‑drop helpers */
  const dragProps = {
    onDragEnter: (e) => {
      e.preventDefault();
      setDrag(true);
    },
    onDragOver: (e) => e.preventDefault(),
    onDragLeave: (e) => {
      e.preventDefault();
      setDrag(false);
    },
    onDrop: (e) => {
      e.preventDefault();
      setDrag(false);
      if (e.dataTransfer.files[0]) {
        const f = e.dataTransfer.files[0];
        setFile(f);
        setPreview(URL.createObjectURL(f));
      }
    },
  };

  return (
    <Collapse in={open}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(
            theme.palette.primary.main,
            isEditing ? 0.3 : 0.2
          )}`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            height: "3px",
            width: "100%",
            background: isEditing
              ? theme.palette.warning.main
              : theme.palette.primary.main,
          },
        }}
      >
        {/* Heading */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              color: isEditing
                ? theme.palette.warning.main
                : theme.palette.primary.main,
              fontWeight: 600,
              flexGrow: 1,
            }}
          >
            {isEditing ? <EditIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
            {isEditing
              ? `Edit Carousel Item`
              : "Add New Carousel Item"}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3, opacity: 0.2 }} />

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          {/* Content Information */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: theme.palette.text.primary, mb: 1.5 }}
            >
              Content Information
            </Typography>

            <Paper
              sx={{
                p: 3,
                bgcolor: alpha(theme.palette.background.default, 0.5),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              }}
            >
              <Stack spacing={3}>
                {/* Title Input */}
                <Box>
                  <InputLabel
                    required
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      mb: 1,
                    }}
                  >
                    Title
                  </InputLabel>
                  <TextField
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      sx: {
                        fontSize: "1.1rem",
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.7
                        ),
                        borderRadius: 1.5,
                        height: 56,
                        px: 2,
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Sub Title Input */}
                <Box>
                  <InputLabel
                    required
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      mb: 1,
                    }}
                  >
                    Sub Title
                  </InputLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        fontSize: "0.95rem",
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.7
                        ),
                        borderRadius: 1.5,
                        px: 2,
                        py: 1,
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.secondary.main,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.secondary.main,
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Image Upload */}
          <Box sx={{ mt: 1, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <UploadIcon
                fontSize="small"
                sx={{ mr: 1.5, color: theme.palette.primary.main }}
              />
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ color: theme.palette.text.primary }}
              >
                Carousel Image
              </Typography>
            </Box>

            <Box
              {...dragProps}
              sx={{
                border: `2px dashed ${
                  drag
                    ? theme.palette.primary.main
                    : alpha(theme.palette.common.white, 0.2)
                }`,
                borderRadius: 2,
                p: 3,
                minHeight: 220,
                transition: "all 0.2s ease",
                background: drag
                  ? alpha(theme.palette.primary.main, 0.08)
                  : alpha(theme.palette.background.default, 0.3),
                backdropFilter: "blur(4px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {preview ? (
                /* Preview */
                <Box sx={{ position: "relative", width: "100%", textAlign: "center" }}>
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -16,
                      right: -16,
                      bgcolor: alpha(theme.palette.error.main, 0.8),
                      color: "#fff",
                      "&:hover": { bgcolor: theme.palette.error.main },
                      width: 32,
                      height: 32,
                    }}
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <Box
                    component="img"
                    src={preview}
                    alt="Preview"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 280,
                      objectFit: "contain",
                      borderRadius: 1,
                      boxShadow: `0 10px 30px -10px ${alpha(
                        theme.palette.common.black,
                        0.5
                      )}`,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1.5, display: "block" }}
                  >
                    {file?.name || "Current image"}
                  </Typography>
                </Box>
              ) : (
                /* Empty drag area */
                <>
                  <UploadIcon
                    sx={{
                      fontSize: 64,
                      color: drag
                        ? theme.palette.primary.main
                        : alpha(theme.palette.common.white, 0.3),
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
                    Drag & drop image here
                  </Typography>
                 
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      mt: 1,
                      py: 1,
                      px: 3,
                      borderColor: alpha(theme.palette.common.white, 0.3),
                      "&:hover": { borderColor: theme.palette.primary.main },
                      borderRadius: 2,
                    }}
                  >
                    Browse Files
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          const f = e.target.files[0];
                          setFile(f);
                          setPreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Buttons */}
          <Divider sx={{ opacity: 0.2, my: 1 }} />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              justifyContent: "flex-end",
            }}
          >
            {isEditing && (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CancelIcon />}
                onClick={reset}
                sx={{
                  height: 48,
                  px: 3,
                  borderRadius: 2,
                }}
              >
                Reset
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
              sx={{
                backgroundColor: isEditing
                  ? theme.palette.warning.main
                  : theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: isEditing
                    ? theme.palette.warning.dark
                    : theme.palette.primary.dark,
                },
                fontWeight: "medium",
                borderRadius: 2,
                minWidth: 160,
                height: 48,
                px: 3,
              }}
            >
              {isEditing ? "Update Item" : "Create Item"}
            </Button>
            {isEditing && (
              <Button
                variant="text"
                onClick={onCancel}
                sx={{ height: 48 }}
              >
                Close
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Collapse>
  );
};

export default CarouselForm;