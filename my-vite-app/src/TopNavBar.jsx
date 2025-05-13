import React, { useState, useRef } from 'react';
import { usePopupState, bindHover, bindMenu, bindPopover, } from 'material-ui-popup-state/hooks';
import HoverPopover from 'material-ui-popup-state/HoverPopover'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import MenuList from '@mui/material/MenuList';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WindowIcon from '@mui/icons-material/Window';
import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import BuildIcon from '@mui/icons-material/Build';
import TopicIcon from '@mui/icons-material/Topic';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './themes/ThemeContext';

import jabilLogo from './assets/jabil2.svg';
import './Page/Css/Global.css';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const naviPage = [
    {
      parent: 'Topic',
      child: [
        { title: 'Productivity', thumbnail: '', url: '/topics/productivity' },
        { title: 'Product', thumbnail: '', url: '/topics/product' },
        { title: 'Infrastructure', thumbnail: '', url: '/topics/infrastructure' },
        { title: 'Moonshine', thumbnail: '', url: '/topics/moonshine' },
      ],
    },
    {
      parent: 'Training',
      child: [
        { title: 'Workday', thumbnail: '', url: '/training/workday' },
        { title: 'IE Webbinar', thumbnail: '', url: '/training/webbinar' },
        { title: 'e-Jabilization', thumbnail: '', url: '/training/ejabilization' },
      ],
    },
    {
      parent: 'News'
    },
    {
      parent: 'Project',
      child: [
        { title: 'List', thumbnail: '', url: '/project/list' },
        { title: 'Gantt', thumbnail: '', url: '/project/gantt' },
      ],
    },
  ];

  const isActiveLink = (path) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  const handleNavigation = (url) => {
    setTimeout(() => {
      navigate(url);
    }, 0);
  };

  return (
    <>
      {naviPage.map(({ parent, child }) => {
        const popupState = usePopupState({
          variant: 'popover',
          popupId: parent,
        });

        const hasChildren = child && child.length > 0;
        const isActive = isActiveLink(`/${parent.toLowerCase()}`);

        return (
          <React.Fragment key={parent}>
            <Button {...(hasChildren ? bindHover(popupState) : {})}
            
              onClick={() => {
                if (!hasChildren) {
                  navigate(`/${parent.toLowerCase()}`);
                }
                else {
                  navigate(`/home#${parent.toLocaleLowerCase()}`)
                }
                popupState.close();
              }}
              sx={{
                display: { xs: 'none', md: 'flex' },
                color: isActive ? '#4BAAD1' : '#FFF',
                textTransform: 'none',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {parent}
            </Button>

            {hasChildren && (
              <HoverPopover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                disableScrollLock
              >
                <MenuList>
                {child.map((item) => (
                  <MenuItem 
                  key={item.title}
                  onClick={() => {
                    popupState.close();
                    handleNavigation(item.url)
                  }}
                  >{item.title}
                  </MenuItem>
                ))}
                </MenuList>
              </HoverPopover>
            )}

          </React.Fragment>
        );
      })}
    </>
  );
}

function IconThemeToggle({ mode, onClick }) {
  let icon = mode ? <LightModeIcon /> : <DarkModeIcon />;
  let tooltipText = mode ? "Switch to Light Mode" : "Switch to Dark Mode";

  return (
    <Tooltip title={tooltipText} placement="bottom" arrow>
      <IconButton
        aria-label={tooltipText}
        onClick={onClick}
        color="inherit">
        {icon}
      </IconButton>
    </Tooltip>
  );
}

function LogoWithNavigation() {
  const navigate = useNavigate();
  
  return (
    <Box 
      onClick={() => navigate('/home')} 
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer"
      }}
    >
      <img src={jabilLogo} alt="jabil_logo" className="logo" />
    </Box>
  );
}

