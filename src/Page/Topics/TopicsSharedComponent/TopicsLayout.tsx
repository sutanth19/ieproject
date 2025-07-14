import React, { useState, useEffect, useRef, ReactNode, ReactElement } from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import './../../Css/Global.css';

// Type definitions
interface NavItem {
  text: string;
  icon: ReactElement;
  iconColor?: string;
}

interface TopicsLayoutProps {
  darkMode: boolean;
  navItems: NavItem[];
  selectedNav: string;
  setSelectedNav: (nav: string) => void;
  CarouselComponent: ReactNode;
  children?: ReactNode;
}

const TopicsLayout: React.FC<TopicsLayoutProps> = ({
  darkMode,
  navItems,
  selectedNav,
  setSelectedNav,
  CarouselComponent,
  children,
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile: boolean = windowWidth < 768;
  const selectedIndex: number = navItems.findIndex((item) => item.text === selectedNav);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setSelectedNav(navItems[newValue].text);
  };

  useEffect(() => {
    if (scrollContainerRef.current && isMobile && selectedIndex >= 0) {
      const container = scrollContainerRef.current;
      const tabElements = container.querySelectorAll(".MuiTab-root") as NodeListOf<HTMLElement>;

      if (tabElements[selectedIndex]) {
        const tabElement = tabElements[selectedIndex];
        const tabLeftOffset = tabElement.offsetLeft;
        const tabWidth = tabElement.offsetWidth;
        const containerWidth = container.offsetWidth;

        const scrollPosition = tabLeftOffset + tabWidth / 2 - containerWidth / 2;
        container.scrollTo({ left: scrollPosition, behavior: "smooth" });
      }
    }
  }, [selectedIndex, isMobile]);

  return (
    <div className={`training-section ${darkMode ? 'dark-mode' : ''}`}>
      <Container maxWidth="xl"> 
        <Grid container direction="column" className="topics-grid-container">
          <Grid {...({item: true} as any)} className="carousel-section" style={{ marginBottom: '16px' }}>
            {CarouselComponent}
          </Grid>

          {isMobile && (
            <Box
              ref={scrollContainerRef}
              className={`mobile-tabs-container mobile-tabs-scrollable ${darkMode ? 'dark-mode' : ''}`}
            >
              <Tabs
                value={selectedIndex >= 0 ? selectedIndex : 0}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons={false}
                aria-label="navigation tabs"
                className="topics-tabs"
                style={{ minHeight: "48px" }}
              >
                {navItems.map((item, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <Tab
                      key={item.text}
                      label={
                        <Box className={`tab-label ${darkMode ? 'dark-mode' : ''} ${isSelected ? 'selected' : ''}`}>
                          <Box className="tab-icon">
                            {React.cloneElement(item.icon, {
                              style: {
                                color: isSelected
                                  ? "#3B82F6"
                                  : item.iconColor || (darkMode ? "#fff" : "#333"),
                              },
                            } as any)}
                          </Box>
                          {item.text}
                        </Box>
                      }
                      className={`topic-tab ${darkMode ? 'dark-mode' : ''} ${isSelected ? 'selected' : ''}`}
                    />
                  );
                })}
              </Tabs>
            </Box>
          )}

          <Grid
            container
            spacing={2}
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: isMobile ? "wrap" : "nowrap",
              marginTop: 0,
            }}
          >
            {!isMobile && (
              <Grid {...({item: true} as any)} className={`left-sidebar ${darkMode ? 'dark-mode' : ''}`}>
                <Typography variant="h6" className={`sidebar-title ${darkMode ? 'dark-mode' : ''}`}>
                  Navigation
                </Typography>
                <List>
                  {navItems.map((item) => {
                    const isSelected = selectedNav === item.text;
                    return (
                      <ListItem
                        key={item.text}
                        {...({button: true} as any)}
                        onClick={() => setSelectedNav(item.text)}
                        className={`nav-item ${darkMode ? 'dark-mode' : ''} ${isSelected ? 'selected' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <ListItemIcon
                          className={`nav-item-icon ${darkMode ? 'dark-mode' : ''} ${isSelected ? 'selected' : ''}`}
                        >
                          {React.cloneElement(item.icon, {
                            style: {
                              color: isSelected
                                ? "#3B82F6"
                                : item.iconColor || (darkMode ? "#fff" : "#333"),
                            },
                          } as any)}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            )}

            <Grid {...({item: true} as any)} className={`main-content ${darkMode ? 'dark-mode' : ''}`}>
              {!isMobile && (
                <Typography variant="h6" className={`content-title ${darkMode ? 'dark-mode' : ''}`}>
                  {selectedNav}
                </Typography>
              )}
              {children ? (
                children
              ) : (
                <Typography
                  align="center"
                  className={`empty-content ${darkMode ? 'dark-mode' : ''}`}
                >
                  Content for {selectedNav} will be displayed here
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default TopicsLayout;