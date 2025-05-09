import React, { useState, useEffect, useRef } from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const TopicsLayout = ({
  darkMode,
  navItems,
  selectedNav,
  setSelectedNav,
  CarouselComponent,
  children,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const scrollContainerRef = useRef(null);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine if  on mobile based on window width
  const isMobile = windowWidth < 768;

  // Find the index of the selected nav item
  const selectedIndex = navItems.findIndex((item) => item.text === selectedNav);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedNav(navItems[newValue].text);
  };

  // Scroll to center the selected tab
  useEffect(() => {
    if (scrollContainerRef.current && isMobile && selectedIndex >= 0) {
      const container = scrollContainerRef.current;
      const tabElements = container.querySelectorAll(".MuiTab-root");

      if (tabElements[selectedIndex]) {
        const tabElement = tabElements[selectedIndex];
        const tabLeftOffset = tabElement.offsetLeft;
        const tabWidth = tabElement.offsetWidth;
        const containerWidth = container.offsetWidth;

        // Calculate scroll position to center the tab
        const scrollPosition = tabLeftOffset + tabWidth / 2 - containerWidth / 2;

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex, isMobile]);

  // Combined styles
  const styles = {
    trainingSection: {
      width: '100%',
      paddingTop: '16px',
      paddingBottom: '4px',
      boxSizing: 'border-box',
      backgroundColor: darkMode ? '#121e34' : '#F5F5F5',
      color: darkMode ? '#fff' : '#333',
    },
    trainingContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: isMobile ? '0 8px' : '0 12px',
      position: 'relative',
    },
    carouselSection: {
      marginBottom: isMobile ? '8px' : '16px',
    },
    separator: {
      content: "''",
      position: 'absolute',
      bottom: '-16px',
      left: '5%',
      width: '90%',
      height: '1px',
      backgroundColor: 'rgba(200, 200, 200, 0.3)',
      display: isMobile ? 'none' : 'none', // Set to 'none' to remove the line
    },
    mobileTabsContainer: {
      maxWidth: "100%",
      backgroundColor: darkMode ? "#1e2e4a" : "#ffffff",
      marginBottom: '16px',
      marginTop: '8px',
      borderRadius: "10px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      overflowX: "auto",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    leftSidebar: {
      width: "30%",
      backgroundColor: darkMode ? "#1e2e4a" : "#ffffff",
      border: darkMode ? "none" : "1px solid #e0e0e0",
      borderRadius: "10px",
      padding: "16px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      color: darkMode ? "#fff" : "#333",
      minHeight: "90vh", // Reduced from 95vh to allow some spacing at bottom
    },
    sidebarTitle: {
      marginBottom: '24px',
      fontWeight: "bold",
      textAlign: "center",
      color: darkMode ? "#fff" : "#333",
    },
    navItem: (isSelected) => ({
      borderRadius: "8px",
      marginBottom: '8px',
      color: isSelected ? "#3B82F6" : darkMode ? "#fff" : "#333",
      backgroundColor: isSelected ? "rgba(59,130,246,0.1)" : "transparent",
      transition: "all 0.3s ease",
    }),
    navItemIcon: (iconColor) => ({
      backgroundColor: "transparent",
      color: iconColor || (darkMode ? "#fff" : "#333"),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minWidth: "40px",
    }),
    mainContent: {
      width: isMobile ? "100%" : "70%",
      backgroundColor: darkMode ? "#1e2e4a" : "#ffffff",
      border: darkMode ? "none" : "1px solid #e0e0e0",
      borderRadius: "10px",
      padding: isMobile ? "12px" : "16px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      color: darkMode ? "#fff" : "#333",
      minHeight: isMobile ? "auto" : "80vh", // Changed from fixed minHeight to avoid extending to navbar
    },
    contentTitle: {
      marginBottom: '24px',
      fontWeight: "bold",
      textAlign: "center",
      color: darkMode ? "#fff" : "#333",
    },
    emptyContent: {
      color: darkMode ? "#ccc" : "#666",
      textAlign: "center",
    },
    tabLabel: (isSelected) => ({
      display: "flex",
      alignItems: "center",
      minWidth: "max-content",
      color: isSelected ? "#3B82F6" : darkMode ? "#fff" : "#333",
    }),
    tabIcon: {
      marginRight: '8px',
      display: "flex",
      alignItems: "center",
    },
    tab: (isSelected) => ({
      textTransform: "none",
      color: isSelected ? "#3B82F6" : darkMode ? "#fff" : "#333",
      fontWeight: isSelected ? "bold" : "normal",
      fontSize: "0.9rem",
      minHeight: "48px",
      paddingTop: '4px',
      paddingBottom: '4px',
    }),
  };

  return (
    <div style={styles.trainingSection}>
      <div style={styles.trainingContainer}>
        {/* Outer Container */}
        <Grid 
          container 
          direction="column" 
          sx={{ 
            minHeight: isMobile ? "auto" : "calc(100vh - 60px)", // Adjust for bottom navbar
            paddingBottom: '20px', // Add padding at bottom to create space before navbar
          }}
        >
          {/* Carousel Section */}
          <Grid item sx={{ mb: { xs: 1, md: 2 } }} style={styles.carouselSection}>
            {CarouselComponent}
            {/* Removed separator to fix line issue */}
          </Grid>

          {/* Mobile Scrollable Tabs Navigation */}
          {isMobile && (
            <Box
              ref={scrollContainerRef}
              sx={{
                ...styles.mobileTabsContainer,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Tabs
                value={selectedIndex >= 0 ? selectedIndex : 0}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons={false}
                aria-label="navigation tabs"
                sx={{
                  minHeight: "48px",
                  ".MuiTabs-indicator": {
                    backgroundColor: "#3B82F6",
                  },
                  ".MuiTabs-flexContainer": {
                    gap: "4px",
                  },
                }}
              >
                {navItems.map((item, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <Tab
                      key={item.text}
                      label={
                        <Box sx={styles.tabLabel(isSelected)}>
                          {/* Clone the icon to force a specific color */}
                          <Box sx={styles.tabIcon}>
                            {React.cloneElement(item.icon, {
                              sx: {
                                color: isSelected
                                  ? "#3B82F6"
                                  : item.iconColor || (darkMode ? "#fff" : "#333"),
                              },
                            })}
                          </Box>
                          {item.text}
                        </Box>
                      }
                      sx={{
                        ...styles.tab(isSelected),
                        "&.Mui-selected": {
                          color: "#3B82F6",
                        },
                      }}
                    />
                  );
                })}
              </Tabs>
            </Box>
          )}

          {/* Nav + Main Content */}
          <Grid
            container
            spacing={2} // gaps
            sx={{
              flexDirection: {
                xs: "column",
                md: "row",
              },
              flexWrap: {
                xs: "wrap",
                md: "nowrap",
              },
              mt: 0, // Remove top margin to reduce spacing
            }}
          >
            {/* Left Sidebar (Navigation) - Only visible on desktop */}
            {!isMobile && (
              <Grid
                item
                sx={styles.leftSidebar}
              >
                <Typography
                  variant="h6"
                  sx={styles.sidebarTitle}
                >
                  Navigation
                </Typography>

                <List>
                  {navItems.map((item) => {
                    const isSelected = selectedNav === item.text;
                    return (
                      <ListItem
                        key={item.text}
                        button
                        onClick={() => setSelectedNav(item.text)}
                        sx={{
                          ...styles.navItem(isSelected),
                          "&:hover": {
                            backgroundColor: "rgba(59,130,246,0.1)",
                            color: "#3B82F6",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={styles.navItemIcon(item.iconColor)}
                        >
                          {React.cloneElement(item.icon, {
                            sx: {
                              color: isSelected 
                                ? "#3B82F6" 
                                : item.iconColor || (darkMode ? "#fff" : "#333"),
                            },
                          })}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            )}

            {/* Main Content Area */}
            <Grid
              item
              sx={styles.mainContent}
            >
              {/* Only show selected nav title on desktop */}
              {!isMobile && (
                <Typography
                  variant="h6"
                  sx={styles.contentTitle}
                >
                  {selectedNav}
                </Typography>
              )}
              {children ? (
                children
              ) : (
                <Typography
                  align="center"
                  sx={styles.emptyContent}
                >
                  Content for {selectedNav} will be displayed here
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TopicsLayout;