// src/Page/Topics/MoonshineOfflineSustainin/MoonshineOfflineSustainin.jsx

import React, { useState, useEffect } from 'react';
import {
  PowerSettingsNew as UptimeIcon,
  Storage as SystemHealthIcon,
  SettingsBackupRestore as RecoveryIcon,
  Security as ReliabilityIcon
} from '@mui/icons-material';
import { useTheme } from '../../../context_themes/ThemeContext';
import TopicsLayout from '../TopicsSharedComponent/TopicsLayout';
import TopicsCarousel from '../TopicsSharedComponent/TopicsCarousel';

// Import images 
import workdaySlide1 from '../../../assets/workdaySlide1.jpg';
import workdaySlide2 from '../../../assets/workdaySlide2.png';
import workdaySlide3 from '../../../assets/workdaySlide3.png';

const MoonshineOfflineSustainin = () => {
  const { darkMode } = useTheme();
  const [selectedNav, setSelectedNav] = useState('System Uptime');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Updated nav items for Moonshine Offline Sustainment
  const navItems = [
    { icon: <UptimeIcon />, text: 'System Uptime', iconColor: '#4caf50' },
    { icon: <SystemHealthIcon />, text: 'System Health', iconColor: '#2196f3' },
    { icon: <RecoveryIcon />, text: 'Backup & Recovery', iconColor: '#ff9800' },
    { icon: <ReliabilityIcon />, text: 'System Reliability', iconColor: '#ffeb3b' },
  ];

  // Updated slides to match Moonshine Offline Sustainment topics
  const workdaySlides = [
    {
      image: workdaySlide1,
      title: 'Ensuring Offline Stability',
      description: 'Learn strategies for maintaining stable performance during offline operations.'
    },
    {
      image: workdaySlide2,
      title: 'Monitoring & Health Checks',
      description: 'Implement monitoring systems to ensure uptime and detect issues early.'
    },
    {
      image: workdaySlide3,
      title: 'Resilience & Recovery Planning',
      description: 'Develop robust recovery plans to minimize downtime and ensure data protection.'
    }
  ];

  return (
    <TopicsLayout
      darkMode={darkMode}
      navItems={navItems}
      selectedNav={selectedNav}
      setSelectedNav={setSelectedNav}
      CarouselComponent={
        <TopicsCarousel slides={workdaySlides} carouselAriaLabel="Topics related to Moonshine Offline Sustainment" />
      }
    >
      
    </TopicsLayout>
  );
};

export default MoonshineOfflineSustainin;
