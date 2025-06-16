// src/Page/Topics/GenericTopics.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get topic from URL
import { useTheme } from './../../themes/ThemeContext';
import TopicsLayout from './TopicsSharedComponent/TopicsLayout';
import TopicsCarousel from './TopicsSharedComponent/TopicsCarousel';

// Mock data that will eventually come from your API/database
const TOPICS_DATA = {
  'infrastructure-standardization': {
    navItems: [
      { text: 'Network Setup', iconColor: '#4caf50' },
      { text: 'System Configurations', iconColor: '#2196f3' },
      { text: 'Automation & Tools', iconColor: '#ff9800' },
      { text: 'Compliance & Standards', iconColor: '#ffeb3b' }
    ],
    slides: [
      {
        image: '/assets/workdaySlide1.jpg',
        title: 'Standardized Infrastructure',
        description: 'Achieve consistency and reliability with infrastructure setup standards.'
      },
      {
        image: '/assets/workdaySlide2.png',
        title: 'System Configuration Best Practices',
        description: 'Ensure seamless deployments through repeatable configuration patterns.'
      },
      {
        image: '/assets/workdaySlide3.png',
        title: 'Compliance & Security Standards',
        description: 'Stay aligned with industry regulations while optimizing system performance.'
      }
    ],
    defaultNav: 'Network Setup',
    carouselAriaLabel: 'Topics related to Infrastructure Standardization'
  },
  
  'moonshine-offline-sustainment': {
    navItems: [
      { text: 'System Uptime', iconColor: '#4caf50' },
      { text: 'System Health', iconColor: '#2196f3' },
      { text: 'Backup & Recovery', iconColor: '#ff9800' },
      { text: 'System Reliability', iconColor: '#ffeb3b' }
    ],
    slides: [
      {
        image: '/assets/workdaySlide1.jpg',
        title: 'Ensuring Offline Stability',
        description: 'Learn strategies for maintaining stable performance during offline operations.'
      },
      {
        image: '/assets/workdaySlide2.png',
        title: 'Monitoring & Health Checks',
        description: 'Implement monitoring systems to ensure uptime and detect issues early.'
      },
      {
        image: '/assets/workdaySlide3.png',
        title: 'Resilience & Recovery Planning',
        description: 'Develop robust recovery plans to minimize downtime and ensure data protection.'
      }
    ],
    defaultNav: 'System Uptime',
    carouselAriaLabel: 'Topics related to Moonshine Offline Sustainment'
  },

  'productivity': {
    navItems: [
      { text: 'Insights', iconColor: '#4caf50' },
      { text: 'Time Management', iconColor: '#2196f3' },
      { text: 'Task Efficiency', iconColor: '#ff9800' },
      { text: 'Productivity Tools', iconColor: '#9c27b0' },
      { text: 'Focus Techniques', iconColor: '#f44336' },
      { text: 'Quality of Work', iconColor: '#00bcd4' },
      { text: 'Continuous Improvement', iconColor: '#ffeb3b' }
    ],
    slides: [
      {
        image: '/assets/workdaySlide1.jpg',
        title: 'Unlock Productivity Potential',
        description: 'Discover data-driven insights and strategies to transform how team works.'
      },
      {
        image: '/assets/workdaySlide2.png',
        title: 'Master Time Management',
        description: 'Learn cutting-edge techniques to reclaim calendar and focus on what matters.'
      },
      {
        image: '/assets/workdaySlide3.png',
        title: 'Efficiency Revolution',
        description: 'Implement proven systems that reduce friction and accelerate workflow.'
      }
    ],
    defaultNav: 'Insights',
    carouselAriaLabel: 'Topics related to Productivity'
  },

  'product-process': {
    navItems: [
      { text: 'Process Flow', iconColor: '#4caf50' },
      { text: 'Material Handling', iconColor: '#2196f3' },
      { text: 'Workflow Optimization', iconColor: '#ff9800' },
      { text: 'Performance Metrics', iconColor: '#ffeb3b' }
    ],
    slides: [
      {
        image: '/assets/workdaySlide1.jpg',
        title: 'Product Lifecycle Overview',
        description: 'Understand the complete product lifecycle from ideation to delivery, with best practices for each phase.'
      },
      {
        image: '/assets/workdaySlide2.png',
        title: 'Streamlined Workflows',
        description: 'Explore streamlined workflows that enhance team collaboration and boost productivity during the product process.'
      },
      {
        image: '/assets/workdaySlide3.png',
        title: 'Performance Metrics',
        description: 'Analyze performance metrics that matter—track product development efficiency and team contributions effectively.'
      }
    ],
    defaultNav: 'Process Flow',
    carouselAriaLabel: 'Topics related to Product Process'
  }
};

const GenericTopics = () => {
  const { darkMode } = useTheme();
  const { topicId } = useParams(); // Get topic from URL parameter
  const [selectedNav, setSelectedNav] = useState('');
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simulate API call - replace this with actual API call later
  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get data from mock data (replace with actual API call)
        const data = TOPICS_DATA[topicId];
        
        if (!data) {
          throw new Error(`Topic "${topicId}" not found`);
        }
        
        setTopicData(data);
        setSelectedNav(data.defaultNav);
        setError(null);
      } catch (err) {
        setError(err.message);
        setTopicData(null);
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchTopicData();
    }
  }, [topicId]);

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: darkMode ? '#fff' : '#333'
      }}>
        Loading topic data...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: darkMode ? '#ff6b6b' : '#d32f2f'
      }}>
        Error: {error}
      </div>
    );
  }

  // No data state
  if (!topicData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: darkMode ? '#fff' : '#333'
      }}>
        No data available for this topic.
      </div>
    );
  }

  return (
    <TopicsLayout
      darkMode={darkMode}
      navItems={topicData.navItems}
      selectedNav={selectedNav}
      setSelectedNav={setSelectedNav}
      CarouselComponent={
        <TopicsCarousel 
          slides={topicData.slides} 
          carouselAriaLabel={topicData.carouselAriaLabel} 
        />
      }
    >
      {/* Add custom content rendering based on selectedNav if needed */}
      {/* This is where you can add topic-specific content components */}
    </TopicsLayout>
  );
};

export default GenericTopics;