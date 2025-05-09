// CarouselHome.jsx
import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MobileStepper from '@mui/material/MobileStepper';
import { styled } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import mainImage from '../../assets/main.jpg';
import main1Image from '../../assets/main1.webp';
import main2Image from '../../assets/main2.jpg';

const slides = [
  {
    image: mainImage,
    title: 'Welcome To IE Penang',
    description: 'Description for the first slide.'
  },
  {
    image: main1Image,
    title: 'Second Slide Title',
    description: 'Description for the second slide.'
  },
  {
    image: main2Image,
    title: 'Third Slide Title',
    description: 'Description for the third slide.'
  },
];

const CarouselContainer = styled(Box)(({ theme }) => ({
  height: "370px",
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.grey[100],
}));

// Use shouldForwardProp to filter out $active so its not passed to the DOM.
const Slide = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$active'
})(({ theme, $active }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: $active ? 1 : 0,
  transform: $active ? 'scale(1.02)' : 'translateX(10px) scale(1)',
  transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
  zIndex: $active ? 1 : 0,
}));

const SlideImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

const TextOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  bottom: '10%',
  left: '5%',
  maxWidth: '40%',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: theme.shape.borderRadius,
  animation: 'fadeInUp 1s ease-in-out',
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  zIndex: 4,
  '& .progress': {
    width: 0,
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    animation: 'slideProgress 3s linear forwards',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#fff',
  opacity: 0.7,
  zIndex: 3,
  '&:hover': {
    opacity: 1,
    transform: 'translateY(-50%) scale(1.1)',
  },
}));

const CarouselHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideIntervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);
      }, 3000);
    }
    return () => clearInterval(slideIntervalRef.current);
  }, [isPaused]);

  const goToPrevSlide = () =>
    setCurrentIndex(prevIndex => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  const goToNextSlide = () =>
    setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);

  const handleKeyDown = e => {
    if (e.key === 'ArrowLeft') goToPrevSlide();
    if (e.key === 'ArrowRight') goToNextSlide();
  };

  return (
    <CarouselContainer
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Image Carousel"
    >
      {slides.map((slide, index) => (
        <Slide
          key={index}
          $active={index === currentIndex}
          aria-hidden={index !== currentIndex}
        >
          <SlideImage src={slide.image} alt={slide.title} loading="lazy" />
          <TextOverlay>
            <Typography variant="h4" color="white" gutterBottom>
              {slide.title}
            </Typography>
            <Typography variant="body1" color="white">
              {slide.description}
            </Typography>
          </TextOverlay>
          {index === currentIndex && (
            <ProgressBar>
              <Box className="progress" />
            </ProgressBar>
          )}
        </Slide>
      ))}

      <StyledIconButton onClick={goToPrevSlide} aria-label="Previous Slide" sx={{ left: 20 }}>
        <KeyboardArrowLeft fontSize="large" />
      </StyledIconButton>
      <StyledIconButton onClick={goToNextSlide} aria-label="Next Slide" sx={{ right: 20 }}>
        <KeyboardArrowRight fontSize="large" />
      </StyledIconButton>

      <MobileStepper
        variant="dots"
        steps={slides.length}
        position="static"
        activeStep={currentIndex}
        sx={{
          position: 'absolute',
          bottom: '5%',
          width: '100%',
          background: 'transparent',
          justifyContent: 'center',
          zIndex: 3,
          '& .MuiMobileStepper-dot': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { opacity: 0.8 },
          },
          '& .MuiMobileStepper-dotActive': {
            backgroundColor: 'primary.main',
            transform: 'scale(1.4)',
          },
        }}
        nextButton={<Box />}
        backButton={<Box />}
      />
    </CarouselContainer>
  );
};

export default CarouselHome;