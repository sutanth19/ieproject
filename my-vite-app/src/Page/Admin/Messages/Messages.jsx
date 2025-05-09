// src/Page/Admin/Messages/Messages.jsx
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context_themes/ThemeContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


// Import our new components:
import HeaderSection from "./HeaderSection";
import TabNavigation from "./TabNavigation";
import MessageCard from "./MessageCard";
import ABox from "./ABox";

// Other state management and MUI icons can remain here
const Messages = () => {
  const { darkMode } = useTheme();

  // -- States --
  const [messages, setMessages] = useState([]);
  const [isDeleting, setIsDeleting] = useState({});
  const [alert, setAlert] = useState(null);
  const [activeTab, setActiveTab] = useState("unread");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  // -- API Calls, Handlers, and Helpers --

  const fetchMessages = () => {
    setIsLoading(true);
    return fetch("http://localhost:5001/api/contact")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching messages:", data.error);
          setAlert({ msg: "Failed to load messages", error: true });
          return [];
        }
        return data;
      })
      .then(setMessages)
      .catch((e) => {
        console.error("Error in fetchMessages:", e);
        setAlert({ msg: "Network error. Please try again.", error: true });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const deleteMsg = async (id, event) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    setIsDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`http://localhost:5001/api/contact/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      setAlert({ msg: "Message deleted successfully!", error: false });
      if (expandedMessage === id) setExpandedMessage(null);
    } catch (e) {
      setAlert({ msg: e.message, error: true });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const markAsRead = async (id, event) => {
    event.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5001/api/contact/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 1 }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: true } : msg))
      );
      setAlert({ msg: "Message marked as read", error: false });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error("Error updating message status:", error);
      setAlert({ msg: error.message, error: true });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const copyEmail = (email, event) => {
    event.stopPropagation();
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setAlert({ msg: "Email copied to clipboard!", error: false });
        setTimeout(() => setAlert(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy email:", err);
        setAlert({ msg: "Failed to copy email", error: true });
        setTimeout(() => setAlert(null), 3000);
      });
  };

  const toggleMessageExpansion = (id) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredMessages = messages.filter((message) => {
    if (activeTab === "unread" && message.status !== false) return false;
    if (activeTab === "read" && message.status !== true) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        message.subject?.toLowerCase().includes(searchLower) ||
        message.name?.toLowerCase().includes(searchLower) ||
        message.email?.toLowerCase().includes(searchLower) ||
        message.message?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const unreadCount = messages.filter((m) => m.status === false).length;
  const readCount = messages.filter((m) => m.status === true).length;

  // Define colors based on theme (same as before)
  const colors = darkMode
    ? {
        background: "#0a192f",
        card: "#162544",
        cardHighlight: "#1a2d4f",
        border: "#26406d",
        text: "#f0f4ff",
        accent: "#3498db",
        accentLight: "#60a5fa",
        accentDark: "#2563eb",
        buttonPrimary: "#3b82f6",
        buttonPrimaryHover: "#2563eb",
        buttonDanger: "#e53e3e",
        buttonDangerHover: "#c53030",
        buttonSecondary: "#4c5f82",
        buttonSecondaryHover: "#38465e",
        success: "#10b981",
        error: "#ef4444",
        searchBg: "#111c2e",
        gradientStart: "rgba(22, 37, 68, 0)",
        gradientEnd: "#162544",
        borderLight: "rgba(255,255,255,0.05)",
        darkMode: true,
      }
    : {
        background: "#f8fafc",
        card: "#ffffff",
        cardHighlight: "#f0f7ff",
        border: "#e2e8f0",
        text: "#334155",
        accent: "#2563eb",
        accentLight: "#60a5fa",
        accentDark: "#1d4ed8",
        buttonPrimary: "#3b82f6",
        buttonPrimaryHover: "#2563eb",
        buttonDanger: "#ef4444",
        buttonDangerHover: "#dc2626",
        buttonSecondary: "#94a3b8",
        buttonSecondaryHover: "#64748b",
        success: "#10b981",
        error: "#f43f5e",
        searchBg: "#f1f5f9",
        gradientStart: "rgba(255,255,255,0)",
        gradientEnd: "#ffffff",
        borderLight: "rgba(0,0,0,0.05)",
        darkMode: false,
      };

  // Tabs definition
  const tabs = [
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "read", label: "Read", count: readCount },
  ];

  return (
    <Box
      sx={{
        mt: "20px",
        p: { xs: "16px", sm: "24px" },
        background: colors.background,
        color: colors.text,
        borderRadius: "12px",
        maxWidth: "1400px",
        mx: "auto",
      }}
    >
      {/* Render Header Section */}
      <HeaderSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        fetchMessages={fetchMessages}
        colors={colors}
      />

      {/* Render Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} colors={colors} />

      {/* Render Alert Box */}
      <ABox alert={alert} setAlert={setAlert} colors={colors} />

      {/* Render Content */}
      {isLoading && messages.length === 0 ? (
        <Box
          sx={{
            p: "60px",
            textAlign: "center",
            color: `${colors.text}aa`,
            background: colors.card,
            borderRadius: "12px",
            border: `1px solid ${colors.darkMode ? "rgba(255,255,255,0.05)" : colors.border}`,
          }}
        >
          <Box
            sx={{
              animation: "rotate 1.5s linear infinite",
              fontSize: "32px",
              mb: "16px",
            }}
          >
            ⟳
          </Box>
          <Typography sx={{ fontSize: "16px" }}>Loading messages...</Typography>
        </Box>
      ) : filteredMessages.length === 0 ? (
        <Box
          sx={{
            p: "50px",
            textAlign: "center",
            background: colors.card,
            borderRadius: "12px",
            border: `1px solid ${colors.darkMode ? "rgba(255,255,255,0.05)" : colors.border}`,
          }}
        >
          <Typography sx={{ fontSize: "17px", fontWeight: 500, opacity: 0.8 }}>
            {searchTerm
              ? "No messages match  search"
              : `No ${activeTab} messages found`}
          </Typography>
          {searchTerm && (
            <Button
              onClick={() => setSearchTerm("")}
              sx={{
                mt: "16px",
                background: colors.buttonPrimary,
                color: "#ffffff",
                px: "16px",
                py: "8px",
                borderRadius: "8px",
                "&:hover": { background: colors.buttonPrimaryHover },
              }}
            >
              Clear Search
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {filteredMessages.map((m) => (
            <MessageCard
              key={m.id}
              messageData={m}
              isExpanded={expandedMessage === m.id}
              toggleMessageExpansion={toggleMessageExpansion}
              markAsRead={markAsRead}
              deleteMsg={deleteMsg}
              copyEmail={copyEmail}
              colors={colors}
              isDeleting={isDeleting}
              longMessage={m.message && m.message.length > 200}
              formatDate={formatDate}
            />
          ))}
        </Box>
      )}

      <style>
        {`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default Messages;
