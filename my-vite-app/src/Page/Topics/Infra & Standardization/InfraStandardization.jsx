// src/Page/Topics/InfraStandardization/InfraStandardization.jsx

import React, { useState, useEffect } from 'react';
import {
  Lan as NetworkIcon,
  Dns as SystemsIcon,
  Settings as ConfigIcon,
  VerifiedUser as ComplianceIcon
} from '@mui/icons-material';
import { useTheme } from '../../../context_themes/ThemeContext';
import TopicsLayout from '../TopicsSharedComponent/TopicsLayout';
import TopicsCarousel from '../TopicsSharedComponent/TopicsCarousel';

// Import images 
import workdaySlide1 from '../../../assets/workdaySlide1.jpg';
import workdaySlide2 from '../../../assets/workdaySlide2.png';
import workdaySlide3 from '../../../assets/workdaySlide3.png';

const InfraStandardization = () => {
  const { darkMode } = useTheme();
  const [selectedNav, setSelectedNav] = useState('Network Setup');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Updated nav items for Infrastructure Standardization
  const navItems = [
    { icon: <NetworkIcon />, text: 'Network Setup', iconColor: '#4caf50' },
    { icon: <SystemsIcon />, text: 'System Configurations', iconColor: '#2196f3' },
    { icon: <ConfigIcon />, text: 'Automation & Tools', iconColor: '#ff9800' },
    { icon: <ComplianceIcon />, text: 'Compliance & Standards', iconColor: '#ffeb3b' }
  ];

  // Updated slides to match Infra Standardization topics
  const workdaySlides = [
    {
      image: workdaySlide1,
      title: 'Standardized Infrastructure',
      description: 'Achieve consistency and reliability with infrastructure setup standards.'
    },
    {
      image: workdaySlide2,
      title: 'System Configuration Best Practices',
      description: 'Ensure seamless deployments through repeatable configuration patterns.'
    },
    {
      image: workdaySlide3,
      title: 'Compliance & Security Standards',
      description: "Stay aligned with industry regulations while optimizing system performance."
    }
  ];

  return (
    <TopicsLayout
      darkMode={darkMode}
      navItems={navItems}
      selectedNav={selectedNav}
      setSelectedNav={setSelectedNav}
      CarouselComponent={
        <TopicsCarousel slides={workdaySlides} carouselAriaLabel="Topics related to Infrastructure Standardization" />
      }
    >
      
    </TopicsLayout>
  );
};

export default InfraStandardization;
