import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "../../themes/ThemeContext";
import "../Css/Global.css";

const ProjectList = () => {
  const { darkMode } = useTheme();
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://mypenm0iesvr02/ieportal-api/api/project");
        const data = await response.json();
        const result = Array.isArray(data.digitalProject) ? data.digitalProject : [];

        const mapped = result.map(item => ({
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

  return (
    <Box
      sx={{
        pt: { xs: "72px", md: "80px" },
        px: { xs: 2, md: 4 },
        pb: 6,
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
          projectData.map((item, index) => (
            <Grid
              key={index}
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
                sx={{
                  height: "100%",
                  minHeight: "250px", 
                  borderLeft: "4px solid #46BFE8",
                  borderRadius: "5px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Stack sx={{ height: "100%", justifyContent: "flex-start" }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      p: 3, 
                    }}
                  >
                    {/* Title & Avatar */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2.5} 
                      sx={{ minHeight: "48px" }}
                    >
                      <Typography 
                        sx={{ 
                          fontSize: 22, // reduced from 28
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.2,
                          maxHeight: "48px"
                        }}
                      >
                        {item.title || "No Title"}
                      </Typography>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          backgroundColor: "#2196f3",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "30px", 
                          fontWeight: 600,
                        }}
                      >
                        {item.owner?.charAt(0)?.toUpperCase() || "?"}
                      </Box>
                    </Box>

                    {/* Owner */}
                    <Box mb={2}> 
                      <Typography 
                        component="span"
                        sx={{ 
                          fontSize: 16, 
                          fontWeight: 600, 
                          color: darkMode ? "var(--section-color-dark-mode)" : "var(--section-color-light-mode)",
                        }}
                      >
                        Owner:{" "}
                      </Typography>
                      <Typography 
                        component="span"
                        sx={{ 
                          fontSize: 16, 
                          fontWeight: 400, 
                          color: darkMode ? "var(--section-color-dark-mode)" : "var(--section-color-light-mode)",
                        }}
                      >
                        {item.owner || "N/A"}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "grey.600", 
                        mb: 2.5, 
                        mt: 0,
                        lineHeight: 1.4, 
                        minHeight: "56px", 
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.description || "No description provided."}
                    </Typography>

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Start Date */}
                    <Box 
                      sx={{ 
                        display: "flex", 
                        alignItems: "center",
                        pt: 1, 
                        borderTop: "1px solid", 
                        borderColor: "grey.200",
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontSize: 13, 
                          color: "grey.500",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5, 
                        }}
                      >
                        📅 Start Date:{" "}
                        <Typography 
                          component="span"
                          sx={{ 
                            fontSize: 13,
                            fontWeight: 500, 
                            color: "grey.700",
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
