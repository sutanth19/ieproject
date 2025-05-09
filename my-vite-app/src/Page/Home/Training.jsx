import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '../../context_themes/ThemeContext';
import '../Css/Global.css';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import ieWebinarImg from './../../assets/img/ie_webbinar.png';

const trainings = [
  {
    icon: <WorkIcon className="icon-style green" />,
    title: 'Workday',
    thumbnail: 'https://www.workday.com/content/dam/web/zz/images/logos/workday/workday-logo.svg',
    description: 'Besides all  personal information is here, you also can find  training on this page.',
    route: 'https://wd5.myworkday.com/jabil/learning',
  },
  {
    icon: <PlayCircleFilledIcon className="icon-style orange" />,
    title: 'IE Webinar',
    thumbnail: ieWebinarImg,
    description: 'This training section uses the same training as Workday without the test evaluation. Feel free to check all the modules.',
    route: 'https://jabil.sharepoint.com/sites/IEPortal/SitePages/IE-Webinars.aspx',
  },
  {
    icon: <CheckCircleIcon className="icon-style yellow" />,
    title: 'e-Jabilization',
    thumbnail: 'http://jpertdf01/eJabilization/Images/ejabedit.png',
    description: 'For those who are new hires, please check  e-Jabilization status here.',
    route: 'http://jpertdf01/eJabilization/UserLogin.aspx',
  }
];

export default function TrainingCard() {
  const { darkMode } = useTheme();

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Stack direction="column" justifyContent={{ justifyContent: "space-between" }} sx={{ height: "100%" }}>
            <Stack spacing={3}>
              <Typography variant="h3" className="section-title">
                Training module
              </Typography>
              <Typography variant="h5" className="section-description">
                Discover more about our training package
              </Typography>
            </Stack>

            <Link href="#" style={{ color: "#46BFE8" }}>
              Learn more
            </Link>

          </Stack>
        </Grid>

        <Grid container spacing={1} size={{ xs: 12, sm: 4 }}>
          {trainings.map((item, index) => (
            <Tooltip key={index} title={`Go to ${item.title}`} placement='top' arrow>
              <Card key={index}
                className={`training-card`} variant='outlined'
                sx={{ maxWidth: "150px", height: "90px", backgroundColor: "#fff" }}>
                <CardActionArea href={item.route} target='_blank'
                  sx={{
                    height: "100%",
                    padding: "5px"
                  }}
                >
                  <Stack sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%"
                  }}>
                    <CardMedia
                      sx={{
                        maxWidth: '100%',
                        objectFit: 'cover',
                        objectPosition: "center",
                        backgroundColor: 'white',
                      }}
                      component="img"
                      image={item.thumbnail ? item.thumbnail : null}
                      alt={item.title}
                    />
                  </Stack>
                </CardActionArea>
              </Card>
            </Tooltip>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}