// src/Page/Training/e‑Jabilization/EJabilization.jsx
import React, { useState, useEffect, useCallback } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TimerIcon from '@mui/icons-material/Timer';
import PerformanceIcon from '@mui/icons-material/TrendingUp';

import { useTheme } from '../../../context_themes/ThemeContext';
import TrainingLayout from '../TrainingSharedComponent/TrainingLayout';
import TrainingCarousel from '../TrainingSharedComponent/TrainingCarousel';

// Local images used *only* as a fallback
import ejabSlide1 from '../../../assets/workdaySlide1.jpg';
import ejabSlide2 from '../../../assets/workdaySlide2.png';
import ejabSlide3 from '../../../assets/workdaySlide3.png';

/* --- CONFIG ---------------------------------------------------------------- */

const API_URL         = 'http://localhost:5001/api/training-carousel';
const POLLING_INTERVAL = 30_000; // 30 s

/* --------------------------------------------------------------------------- */

const EJabilization = () => {
  const { darkMode } = useTheme();

  /* ---------- state ---------- */
  const [selectedNav,   setSelectedNav]  = useState('Dashboard');
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [lastUpdate,    setLastUpdate]   = useState(Date.now());

  /* ---------- navbar ---------- */
  const navItems = [
    { icon: <DashboardIcon />,  text: 'Dashboard',      iconColor: '#4caf50' },
    { icon: <ScheduleIcon />,   text: 'Work Schedules', iconColor: '#2196f3' },
    { icon: <TimerIcon />,      text: 'Time Tracking',  iconColor: '#ff9800' },
    { icon: <PerformanceIcon />,text: 'Performance',    iconColor: '#ffeb3b' }
  ];

  /* ---------- helper ---------- */
  const fetchCarouselItems = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);

    try {
      // The query‑string "type=EJabilization" lets the server return only
      // the slides that belong to this training module.
      const res = await fetch(
        `${API_URL}?type=EJabilization&timestamp=${Date.now()}`
      );
      if (!res.ok) throw new Error('Failed to fetch carousel items');

      const raw = await res.json();
      const formatted = raw.map(item => ({
        image: `http://localhost:5001/uploads/${item.image}`,
        title: item.title,
        description: item.subTitle
      }));

      setCarouselItems(formatted);
      setLastUpdate(Date.now());
    } catch (err) {
      console.error(err);

      // Only on the very first load do  fall back to local images
      if (isInitialLoad && carouselItems.length === 0) {
        setCarouselItems(getDefaultSlides());
      }
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, [carouselItems.length]);

  /* ---------- effects ---------- */
  // first render
  useEffect(() => {
    fetchCarouselItems(true);
    window.scrollTo(0, 0);
  }, [fetchCarouselItems]);

  // polling every 30 s
  useEffect(() => {
    if (loading) return; // wait until the first load finishes
    const id = setInterval(() => fetchCarouselItems(false), POLLING_INTERVAL);
    return () => clearInterval(id);
  }, [fetchCarouselItems, loading]);

  /* ---------- fallback slides ---------- */
  const getDefaultSlides = () => ([
    {
      image: ejabSlide1,
      title: 'E‑Jabilization Training',
      description:
        'E‑Jabilization is designed to systematically manage baseline learning requirements, certification management, competency, and skill tracking.'
    },
    {
      image: ejabSlide2,
      title: 'Comprehensive Learning Management',
      description:
        'Streamline professional development with our training and certification tracking system.'
    },
    {
      image: ejabSlide3,
      title: 'Skill Development Insights',
      description:
        'Gain deep insights into  teams skills, competencies, and growth opportunities.'
    }
  ]);

  /* ---------- render ---------- */
  return (
    <TrainingLayout
      darkMode={darkMode}
      navItems={navItems}
      selectedNav={selectedNav}
      setSelectedNav={setSelectedNav}
      CarouselComponent={
        loading ? (
          <div>Loading carousel…</div>
        ) : (
          <TrainingCarousel
            slides={carouselItems.length ? carouselItems : getDefaultSlides()}
            carouselAriaLabel="E‑Jabilization Training Carousel"
            key={lastUpdate}          // force rerender when data changes
          />
        )
      }
    >
      {/* Add any extra E‑Jabilization content here */}
    </TrainingLayout>
  );
};

export default EJabilization;
