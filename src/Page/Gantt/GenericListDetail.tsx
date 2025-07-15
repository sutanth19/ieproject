import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../themes/ThemeContext';
import TopicsLayout from '../Topics/TopicsSharedComponent/TopicsLayout';
import TopicsCarousel from '../Topics/TopicsSharedComponent/TopicsCarousel';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface NavItem {
  text: string;
  icon: React.ReactElement<SvgIconProps>;
}

interface SlideItem {
  image: string;
  title: string;
  description: string;
}

interface ProjectDetailData {
  navItems: NavItem[];
  slides: SlideItem[];
  defaultNav: string;
  carouselAriaLabel: string;
}

interface ProjectData {
  title: string;
  owner: string;
  startDate: string;
  description: string;
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

const GenetalListDetails: React.FC = () => {
  const { darkMode } = useTheme();
  const { projectName } = useParams<{ projectName: string }>();
  const [selectedNav, setSelectedNav] = useState<string>('');
  const [projectDetailData, setProjectDetailData] = useState<ProjectDetailData | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async (): Promise<void> => {
      if (!projectName) return;
      
      try {
        // Decode the URL-encoded project name
        const decodedProjectName = decodeURIComponent(projectName);
        
        // First fetch all projects to find the one with matching name
        const response = await fetch("http://mypenm0iesvr02/ieportal-api/api/project");
        const data = await response.json();
        const projects = Array.isArray(data.digitalProject) ? data.digitalProject : [];
        
        // Find the project with matching name
        const project = projects.find((p: any) => p.text === decodedProjectName);
        
        if (!project) {
          console.error("Project not found");
          setProjectData(null);
          setProjectDetailData(null);
          return;
        }
        
        // Set the project data
        setProjectData({
          title: project.text || 'Unknown Project',
          owner: project.owner || 'Unknown Owner',
          startDate: project.startDatetime || '',
          description: project.description || 'No description available'
        });

        // Create dynamic navigation and slides based on project data
        const detailData: ProjectDetailData = {
          navItems: [
            { text: 'Overview', icon: <PlaceholderIcon /> },
            { text: 'Timeline', icon: <PlaceholderIcon /> },
            { text: 'Tasks', icon: <PlaceholderIcon /> },
            { text: 'Resources', icon: <PlaceholderIcon /> },
            { text: 'Progress', icon: <PlaceholderIcon /> },
            { text: 'Documentation', icon: <PlaceholderIcon /> }
          ],
          slides: [
            {
              image: '/assets/workdaySlide1.jpg',
              title: `${project.text || 'Project'} Overview`,
              description: `Comprehensive overview of ${project.text || 'this project'} including key objectives, milestones, and deliverables.`
            },
            {
              image: '/assets/workdaySlide2.png',
              title: 'Project Timeline & Milestones',
              description: `Track the progress and key milestones of ${project.text || 'this project'} from start to completion.`
            },
            {
              image: '/assets/workdaySlide3.png',
              title: 'Team Collaboration & Resources',
              description: `Explore team collaboration tools, resource allocation, and documentation for ${project.text || 'this project'}.`
            }
          ],
          defaultNav: 'Overview',
          carouselAriaLabel: `Project details for ${project.text || 'selected project'}`
        };

        setProjectDetailData(detailData);
        setSelectedNav(detailData.defaultNav);

      } catch (error) {
        console.error("Failed to fetch project details:", error);
        setProjectData(null);
        setProjectDetailData(null);
      }
    };

    fetchProjectDetails();
  }, [projectName]);

  if (!projectDetailData || !projectData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: darkMode ? '#fff' : '#333'
      }}>
        {projectName ? 'Loading project details...' : 'No project data available.'}
      </div>
    );
  }

  return (
    <TopicsLayout
      darkMode={darkMode}
      navItems={projectDetailData.navItems}
      selectedNav={selectedNav}
      setSelectedNav={setSelectedNav}
      CarouselComponent={
        <TopicsCarousel 
          slides={projectDetailData.slides} 
          carouselAriaLabel={projectDetailData.carouselAriaLabel}
          isDarkMode={darkMode}
        />
      }
    />
  );
};

export default GenetalListDetails;