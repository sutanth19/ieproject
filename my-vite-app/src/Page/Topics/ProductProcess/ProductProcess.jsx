// src/Page/Topics/ProductProcess/ProductProcess.jsx

import React, { useState, useEffect } from 'react';
import {
  PrecisionManufacturing as ProcessIcon,
  Inventory as InventoryIcon,
  Assessment as MetricsIcon,
  Task as TaskFlowIcon
} from '@mui/icons-material';
import { useTheme } from '../../../context_themes/ThemeContext';
import TopicsLayout from '../TopicsSharedComponent/TopicsLayout';
import TopicsCarousel from '../TopicsSharedComponent/TopicsCarousel';

// Import images 
import workdaySlide1 from '../../../assets/workdaySlide1.jpg';
import workdaySlide2 from '../../../assets/workdaySlide2.png';
import workdaySlide3 from '../../../assets/workdaySlide3.png';

const ProductProcess = () => {
  const { darkMode } = useTheme();
  const [selectedNav, setSelectedNav] = useState('Process Flow');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Updated nav items to reflect Product Process topics
  const navItems = [
    { icon: <ProcessIcon />, text: 'Process Flow', iconColor: '#4caf50' },
    { icon: <InventoryIcon />, text: 'Material Handling', iconColor: '#2196f3' },
    { icon: <TaskFlowIcon />, text: 'Workflow Optimization', iconColor: '#ff9800' },
    { icon: <MetricsIcon />, text: 'Performance Metrics', iconColor: '#ffeb3b' }
  ];

  const workdaySlides = [
    {
      image: workdaySlide1,
      title: 'Product Lifecycle Overview',
      description: 'Understand the complete product lifecycle from ideation to delivery, with best practices for each phase.'
    },
    {
      image: workdaySlide2,
      title: 'Streamlined Workflows',
      description: 'Explore streamlined workflows that enhance team collaboration and boost productivity during the product process.'
    },
    {
      image: workdaySlide3,
      title: 'Performance Metrics',
      description: "Analyze performance metrics that matter—track product development efficiency and team contributions effectively."
    }
  ];

  return (
    <TopicsLayout
      darkMode={darkMode}
      navItems={navItems}
      selectedNav={selectedNav}
      setSelectedNav={setSelectedNav}
      CarouselComponent={
        <TopicsCarousel slides={workdaySlides} carouselAriaLabel="Topics related to Product Process" />
      }
    >
 
    </TopicsLayout>
  );
};

export default ProductProcess;
