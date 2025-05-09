import React, { useState, useEffect, useCallback } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TimerIcon from '@mui/icons-material/Timer';
import PerformanceIcon from '@mui/icons-material/TrendingUp';

import { useTheme } from '../../../context_themes/ThemeContext';
import TrainingLayout from '../TrainingSharedComponent/TrainingLayout';
import TrainingCarousel from '../TrainingSharedComponent/TrainingCarousel';


const API_URL = "http://localhost:5001/api/training-carousel";
// Poll for updates every 10 seconds
const POLLING_INTERVAL = 30000;

const Workday = () => {
  const { darkMode } = useTheme();
  const [selectedNav, setSelectedNav] = useState('Dashboard');
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date().getTime());

  // Nav items with iconColor property
  const navItems = [
    { icon: <DashboardIcon />, text: 'Dashboard', iconColor: '#4caf50' },
    { icon: <ScheduleIcon />, text: 'Work Schedules', iconColor: '#2196f3' },
    { icon: <TimerIcon />, text: 'Time Tracking', iconColor: '#ff9800' },
    { icon: <PerformanceIcon />, text: 'Performance', iconColor: '#ffeb3b' }
  ];

  // Fetch carousel items - extracting to a reusable function
  const fetchCarouselItems = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }
    
    try {
      const response = await fetch(`${API_URL}?type=WORKDAY&timestamp=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch carousel items');
      }
      
      const data = await response.json();
      
      // Transform the data to match the expected format for the carousel
      const formattedItems = data.map(item => ({
        image: `http://localhost:5001/uploads/${item.image}`,
        title: item.title,
        description: item.subTitle // API returns subTitle, carousel expects description
      }));
      
      setCarouselItems(formattedItems);
      setLastUpdate(new Date().getTime());
    } catch (error) {
      console.error('Error fetching carousel items:', error);
      // Only set fallback slides on initial load
      if (isInitialLoad && carouselItems.length === 0) {
        setCarouselItems(getDefaultWorkdaySlides());
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [carouselItems.length]);

  // Initial load
  useEffect(() => {
    fetchCarouselItems(true);
    window.scrollTo(0, 0);
  }, [fetchCarouselItems]);

  // Set up polling for updates
  useEffect(() => {
    // Don't start polling until initial load is complete
    if (loading) return;
    
    const pollInterval = setInterval(() => {
      fetchCarouselItems(false);
    }, POLLING_INTERVAL);
    
    // Clean up interval on component unmount
    return () => clearInterval(pollInterval);
  }, [fetchCarouselItems, loading]);

  // Default slides as fallback if API fails
  const getDefaultWorkdaySlides = () => [
    {
      image: require('../../../assets/workdaySlide1.jpg'),
      title: 'WorkDay Training',
      description: 'WorkDay is designed to systematically manage the learning requirement baseline, certification management, competency, and skill management.'
    },
    {
      image: require('../../../assets/workdaySlide2.png'),
      title: 'Comprehensive Learning Management',
      description: 'Streamline  professional development with our advanced training and certification tracking system.'
    },
    {
      image: require('../../../assets/workdaySlide3.png'),
      title: 'Skill Development Insights',
      description: "Gain deep insights into  team's skills, competencies, and growth opportunities."
    }
  ];

  return (
    <TrainingLayout
      darkMode={darkMode}
      navItems={navItems}
      selectedNav={selectedNav}
      setSelectedNav={setSelectedNav}
      CarouselComponent={
        loading ? (
          <div>Loading carousel...</div>
        ) : (
          <TrainingCarousel 
            slides={carouselItems.length > 0 ? carouselItems : getDefaultWorkdaySlides()} 
            carouselAriaLabel="WorkDay Training Carousel" 
            key={lastUpdate} // Force re-render when data updates
          />
        )
      }
    >
      {/* Optionally, add additional Workday-specific content here */}
    </TrainingLayout>
  );
};

export default Workday;