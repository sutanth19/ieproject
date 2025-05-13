// src/Page/Home/Home.jsx
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useTheme } from './../../themes/ThemeContext';
import { useLocation } from 'react-router-dom';
import CarouselHome from './CarouselHome';
import Topic from './Topic';
import Training from './Training';
import Introduction from './Introduction';
import Iedb from './Iedb';
import News from './News';
import './../Css/Global.css'; 

const sections = [
  { id: 'carousel', component: <CarouselHome /> },
  { id: 'introduction', component: <Introduction /> },
  { id: 'topic', component: <Topic /> },
  { id: 'training', component: <Training /> },
  { id: 'iedb', component: <Iedb /> },
  { id: 'news', component: <News /> },
];

const Home = () => {
  const { darkMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
      <Box className={`home-container ${darkMode ? 'dark-mode' : ''}`} sx={{ marginTop: '48px' }}>
        {sections.map(({ id, component }) => (
          <section key={id} id={id} className={darkMode ? 'dark-mode' : ''}>
            <Container maxWidth={id === "carousel" ? "xl" : "lg"}>
              {component}
            </Container>
          </section>
        ))}
      </Box>
  );
};

export default Home;