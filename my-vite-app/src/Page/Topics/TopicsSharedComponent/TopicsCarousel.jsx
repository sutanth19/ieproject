// src/Page/Topics/TopicsSharedComponent/TopicsCarousel.jsx

import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import './../../Css/Global.css';

const TopicsCarousel = ({ slides, carouselAriaLabel, isDarkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideIntervalRef = useRef(null);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!isPaused) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 3000);
    }
    return () => clearInterval(slideIntervalRef.current);
  }, [isPaused, slides.length]);

  const goToPrevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goToPrevSlide();
    if (e.key === 'ArrowRight') goToNextSlide();
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 30) goToNextSlide();
    else if (touchStart - touchEnd < -30) goToPrevSlide();
    setIsPaused(false);
  };

  return (
    <Box
      className={`carousel-container ${isDarkMode ? 'dark-mode' : ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={carouselAriaLabel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <Box
          key={index}
          className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          aria-hidden={index !== currentIndex}
        >
          {/* Left Image */}
          <Box className="carousel-image-section">
            <img
              className="carousel-slide-image"
              src={slide.image}
              alt={slide.title}
              loading="lazy"
            />
          </Box>

          {/* Right Content */}
          <Box className={`carousel-content-section ${isDarkMode ? 'dark-mode' : ''}`}>
            <Typography
              variant={isSmall ? 'h5' : 'h4'}
              gutterBottom
              className={`carousel-title ${isDarkMode ? 'dark-mode' : ''}`}
            >
              {slide.title}
            </Typography>
            <Typography
              variant="body1"
              paragraph
              className={`carousel-description ${isDarkMode ? 'dark-mode' : ''}`}
            >
              {slide.description}
            </Typography>
            <Button className="carousel-button">Apply Now !</Button>
          </Box>
        </Box>
      ))}

      {/* Arrows */}
      <IconButton
        onClick={goToPrevSlide}
        aria-label="Previous Slide"
        className="carousel-arrow carousel-arrow-left"
      >
        <KeyboardArrowLeft fontSize={isSmall ? 'medium' : 'large'} />
      </IconButton>
      <IconButton
        onClick={goToNextSlide}
        aria-label="Next Slide"
        className="carousel-arrow carousel-arrow-right"
      >
        <KeyboardArrowRight fontSize={isSmall ? 'medium' : 'large'} />
      </IconButton>

      {/* Dots */}
      <Box className="carousel-dots-container">
        {slides.map((_, dotIndex) => (
          <Box
            key={dotIndex}
            className={`carousel-dot ${dotIndex === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(dotIndex)}
            aria-label={`Go to slide ${dotIndex + 1}`}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TopicsCarousel;