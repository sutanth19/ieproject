import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom'; 
import AnnouncementIcon from '@mui/icons-material/Announcement';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CampaignIcon from '@mui/icons-material/Campaign';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useTheme } from '../../context_themes/ThemeContext';

const announcements = [
  {
    icon: <AnnouncementIcon sx={{ fontSize: 28, color: '#4caf50' }} />,
    title: 'Latest Updates',
    description: 'Stay informed with the latest announcements and updates from Jabil Penang IE department.',
    route: '/announcements/latest',
  },
  {
    icon: <NewReleasesIcon sx={{ fontSize: 28, color: '#2196f3' }} />,
    title: 'New Releases',
    description: 'Check out new tools, processes, and methodologies recently released by our technical teams.',
    route: '/announcements/releases',
  },
  {
    icon: <CampaignIcon sx={{ fontSize: 28, color: '#ff9800' }} />,
    title: 'Events',
    description: 'Find information about upcoming events, workshops, and team activities organized by Jabil Penang.',
    route: '/announcements/events',
  },
  {
    icon: <NotificationsActiveIcon sx={{ fontSize: 28, color: '#ffeb3b' }} />,
    title: 'Notifications',
    description: 'Important notifications and alerts that require  immediate attention.',
    route: '/announcements/notifications',
  }
];

export default function AnnouncementsCard() {
  const { darkMode } = useTheme();

  return (
    <Box 
      sx={{
        padding: '10px 20px',
        paddingBottom: '30px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Roboto', Arial, sans-serif",
        overflowX: 'hidden',
        backgroundColor: darkMode ? '#000f2b' : '#eaeef4',
        color: darkMode ? 'white' : '#333',
        '@media only screen and (max-width: 600px)': {
          padding: '10px 0',
        }
      }}
    >
      {/* Section Title */}
      <Typography 
        variant="h4" 
        sx={{
          textAlign: 'center',
          marginBottom: '15px',
          fontWeight: 500,
          fontFamily: "'Roboto', Arial, sans-serif",
          width: '100%',
          boxSizing: 'border-box',
          color: darkMode ? 'white' : '#333',
        }}
      >
        Announcements
      </Typography>

      {/* Section Description */}
      <Typography 
        variant="body1" 
        sx={{
          textAlign: 'center',
          maxWidth: '1000px',
          margin: '0 auto 40px',
          lineHeight: 1.6,
          fontFamily: "'Roboto', Arial, sans-serif",
          width: '100%',
          boxSizing: 'border-box',
          padding: '0 10px',
          color: darkMode ? '#ccc' : '#666',
        }}
      >
        Stay up-to-date with the latest news, updates, and notifications from Jabil Penang IE department.
      </Typography>

      {/* Card Container */}
      <Box 
        sx={{
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          overflow: 'hidden',
          boxSizing: 'border-box',
          '& > div': {
            '@media only screen and (max-width: 600px)': {
              margin: 0,
              width: '100%',
              boxSizing: 'border-box',
            }
          }
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            display: {
              xs: 'flex',
              sm: 'Grid'
            },
            flexWrap: {
              xs: 'nowrap',
              sm: 'wrap'
            },
            overflowX: {
              xs: 'auto',
              sm: 'visible'
            },
            GridTemplateColumns: {
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
          }}
        >
          {announcements.map((item, index) => (
            <Grid
              item
              key={index}
              sx={{
                flex: {
                  xs: '0 0 90%',
                  sm: '1 1 auto'
                },
                minWidth: {
                  xs: 'auto',
                  sm: 'auto'
                },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Card
                sx={{
                  borderRadius: '8px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease',
                  overflow: 'hidden',
                  boxShadow: 'none',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: darkMode ? '#1e2e4a' : '#ffffff',
                  border: darkMode ? 'none' : '1px solid #e0e0e0',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                  },
                }}
                elevation={0}
              >
                <CardContent 
                  sx={{ 
                    flex: 1,
                    padding: '24px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Card Header with Icon and Title */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '16px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        minWidth: '60px',
                        marginRight: '16px',
                        flexShrink: 0,
                        backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 500,
                        margin: 0,
                        fontSize: '21px',
                        fontFamily: "'Roboto', Arial, sans-serif",
                        width: 'calc(100% - 76px)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: darkMode ? 'white' : '#333',
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  
                  {/* Card Description */}
                  <Typography 
                    variant="body2" 
                    sx={{
                      lineHeight: 1.6,
                      fontFamily: "Arial, sans-serif",
                      width: '100%',
                      boxSizing: 'border-box',
                      color: darkMode ? '#ccc' : '#666',
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>

                {/* Card Action Button */}
                <CardActions 
                  sx={{ 
                    padding: '16px 24px 24px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: '4px',
                      padding: '8px 16px',
                      fontWeight: 500,
                      fontFamily: "'Roboto', Arial, sans-serif",
                      letterSpacing: '0.5px',
                      boxShadow: 'none',
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0',
                      color: darkMode ? 'white' : '#333',
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : '#d0d0d0',
                      },
                    }}
                    size="medium"
                    component={item.route.startsWith('http') ? 'a' : Link}
                    href={item.route.startsWith('http') ? item.route : undefined}
                    to={!item.route.startsWith('http') ? item.route : undefined}
                    target={item.route.startsWith('http') ? "_blank" : undefined}
                    rel={item.route.startsWith('http') ? "noopener noreferrer" : undefined}
                  >
                    VIEW DETAILS
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}