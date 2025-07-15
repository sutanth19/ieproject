import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';

// Icons
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Type definitions
interface TrainingSubmenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

interface TrainingsCollapsibleNavbarProps {
  darkMode: boolean;
  isDrawerCollapsed: boolean;
  isActiveLink: (path: string) => boolean;
  setSelectedItem: (path: string) => void;
}

// Highlight color constants
const highlightColor: string = '#4BAAD1';
const highlightBgLight: string = 'rgba(75,170,209,0.15)';
const highlightBgDark: string = 'rgba(75,170,209,0.2)';

const TrainingsCollapsibleNavbar: React.FC<TrainingsCollapsibleNavbarProps> = ({
  darkMode,
  isDrawerCollapsed,
  isActiveLink,
  setSelectedItem
}) => {
  const navigate = useNavigate();
  const [openTrainings, setOpenTrainings] = useState<boolean>(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const trainingsButtonRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  
  // Define trainings submenu items
  const trainingsSubmenu: TrainingSubmenuItem[] = [
    { 
      text: 'Workday', 
      icon: <WorkIcon fontSize="small" />, 
      path: '/admin/trainings/workday',
    },
    { 
      text: 'TCCS', 
      icon: <SchoolIcon fontSize="small" />, 
      path: '/admin/trainings/tccs',
    },
    { 
      text: 'Webinar', 
      icon: <PlayCircleFilledIcon fontSize="small" />, 
      path: '/admin/trainings/webinar',
    },
    { 
      text: 'e-Jabilization', 
      icon: <CheckCircleIcon fontSize="small" />, 
      path: '/admin/trainings/ejabilization',
    }
  ];
  
  const handleTrainingsClick = (): void => {
    if (isDrawerCollapsed) {
      setOpenPopup(!openPopup);
    } else {
      setOpenTrainings(!openTrainings);
    }
  };

  // Function for expanded menu clicks to update state and navigate
  const handleSubItemClick = (path: string): void => {
    setSelectedItem(path);
    navigate(path);
  };

  // Function for popup item clicks
  const handlePopupItemClick = (path: string): void => {
    setSelectedItem(path);
    setOpenPopup(false);
    navigate(path);
  };

  const handleClickAway = (): void => {
    setOpenPopup(false);
  };

  const handleMouseEnter = (): void => {
    if (isDrawerCollapsed) {
      setOpenPopup(true);
    }
  };
  
  const handleMouseLeave = (): void => {
    if (isDrawerCollapsed) {
      // Small delay to allow mouse to move to the popup if that's where its going
      setTimeout(() => {
        // Check if mouse is over the popper before closing
        if (!isMouseOverPopper()) {
          setOpenPopup(false);
        }
      }, 100);
    }
  };

  const handlePopperMouseEnter = (): void => {
    // Keep popup open when mouse is over the popper
    if (isDrawerCollapsed) {
      setOpenPopup(true);
    }
  };

  const handlePopperMouseLeave = (): void => {
    // Close popup when mouse leaves the popper
    if (isDrawerCollapsed) {
      setOpenPopup(false);
    }
  };

  // Helper function to check if mouse is over the popper
  const isMouseOverPopper = (): boolean => {
    if (!popperRef.current) return false;
    
    const popperElement = popperRef.current;
    const rect = popperElement.getBoundingClientRect();
    const x = (event as MouseEvent).clientX;
    const y = (event as MouseEvent).clientY;
    
    return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  };
  
  return (
    <React.Fragment>
      <ListItem disablePadding sx={{ 
        display: 'block',
        mb: 0.8,
      }}>
        <ListItemButton 
          ref={trainingsButtonRef}
          onClick={handleTrainingsClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{ 
            minHeight: 48, 
            px: isDrawerCollapsed ? 2 : 2.5,
            py: 1.2,
            justifyContent: isDrawerCollapsed ? 'center' : 'flex-start',
            borderRadius: '12px',
            position: 'relative',
            backgroundColor: 'transparent',
            '&:hover': {
              background: darkMode 
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.03)',
              transform: 'translateX(2px)'
            },
            transition: 'all 0.2s ease !important'
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: isDrawerCollapsed ? 0 : 40, 
              mr: isDrawerCollapsed ? 0 : 2,
              justifyContent: 'center',
              color: (isDrawerCollapsed && openPopup)
                ? highlightColor
                : darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            }}
          >
            <LibraryBooksIcon sx={{ transition: 'color 0.2s ease' }} />
          </ListItemIcon>
          
          {!isDrawerCollapsed && (
            <>
              <ListItemText 
                primary="Trainings" 
                primaryTypographyProps={{
                  sx: { 
                    fontWeight: 500, 
                    color: darkMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
                    whiteSpace: 'nowrap',
                    fontSize: '0.9rem',
                    transition: 'color 0.3s ease'
                  }
                }}
              />
              
              <Box sx={{ 
                color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                ml: 1
              }}>
                {openTrainings ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
              </Box>
            </>
          )}
        </ListItemButton>
      </ListItem>
      
      {/* Submenu Items for expanded drawer */}
      <Collapse in={!isDrawerCollapsed && openTrainings} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {trainingsSubmenu.map((subItem: TrainingSubmenuItem) => {
            const isSubItemActive: boolean = isActiveLink(subItem.path);
            return (
              <ListItem key={subItem.text} disablePadding sx={{
                display: 'block',
                ml: 2,
                mb: 0.5,
              }}>
                <ListItemButton
                  onClick={() => handleSubItemClick(subItem.path)}
                  sx={{
                    minHeight: 40,
                    px: 2,
                    py: 0.8,
                    borderRadius: '8px',
                    background: isSubItemActive
                      ? darkMode
                        ? highlightBgDark
                        : highlightBgLight
                      : 'transparent',
                    '&:hover': {
                      background: isSubItemActive
                        ? darkMode
                          ? 'linear-gradient(90deg, rgba(75,170,209,0.2) 0%, rgba(75,170,209,0.1) 100%)'
                          : 'linear-gradient(90deg, rgba(75,170,209,0.15) 0%, rgba(75,170,209,0.07) 100%)'
                        : darkMode
                          ? 'rgba(255,255,255,0.03)'
                          : 'rgba(0,0,0,0.02)',
                    },
                    '&::before': isSubItemActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '35%',
                      height: '30%',
                      width: '3px',
                      borderRadius: '0 3px 3px 0',
                      backgroundColor: highlightColor,
                      opacity: 0.7,
                    } : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 30,
                      mr: 1.5,
                      color: isSubItemActive ? highlightColor : darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                    }}
                  >
                    {subItem.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={subItem.text}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: isSubItemActive ? 500 : 400,
                        fontSize: '0.85rem',
                        color: isSubItemActive ? highlightColor : darkMode ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>

      {/* Popup for collapsed drawer */}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          open={isDrawerCollapsed && openPopup}
          anchorEl={trainingsButtonRef.current}
          placement="right-start"
          transition
          sx={{ 
            zIndex: 1400, 
            ml: 1,
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto'
          }}
          modifiers={[
            {
              name: 'preventOverflow',
              options: {
                boundary: document.body,
              },
            },
            {
              name: 'offset',
              options: {
                offset: [0, 5],
              },
            },
          ]}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: 'left top' }}
            >
              <Paper
                ref={popperRef}
                elevation={5}
                onMouseEnter={handlePopperMouseEnter}
                onMouseLeave={handlePopperMouseLeave}
                sx={{
                  width: 220,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: darkMode ? '#001642' : '#f5f8fc',
                  border: '1px solid',
                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                }}
              >
                <Box sx={{ 
                  py: 1.5, 
                  px: 2,
                  borderBottom: '1px solid',
                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: 'transparent'
                }}>
                  <LibraryBooksIcon fontSize="small" sx={{ color: highlightColor }} />
                  Trainings
                </Box>
                <List sx={{ p: 1 }}>
                  {trainingsSubmenu.map((subItem: TrainingSubmenuItem) => {
                    const isSubItemActive: boolean = isActiveLink(subItem.path);
                    return (
                      <ListItem key={subItem.text} disablePadding>
                        <ListItemButton
                          onClick={() => handlePopupItemClick(subItem.path)}
                          sx={{
                            borderRadius: '8px',
                            py: 0.8,
                            background: isSubItemActive
                              ? darkMode
                                ? highlightBgDark
                                : highlightBgLight
                              : 'transparent',
                            '&:hover': {
                              background: isSubItemActive
                                ? darkMode
                                  ? 'linear-gradient(90deg, rgba(75,170,209,0.2) 0%, rgba(75,170,209,0.1) 100%)'
                                  : 'linear-gradient(90deg, rgba(75,170,209,0.15) 0%, rgba(75,170,209,0.07) 100%)'
                                : darkMode
                                  ? 'rgba(255,255,255,0.05)'
                                  : 'rgba(0,0,0,0.03)',
                            },
                            '&::before': isSubItemActive ? {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: '35%',
                              height: '30%',
                              width: '3px',
                              borderRadius: '0 3px 3px 0',
                              backgroundColor: highlightColor,
                              opacity: 0.7,
                            } : {},
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 35,
                              color: isSubItemActive ? highlightColor : darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.text}
                            primaryTypographyProps={{
                              sx: {
                                fontWeight: isSubItemActive ? 500 : 400,
                                fontSize: '0.85rem',
                                color: isSubItemActive ? highlightColor : darkMode ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
                              }
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Grow>
          )}
        </Popper>
      </ClickAwayListener>
    </React.Fragment>
  );
};

export default TrainingsCollapsibleNavbar;