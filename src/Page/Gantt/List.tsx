import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DescriptionIcon from "@mui/icons-material/Description";
import { useTheme } from "../../themes/ThemeContext";
import "../Css/Global.css";

// Interface for the raw API response item
interface ApiProjectItem {
  id?: string; // Add id field
  text: string;
  owner: string;
  startDatetime: string;
  description: string;
}

// Interface for the API response structure
interface ApiResponse {
  digitalProject: ApiProjectItem[];
}

// Interface for the mapped project data
interface ProjectData {
  id: string;
  title: string;
  owner: string;
  startDate: string;
  description: string;
}

const ProjectList: React.FC = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<ProjectData[]>([]);

  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      try {
        const response = await fetch("http://mypenm0iesvr02/ieportal-api/api/project");
        const data: ApiResponse = await response.json();
        const result: ApiProjectItem[] = Array.isArray(data.digitalProject) ? data.digitalProject : [];

        const mapped: ProjectData[] = result.map((item: ApiProjectItem, index: number) => ({
          id: item.id || index.toString(), // Use API id or fallback to index
          title: item.text,
          owner: item.owner,
          startDate: item.startDatetime,
          description: item.description
        }));

        setProjectData(mapped);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        setProjectData([]);
      }
    };

    fetchProjects();
  }, []);

  const handleCardClick = (e: React.MouseEvent, projectTitle: string) => {
    // Only handle left clicks, let right clicks show default context menu
    if (e.button === 0) {
      e.preventDefault();
      const encodedProjectName = encodeURIComponent(projectTitle);
      navigate(`/project/${encodedProjectName}`);
    }
  };

  return (
    <Box
      sx={{
        pt: { xs: "72px", md: "80px" },
        px: { xs: 2, md: 4 },
        pb: 5,
        maxWidth: "1440px",
        mx: "auto",
        backgroundColor: darkMode
          ? "var(--section-stripe-background-dark-mode)"
          : "var(--section-stripe-background-light-mode)",
        minHeight: "100vh",
      }}
    >
      <Typography
        component="h3"
        variant="h3"
        className="section-title"
        sx={{
          mb: 4,
          textAlign: "left",
          pl: { xs: 1, md: 0 },
          color: darkMode ? "var(--section-color-dark-mode)" : "var(--section-color-light-mode)",
        }}
      >
        IE Project List
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{
          display: { xs: "flex", sm: "grid" },
          flexWrap: { xs: "nowrap", sm: "wrap" },
          overflowX: { xs: "auto", sm: "visible" },
          gridTemplateColumns: { sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          alignItems: "stretch",
        }}
      >
        {Array.isArray(projectData) && projectData.length > 0 ? (
          projectData.map((item: ProjectData) => (
            <Grid
              key={item.id}
              sx={{
                flex: { xs: "0 0 auto", sm: "1 1 auto" },
                minWidth: { xs: "260px", sm: "auto" },
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <Card
                className={`card ${darkMode ? "dark-mode" : ""}`}
                elevation={1}
                variant="outlined"
                component="a"
                href={`/ieportal/project/${encodeURIComponent(item.title)}`}
                onClick={(e) => handleCardClick(e, item.title)}
                sx={{
                  height: "100%",
                  minHeight: "250px", 
                  borderLeft: "4px solid #4A90E2", // Softer blue instead of cyan
                  borderRadius: "8px", // Slightly more rounded
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                  backgroundColor: darkMode ? "#2D3748" : "#FFFFFF", // Lighter card background
                  border: darkMode ? "1px solid #4A5568" : "1px solid #E2E8F0", // Subtle border
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: darkMode 
                      ? "0 8px 25px rgba(0, 0, 0, 0.4)" 
                      : "0 8px 25px rgba(0, 0, 0, 0.15)",
                    backgroundColor: darkMode ? "#374151" : "#F8FAFC", // Slightly lighter on hover
                  },
                }}
              >
                <Stack sx={{ height: "100%", justifyContent: "flex-start" }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      p: 2.5, // Reduced padding from 3 to 2.5
                    }}
                  >
                    {/* Title & Avatar */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2.5} // Increased for better separation
                      sx={{ minHeight: "56px" }} // Increased for bigger title
                    >
                      <Typography 
                        sx={{ 
                          fontSize: 26, // Increased from 22 to 26
                          fontWeight: 800, // Increased from 700 to 800 for bolder appearance
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.2,
                          maxHeight: "56px", // Increased to accommodate larger font
                          textAlign: "left",
                          color: darkMode ? "rgba(255, 255, 255, 0.95)" : "#1A202C", // High contrast with opacity
                        }}
                      >
                        {item.title || "No Title"}
                      </Typography>

                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          backgroundColor: "#4A90E2", 
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "30px", 
                          fontWeight: 600,
                          flexShrink: 0, 
                          ml: 1, 
                          boxShadow: darkMode 
                            ? "0 2px 8px rgba(0, 0, 0, 0.3)" 
                            : "0 2px 8px rgba(74, 144, 226, 0.2)",
                        }}
                      >
                        {item.owner?.charAt(0)?.toUpperCase() || "?"}
                      </Box>
                    </Box>

                    {/* Owner */}
                    <Box mb={1.5} sx={{ textAlign: "left" }}>
                      <Typography 
                        component="span"
                        sx={{ 
                          fontSize: 14, // Reduced from 16 to 14
                          fontWeight: 500, // Reduced from 600 to 500
                          color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(26, 32, 44, 0.6)", // Reduced opacity
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Owner:{" "}
                      </Typography>
                      <Typography 
                        component="span"
                        sx={{ 
                          fontSize: 15, // Slightly larger than label
                          fontWeight: 400, 
                          color: darkMode ? "rgba(255, 255, 255, 0.85)" : "rgba(26, 32, 44, 0.85)", // Medium opacity
                        }}
                      >
                        {item.owner || "N/A"}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 2,
                        mt: 0,
                      }}
                    >
                      <DescriptionIcon 
                        sx={{ 
                          fontSize: 18, 
                          color: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(26, 32, 44, 0.5)", // Consistent with opacity theme
                          mt: 0.2, // Slight offset to align with text
                          flexShrink: 0,
                        }} 
                      />
                      <Typography
                        sx={{
                          fontSize: 13, // Reduced from 14 to 13
                          color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(26, 32, 44, 0.7)", // Secondary with opacity
                          lineHeight: 1.4, 
                          minHeight: "52px", // Reduced slightly
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          textOverflow: "ellipsis",
                          textAlign: "left",
                          fontWeight: 400,
                        }}
                      >
                        {item.description || "No description provided."}
                      </Typography>
                    </Box>

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Start Date */}
                    <Box 
                      sx={{ 
                        display: "flex", 
                        alignItems: "center",
                        pt: 1.5, // Reduced from 1 to 1.5 for better visual separation
                        borderTop: "1px solid", 
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(26, 32, 44, 0.1)", // Subtle border with opacity
                        textAlign: "left"
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontSize: 13, 
                          color: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(26, 32, 44, 0.5)", // Lower opacity for less important info
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        Start Date:{" "}
                        <Typography 
                          component="span"
                          sx={{ 
                            fontSize: 13,
                            fontWeight: 500, 
                            color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(26, 32, 44, 0.7)", // Slightly higher opacity for value
                          }}
                        >
                          {item.startDate
                            ? new Date(item.startDate).toLocaleDateString()
                            : "-"}
                        </Typography>
                      </Typography>
                    </Box>
                  </CardContent>
                </Stack>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ px: 2, color: "gray" }}>
            No project data found.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ProjectList;