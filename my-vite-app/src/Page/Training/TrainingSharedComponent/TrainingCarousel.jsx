import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, keyframes, alpha, useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

// Keyframe for fade-in-up animation
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Carousel container styles 
const CarouselContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 380,
  position: 'relative',
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(to bottom, #121e34, #0e1726)'
    : '#F5F5F5',
  borderRadius: '10px',
  // Improved mobile height adjustment
  [theme.breakpoints.down('sm')]: {
    height: 450, // Increased height for better content display
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

// Slide wrapper with fade/zoom effect and fadeInUp animation
const Slide = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$active',
})(({ $active, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  opacity: $active ? 1 : 0,
  transform: $active ? 'scale(1)' : 'translateX(10px) scale(0.9)',
  transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
  animation: $active ? `${fadeInUp} 0.8s ease-in-out` : 'none',
  zIndex: $active ? 1 : 0,
  // Improved responsive layout for small screens:
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
}));

// Image section styling (left portion)
const ImageSection = styled(Box)(({ theme }) => ({
  width: '70%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '200px', // Fixed height for the image section
    borderRadius: '12px 12px 0 0', // Rounded corners on top only
  },
}));

// Slide image covers entire image section
const SlideImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  [theme.breakpoints.down('sm')]: {
    objectPosition: 'center top', // Focus on the upper part of images on mobile
  },
}));

// Content section styling (right portion)
const ContentSection = styled(Box)(({ theme }) => ({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: theme.spacing(6),
  textAlign: 'left',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e2e4a' : '#eaeef4',
  fontFamily: 'Roboto, sans-serif',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(3),
    height: 'auto',
    backgroundColor: theme.palette.mode === 'dark' ? '#1a2742' : '#f8f9fb',
    borderRadius: '0 0 12px 12px', // Rounded corners on bottom only
  },
}));

// Navigation arrow button styles - removed background
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: theme.palette.primary.main,
  opacity: 0.8,
  zIndex: 3,
  transition: 'transform 0.3s ease, opacity 0.3s ease',
  backgroundColor: 'transparent', // Removed background
  '&:hover': {
    opacity: 1,
    transform: 'translateY(-50%) scale(1.1)',
    backgroundColor: 'transparent', // Removed background on hover
  },
  [theme.breakpoints.down('sm')]: {
    top: '100px', // Position in the middle of image section on mobile
    width: '36px',
    height: '36px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem',
      color: '#ffffff', // White color for better visibility on mobile
      filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.5))', // Shadow for better visibility
    },
  },
}));

// Improved dots container for mobile
const DotsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '20px',
  left: '20px',
  display: 'flex',
  gap: '8px',
  zIndex: 4,
  [theme.breakpoints.down('sm')]: {
    bottom: 'auto',
    top: '180px', // Position at the bottom of the image section
    left: '50%',
    transform: 'translateX(-50%)',
    gap: '10px',
  },
}));

// Enhanced individual dot
const Dot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active, theme }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: active
    ? theme.palette.primary.main
    : alpha(theme.palette.primary.main, 0.5),
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.2)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '12px',
    height: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
}));

// Improved Button styling
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0995e0',
  color: 'white',
  fontFamily: 'Bello, sans-serif',
  textTransform: 'none',
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  alignSelf: 'center',
  minWidth: 200,
  '&:hover': {
    backgroundColor: '#0782c3',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.2, 2.5),
    borderRadius: '8px',
    alignSelf: 'center', // Center button on mobile
    width: '80%', // Wider button on mobile
    marginTop: theme.spacing(3),
    boxShadow: '0 2px 8px rgba(9, 149, 224, 0.3)',
  },
}));

const TrainingCarousel = ({ slides, carouselAriaLabel }) => {
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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 3000);
    }
    return () => clearInterval(slideIntervalRef.current);
  }, [isPaused, slides.length]);

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goToPrevSlide();
    if (e.key === 'ArrowRight') goToNextSlide();
  };

  // Enhanced touch handlers for better swipe on mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    // Reduced threshold for easier swiping
    if (touchStart - touchEnd > 30) {
      // Swipe left
      goToNextSlide();
    } else if (touchStart - touchEnd < -30) {
      // Swipe right
      goToPrevSlide();
    }
    setIsPaused(false);
  };

  return (
    <CarouselContainer
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
        <Slide key={index} $active={index === currentIndex} aria-hidden={index !== currentIndex}>
          <ImageSection>
            <SlideImage src={slide.image} alt={slide.title} loading="lazy" />
          </ImageSection>
          <ContentSection>
            <Typography
              variant={isSmall ? 'h5' : 'h4'}
              color="textPrimary"
              gutterBottom
              sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 700, 
                lineHeight: 1.2,
                textAlign: isSmall ? 'center' : 'left',
                width: isSmall ? '100%' : 'auto',
                fontSize: isSmall ? '1.5rem' : undefined
              }}
            >
              {slide.title}
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 300,
                lineHeight: 1.6,
                marginTop: 1,
                color: 'text.secondary',
                textAlign: isSmall ? 'center' : 'left',
                width: isSmall ? '100%' : 'auto',
                fontSize: isSmall ? '0.95rem' : undefined
              }}
            >
              {slide.description}
            </Typography>
            <StyledButton>
              Apply Now !
            </StyledButton>
          </ContentSection>
        </Slide>
      ))}

      {/* Navigation Arrows - moved outside of ImageSection for better positioning */}
      <StyledIconButton
        onClick={goToPrevSlide}
        aria-label="Previous Slide"
        sx={{ left: isSmall ? 10 : 20 }}
      >
        <KeyboardArrowLeft fontSize={isSmall ? "medium" : "large"} />
      </StyledIconButton>
      <StyledIconButton
        onClick={goToNextSlide}
        aria-label="Next Slide"
        sx={{ right: isSmall ? 10 : 20 }}
      >
        <KeyboardArrowRight fontSize={isSmall ? "medium" : "large"} />
      </StyledIconButton>

      {/* Dots moved outside of ImageSection */}
      <DotsContainer>
        {slides.map((_, dotIndex) => (
          <Dot
            key={dotIndex}
            active={dotIndex === currentIndex}
            onClick={() => setCurrentIndex(dotIndex)}
            aria-label={`Go to slide ${dotIndex + 1}`}
          />
        ))}
      </DotsContainer>
    </CarouselContainer>
  );
};

export default TrainingCarousel;