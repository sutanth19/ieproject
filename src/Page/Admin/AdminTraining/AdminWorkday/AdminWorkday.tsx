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

interface NavItem {
  text: string;
  icon: React.ReactElement;
  iconColor: string;
}

const AdminWorkday: React.FC = () => {
  // State for selected navigation item
  const [selectedNav, setSelectedNav] = React.useState<string>("Overview");
  
  // Navigation items for AdminTrainingLayout
  const navItems: NavItem[] = [
    { text: "Overview", icon: <HomeIcon />, iconColor: "#4caf50" },
    { text: "Workday Settings", icon: <SettingsIcon />, iconColor: "#2196f3" },
    { text: "Workday Support", icon: <HelpIcon />, iconColor: "#ff9800" },
    { text: "Training Materials", icon: <WorkIcon />, iconColor: "#9c27b0" },
  ];

  // Carousel component to pass to AdminTrainingLayout
  const carouselComponent: React.ReactElement = <AdminTrainingCarousel trainingType="WORKDAY" />;

  const renderContent = (): React.ReactElement => {
    switch (selectedNav) {
      case "Overview":
        return (
          <Typography variant="body1">
            Welcome to the Workday Administration portal. Here you can manage all aspects of Workday implementation.
          </Typography>
        );
      case "Workday Settings":
        return (
          <Typography variant="body1">
            Configure Workday instance settings here.
          </Typography>
        );
      case "Workday Support":
        return (
          <Typography variant="body1">
            Find help resources and support options for Workday.
          </Typography>
        );
      case "Training Materials":
        return (
          <Typography variant="body1">
            Access training documents and videos for Workday administration.
          </Typography>
        );
      default:
        return (
          <Typography variant="body1">
            Welcome to the Workday Administration portal.
          </Typography>
        );
    }
  };

  return (
    <>
      <CssBaseline />
      <div>
        {/* Top bar */}
        <div style={{ height: '5px', backgroundColor: '#3ea6ff' }} />
        
        {/* Header */}
        <div style={{ 
          padding: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Typography 
            variant="h2" 
            component="h1"
            style={{ 
              fontWeight: 700, 
              color: '#f1f5f9', 
              letterSpacing: '-0.02em' 
            }}
          >
            {/* Title content appears to be missing in original */}
          </Typography>
        </div>

        {/* Main Content */}
        <Container maxWidth="xl">
          <AdminTrainingLayout
            darkMode={true}
            navItems={navItems}
            selectedNav={selectedNav}
            setSelectedNav={setSelectedNav}
            CarouselComponent={carouselComponent}
          >
            <div>
              {renderContent()}
            </div>
          </AdminTrainingLayout>
        </Container>
      </div>
    </>
  );
};

export default AdminWorkday;