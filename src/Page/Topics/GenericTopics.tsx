import React, { useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../themes/ThemeContext';
import TopicsLayout from './TopicsSharedComponent/TopicsLayout';
import TopicsCarousel from './TopicsSharedComponent/TopicsCarousel';
import { SvgIconProps } from '@mui/material';

interface NavItem {
  text: string;
  icon: React.ReactElement<SvgIconProps>;
}

interface SlideItem {
  image: string;
  title: string;
  description: string;
}

interface TopicData {
  navItems: NavItem[];
  slides: SlideItem[];
  defaultNav: string;
  carouselAriaLabel: string;
}

const PlaceholderIcon: React.FC = () => (
  <div
    style={{
      width: 24,
      height: 24,
      backgroundColor: 'currentColor',
      borderRadius: '50%'
    }}
  />
);

const TOPICS_DATA: Record<string, TopicData> = {
  'infrastructure': {
    navItems: [
      { text: 'Network Setup', icon: <PlaceholderIcon /> },
      { text: 'System Configurations', icon: <PlaceholderIcon /> },
      { text: 'Automation & Tools', icon: <PlaceholderIcon /> },
      { text: 'Compliance & Standards', icon: <PlaceholderIcon /> }
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
  'moonshine': {
    navItems: [
      { text: 'System Uptime', icon: <PlaceholderIcon /> },
      { text: 'System Health', icon: <PlaceholderIcon /> },
      { text: 'Backup & Recovery', icon: <PlaceholderIcon /> },
      { text: 'System Reliability', icon: <PlaceholderIcon /> }
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
      { text: 'Insights', icon: <PlaceholderIcon /> },
      { text: 'Time Management', icon: <PlaceholderIcon /> },
      { text: 'Task Efficiency', icon: <PlaceholderIcon /> },
      { text: 'Productivity Tools', icon: <PlaceholderIcon /> },
      { text: 'Focus Techniques', icon: <PlaceholderIcon /> },
      { text: 'Quality of Work', icon: <PlaceholderIcon /> },
      { text: 'Continuous Improvement', icon: <PlaceholderIcon /> }
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
  'product': {
    navItems: [
      { text: 'Process Flow', icon: <PlaceholderIcon /> },
      { text: 'Material Handling', icon: <PlaceholderIcon /> },
      { text: 'Workflow Optimization', icon: <PlaceholderIcon /> },
      { text: 'Performance Metrics', icon: <PlaceholderIcon /> }
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

const GenericTopics: React.FC = () => {
  const { darkMode } = useTheme();
  const { topicId } = useParams<{ topicId: string }>();
  const [selectedNav, setSelectedNav] = useState<string>('');
  const [topicData, setTopicData] = useState<TopicData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (topicId) {
      const data = TOPICS_DATA[topicId];
      if (data) {
        setTopicData(data);
        setSelectedNav(data.defaultNav);
      } else {
        setTopicData(null);
      }
    }
  }, [topicId]);

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
          isDarkMode={darkMode}
        />
      }
    />
  );
};

export default GenericTopics;
