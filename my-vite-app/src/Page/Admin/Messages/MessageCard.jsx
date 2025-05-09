// src/Page/Admin/Messages/components/MessageCard.jsx
import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const MessageCard = ({
  messageData,
  isExpanded,
  toggleMessageExpansion,
  markAsRead,
  deleteMsg,
  copyEmail,
  colors,
  isDeleting,
  longMessage,
  formatDate,
}) => {
  const m = messageData;

  return (
    <Box
      onClick={() => toggleMessageExpansion(m.id)}
      sx={{
        background: colors.card,
        border: `1px solid ${colors.darkMode ? colors.borderLight : colors.border}`,
        borderLeft: `4px solid ${m.status === false ? colors.accent : "transparent"}`,
        p: { xs: "16px", sm: "20px" },
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: colors.darkMode
          ? "0 4px 12px rgba(0, 0, 0, 0.15)"
          : "0 2px 6px rgba(0, 0, 0, 0.03)",
        transform: isExpanded ? "scale(1.002)" : "scale(1)",
        "&:hover": {
          boxShadow: colors.darkMode
            ? "0 6px 16px rgba(0, 0, 0, 0.25)"
            : "0 4px 12px rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: { xs: "14px", sm: "20px" },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ flex: 1, width: { xs: "100%", md: "auto" } }}>
          <Typography
            component="h3"
            sx={{
              m: "0 0 12px 0",
              fontWeight: m.status === false ? 700 : 600,
              fontSize: { xs: "18px", sm: "20px" },
              color: m.status === false ? colors.accent : colors.text,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {m.status === false && (
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  background: colors.accent,
                  borderRadius: "50%",
                }}
              />
            )}
            {m.subject || "No Subject"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: { xs: "10px", sm: "16px" },
              flexWrap: "wrap",
              alignItems: "center",
              mb: "12px",
            }}
          >
            <Chip
              icon={<PersonIcon fontSize="small" />}
              label={m.name}
              size="small"
              sx={{
                borderRadius: "6px",
                background: colors.darkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
                color: colors.text,
                fontWeight: 500,
                py: "4px",
              }}
            />
            <Tooltip title="Copy email address">
              <Chip
                icon={<EmailIcon fontSize="small" />}
                label={m.email}
                size="small"
                deleteIcon={<ContentCopyIcon fontSize="small" />}
                onDelete={(e) => copyEmail(m.email, e)}
                sx={{
                  borderRadius: "6px",
                  background: colors.darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                  color: colors.text,
                  fontWeight: 500,
                  py: "4px",
                  "& .MuiChip-deleteIcon": {
                    color: colors.accent,
                  },
                }}
              />
            </Tooltip>
            <Chip
              icon={<CalendarTodayIcon fontSize="small" />}
              label={formatDate(m.created_at)}
              size="small"
              sx={{
                borderRadius: "6px",
                background: colors.darkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
                color: colors.text,
                fontWeight: 500,
                py: "4px",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            width: { xs: "100%", md: "auto" },
            justifyContent: "flex-end",
          }}
        >
          {m.status === false && (
            <Button
              onClick={(e) => markAsRead(m.id, e)}
              variant="contained"
              startIcon={<CheckIcon />}
              sx={{
                background: colors.buttonPrimary,
                color: "#fff",
                border: "none",
                py: "8px",
                px: { xs: "12px", sm: "16px" },
                borderRadius: "8px",
                fontWeight: 600,
                boxShadow: colors.darkMode
                  ? "0 2px 8px rgba(0,0,0,0.2)"
                  : "0 2px 5px rgba(37, 99, 235, 0.2)",
                transition: "all 0.2s",
                "&:hover": {
                  background: colors.buttonPrimaryHover,
                  transform: "translateY(-1px)",
                  boxShadow: colors.darkMode
                    ? "0 4px 12px rgba(0,0,0,0.25)"
                    : "0 4px 8px rgba(37, 99, 235, 0.25)",
                },
              }}
            >
              <Box sx={{ display: { xs: "none", sm: "block" } }}>Mark Read</Box>
              <Box sx={{ display: { xs: "block", sm: "none" } }}>Read</Box>
            </Button>
          )}
          <Button
            onClick={(e) => deleteMsg(m.id, e)}
            disabled={isDeleting[m.id]}
            variant="contained"
            startIcon={<DeleteOutlineIcon />}
            sx={{
              background: colors.buttonDanger,
              color: "#fff",
              border: "none",
              py: "8px",
              px: { xs: "12px", sm: "16px" },
              borderRadius: "8px",
              opacity: isDeleting[m.id] ? 0.7 : 1,
              fontWeight: 600,
              boxShadow: colors.darkMode
                ? "0 2px 8px rgba(0,0,0,0.2)"
                : "0 2px 5px rgba(229, 62, 62, 0.2)",
              transition: "all 0.2s",
              "&:hover": {
                background: colors.buttonDangerHover,
                transform: "translateY(-1px)",
                boxShadow: colors.darkMode
                  ? "0 4px 12px rgba(0,0,0,0.25)"
                  : "0 4px 8px rgba(229, 62, 62, 0.25)",
              },
            }}
          >
            {isDeleting[m.id] ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Box>

      {/* Message Content */}
      <Box
        sx={{
          mt: "14px",
          p: "16px",
          background: colors.darkMode ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
          borderRadius: "10px",
          maxHeight: isExpanded ? "none" : "100px",
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
          border: `1px solid ${colors.darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
        }}
      >
        <Typography
          sx={{
            m: 0,
            whiteSpace: "pre-wrap",
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          {m.message}
        </Typography>
        {longMessage && !isExpanded && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: `linear-gradient(to bottom, ${colors.gradientStart}, ${colors.gradientEnd})`,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              pb: "10px",
            }}
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleMessageExpansion(m.id);
              }}
              sx={{
                color: colors.accent,
                background: colors.darkMode
                  ? "rgba(0,0,0,0.3)"
                  : "rgba(255,255,255,0.8)",
                fontWeight: 600,
                borderRadius: "20px",
                px: "16px",
                py: "6px",
                fontSize: "13px",
                "&:hover": {
                  background: colors.darkMode
                    ? "rgba(0,0,0,0.4)"
                    : "rgba(255,255,255,0.9)",
                },
              }}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Show more
            </Button>
          </Box>
        )}
        {longMessage && isExpanded && (
          <Box sx={{ mt: "10px", textAlign: "center" }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleMessageExpansion(m.id);
              }}
              sx={{
                color: colors.accent,
                background: colors.darkMode
                  ? "rgba(0,0,0,0.3)"
                  : "rgba(255,255,255,0.8)",
                fontWeight: 600,
                borderRadius: "20px",
                px: "16px",
                py: "6px",
                fontSize: "13px",
                "&:hover": {
                  background: colors.darkMode
                    ? "rgba(0,0,0,0.4)"
                    : "rgba(255,255,255,0.9)",
                },
              }}
              endIcon={<KeyboardArrowUpIcon />}
            >
              Show less
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessageCard;
