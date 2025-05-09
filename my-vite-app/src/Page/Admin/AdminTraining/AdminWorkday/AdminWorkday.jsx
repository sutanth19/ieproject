import React from "react";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import WorkIcon from '@mui/icons-material/Work';

import AdminTrainingCarousel from "../AdminTrainingSharedComponent/AdminTrainingCarousel/AdminTrainingCarousel";
import AdminTrainingLayout from "../AdminTrainingSharedComponent/AdminTrainingLayout";

const AdminWorkday = () => {
  // State for selected navigation item
  const [selectedNav, setSelectedNav] = React.useState("Overview");
  
  // Navigation items for AdminTrainingLayout
  const navItems = [
    { text: "Overview", icon: <HomeIcon />, iconColor: "#4caf50" },
    { text: "Workday Settings", icon: <SettingsIcon />, iconColor: "#2196f3" },
    { text: "Workday Support", icon: <HelpIcon />, iconColor: "#ff9800" },
    { text: "Training Materials", icon: <WorkIcon />, iconColor: "#9c27b0" },
  ];

  // Carousel component to pass to AdminTrainingLayout
  const carouselComponent = <AdminTrainingCarousel trainingType="WORKDAY" />;

  return (
    <>
      <CssBaseline />
      <div>
        {/* Top bar */}
        <div style={{ height: '5px', backgroundColor: '#3ea6ff' }} />
        
        {/* Header */}
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography 
            variant="h2" 
            component="h1"
            style={{ fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}
          >
         
          </Typography>
        </div>

        {/* Main Content */}
        <Container maxWidth="xl">
          {/* Using AdminTrainingLayout with the carousel as its CarouselComponent prop */}
          <AdminTrainingLayout
            darkMode={true}
            navItems={navItems}
            selectedNav={selectedNav}
            setSelectedNav={setSelectedNav}
            CarouselComponent={carouselComponent}
          >
            {/* Content for the selected navigation item will go here */}
            <div>
              {selectedNav === "Overview" && (
                <Typography variant="body1">
                  Welcome to the Workday Administration portal. Here you can manage all aspects of  Workday implementation.
                </Typography>
              )}
              {selectedNav === "Workday Settings" && (
                <Typography variant="body1">
                  Configure  Workday instance settings here.
                </Typography>
              )}
              {selectedNav === "Workday Support" && (
                <Typography variant="body1">
                  Find help resources and support options for Workday.
                </Typography>
              )}
              {selectedNav === "Training Materials" && (
                <Typography variant="body1">
                  Access training documents and videos for Workday administration.
                </Typography>
              )}
            </div>
          </AdminTrainingLayout>
        </Container>
      </div>
    </>
  );
};

export default AdminWorkday;