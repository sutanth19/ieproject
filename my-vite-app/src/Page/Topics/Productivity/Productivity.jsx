import React, { useState, useEffect } from 'react';
import InsightsIcon from '@mui/icons-material/Insights';
import TimeManagementIcon from '@mui/icons-material/AccessTime';
import TaskIcon from '@mui/icons-material/Checklist';
import ImprovementIcon from '@mui/icons-material/TrendingUp';
import ProductivityIcon from '@mui/icons-material/Speed';
import FocusIcon from '@mui/icons-material/Psychology';
import QualityIcon from '@mui/icons-material/WorkspacePremium';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context_themes/ThemeContext';
import TopicsLayout from '../TopicsSharedComponent/TopicsLayout';
import TopicsCarousel from '../TopicsSharedComponent/TopicsCarousel';

// Import images 
import workdaySlide1 from '../../../assets/workdaySlide1.jpg';
import workdaySlide2 from '../../../assets/workdaySlide2.png';
import workdaySlide3 from '../../../assets/workdaySlide3.png';

const Productivity = () => {
  const { darkMode } = useTheme();
  const [selectedNav, setSelectedNav] = useState('Insights');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navItems = [
    { icon: <InsightsIcon />, text: 'Insights', iconColor: '#4caf50' },
    { icon: <TimeManagementIcon />, text: 'Time Management', iconColor: '#2196f3' },
    { icon: <TaskIcon />, text: 'Task Efficiency', iconColor: '#ff9800' },
    { icon: <ProductivityIcon />, text: 'Productivity Tools', iconColor: '#9c27b0' },
    { icon: <FocusIcon />, text: 'Focus Techniques', iconColor: '#f44336' },
    { icon: <QualityIcon />, text: 'Quality of Work', iconColor: '#00bcd4' },
    { icon: <ImprovementIcon />, text: 'Continuous Improvement', iconColor: '#ffeb3b' }
  ];

  const workdaySlides = [
    {
      image: workdaySlide1,
      title: 'Unlock  Productivity Potential',
      description: 'Discover data-driven insights and strategies to transform how  team works.'
    },
    {
      image: workdaySlide2,
      title: 'Master Time Management',
      description: 'Learn cutting-edge techniques to reclaim  calendar and focus on what matters.'
    },
    {
      image: workdaySlide3,
      title: 'Efficiency Revolution',
      description: "Implement proven systems that reduce friction and accelerate  workflow."
    }
  ];

  const InsightsContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography
        variant="h6"
        gutterBottom
        fontWeight={500}
        color={darkMode ? "#e2e8f0" : "#334155"}
      >
        Productivity Dashboard
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>

        <Chip 
          icon={<ProductivityIcon sx={{ color: '#4caf50 !important' }} />} 
          label="Productivity Score: 87%"
          sx={{ 
            backgroundColor: darkMode ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)',
            color: darkMode ? '#4caf50' : '#2e7d32',
            fontWeight: 500,
            px: 1
          }} 
        />
        
        <Chip 
          icon={<TimeManagementIcon sx={{ color: '#2196f3 !important' }} />} 
          label="Focus Time: 5.2 hrs"
          sx={{ 
            backgroundColor: darkMode ? 'rgba(33, 150, 243, 0.15)' : 'rgbac(33, 150, 243, 0.1)',
            color: darkMode ? '#2196f3' : '#1565c0',
            fontWeight: 500,
            px: 1
          }} 
          
        />

        <Chip
          icon={<TimeManagementIcon sx={{ color: '#FFFF00 !important' }} />}
          label="Focus Time: 5.2 hrs"
          sx={{
            backgroundColor: darkMode ? 'rgba(255, 255, 0, 0.15)': 'rgba(96, 96, 0, 0.1)',
            color: '#FFFF00',
            fontWeight: 500,
            px: 1
          }}
        />

      </Box>

    </motion.div>
  );

  const renderContent = () => {
    switch (selectedNav) {
      case 'Insights':
        return <InsightsContent />;
      default:
        return null;
    }
  };

  return (
    <TopicsLayout
      darkMode={darkMode}
      navItems={navItems}
      selectedNav={selectedNav}
      setSelectedNav={setSelectedNav}
      CarouselComponent={
        <TopicsCarousel
          slides={workdaySlides}
          carouselAriaLabel="Topics related to Productivity"
        />
      }
    >
      {renderContent()}
    </TopicsLayout>
  );
};

export default Productivity;