function AppsToggle() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'apps-menu',
  })

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (url) => {
    navigate(`/${url}`);
  };

  const appList = [
    { name: 'CPS', thumbnail: 'https://play-lh.googleusercontent.com/ZyWNGIfzUyoajtFcD7NhMksHEZh37f-MkHVGr5Yfefa-IX7yj9SMfI82Z7a2wpdKCA', url: 'topic' },
    { name: 'app2', thumbnail: null, url: 'app2' },
    { name: 'app3', thumbnail: null, url: 'app3' },
    { name: 'app3', thumbnail: null, url: 'app3' },
    { name: 'app3', thumbnail: null, url: 'app3' },
    { name: 'app3', thumbnail: null, url: 'app3' },
    { name: 'app3', thumbnail: null, url: 'app3' },
    { name: 'app3', thumbnail: null, url: 'app3' },
    { name: 'app3', thumbnail: null, url: 'app3' },
    { name: 'app3', thumbnail: null, url: 'app3' },
  ]

  const sizeDropMenu = 60 * 4.7;

  return (
    <React.Fragment>
      <Tooltip
        title="Apps"
        placement="left"
        arrow
      >
        <IconButton
          color='inherit'
          onClick={handleClick}
        >
          <AppsIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="apps-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}        
        slotProps={{
          paper: {
            elevation: 0,
            style: {
              height: sizeDropMenu,
              width: sizeDropMenu
            },
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: darkMode ? '#000' : '#fff',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },          
        }}
        disableScrollLock
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box
          sx={{
            px: 1,
            height: sizeDropMenu - 15,
            maxWidth: '90%',
          }}
        >

          <Box>
            <Stack direction='row' justifyContent={{ justifyContent: 'space-between' }}>
              <Typography variant='subtitle2'>
                Recently used
              </Typography>
              <Link href='app/all' variant='caption'>
                View all
              </Link>
            </Stack>
          </Box>

          <Box
            sx={{
              height: appList.length > 0 ? 55 * 4.4 : sizeDropMenu,
              maxHeight: 55 * 4.4,
              overflow: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: darkMode ? 'grey #121212' : '',
            }}
          >
            {appList && appList.length > 0 ?
              (
                <Grid container spacing={1}>
                  {appList.map((item, index) => (
                    <Grid key={index} size={{ xs: 4 }}>
                      <Tooltip title={item.name} arrow
                        placement={
                          index % 3 === 0
                            ? 'left'
                            : index % 3 === 2
                              ? 'right'
                              : 'top'
                        } >
                        <Card
                          className={`card ${darkMode ? 'dark-mode' : ''}`}
                          sx={{
                            height: '75px',
                            width: '75px',
                          }}
                          variant='outlined'
                        >
                          <CardActionArea
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-around',
                            }}
                            onClick={() => handleNavigation(item.url)}
                          >
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                style={{ width: '32px', height: '32px' }}
                              />
                            ) : (
                              <InsertEmoticonRoundedIcon />
                            )}
                            <CardContent sx={{ p: 0 }}>
                              <Typography variant='caption' fontWeight='500'>
                                {item.name}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <WindowIcon sx={{ fontSize: '3.5rem', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No recently used apps
                  </Typography>
                </Box>
              )}
          </Box>
        </Box>
      </Menu>
    </React.Fragment>
  )
}

function TopNavBar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items for the mobile drawer.
  const navItems = [
    { name: 'Home', icon: <HomeIcon />, path: '/home' },
    { name: 'Topic', icon: <ArticleIcon />, path: '/home', sectionId: 'topic' },
    { name: 'Training', icon: <BuildIcon />, path: '/home', sectionId: 'training' },
    { name: 'Resources', icon: <TopicIcon />, path: '/about' },
  ];

  // Improved active state detection
  const isActiveLink = (path, sectionId) => {
    // For path with section
    if (sectionId) {
      return location.pathname.toLowerCase() === path.toLowerCase() &&
        location.hash.toLowerCase() === `#${sectionId}`.toLowerCase();
    }
    // For path without section (pure path)
    return location.pathname.toLowerCase() === path.toLowerCase() &&
      (!location.hash || location.hash === '');
  };

  // Mobile drawer navigation: simply update the URL.
  const handleNavigation = (path, sectionId) => {
    setDrawerOpen(false);
    if (path === '/home' && sectionId) {
      navigate(`/home#${sectionId}`);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* AppBar Header */}
      <AppBar
        position="fixed"
        className="appBar"
        elevation={0}
        variant="dense"
      >
        <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
          <Stack direction='row'>
            <LogoWithNavigation />
            <Navigation />
          </Stack>

          <Stack direction="row" spacing={1} justifyContent={{ justifyContent: "space-between" }}>
            <AppsToggle />
            <IconThemeToggle mode={darkMode} onClick={toggleDarkMode} />
            <IconButton
              size="small"
              onClick={() => setDrawerOpen(true)}
              color="inherit"
              edge="end"
              sx={{
                display: { xs: 'flex', md: 'none' },
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '6px',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: '300px',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            backgroundColor: darkMode ? '#000f2b' : '#ffffff',
            boxShadow: '-4px 0px 16px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            backgroundColor: '#002b49',
            color: 'white',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Menu
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List sx={{ pt: 1 }}>
          {navItems.map((item) => {
            const isActive = isActiveLink(item.path, item.sectionId);
            return (
              <ListItem
                key={item.name}
                onClick={() => handleNavigation(item.path, item.sectionId)}
                sx={{
                  backgroundColor: isActive ? 'rgba(73, 172, 209, 0.1)' : 'transparent',
                  borderLeft: isActive ? '4px solid #4BAAD1' : '4px solid transparent',
                  mb: 0.5,
                  borderRadius: '0 8px 8px 0',
                  transition: 'all 0.2s ease',
                }}
                button
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#4BAAD1' : darkMode ? 'white' : '#555',
                    minWidth: '40px',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#4BAAD1' : darkMode ? 'white' : '#333',
                    },
                  }}
                />
              </ListItem>
            );
          })}
        </List>

        {/* Improved footer with padding for the up arrow button */}
        <Box sx={{ mt: 'auto', p: 2, pb: 7, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#aaa' : '#777' }}>
            © Jabil Penang IE Department - 2025
          </Typography>
        </Box>
      </Drawer>

      {/* Offset for the fixed AppBar */}
      {/* <Toolbar variant="dense" sx={{ minHeight: 50 }} /> */}
    </>
  );
}

export default TopNavBar;