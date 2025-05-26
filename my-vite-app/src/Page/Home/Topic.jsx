
import React from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { FaChartLine, FaIndustry, FaTools, FaLightbulb } from "react-icons/fa";
import { useTheme } from "./../../themes/ThemeContext";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import productivityAnimation from "../../assets/img/Productivity.json";
import infrastructureAnimation from "../../assets/img/Infrastructure.json";
import productAnimation from "../../assets/img/product.json";

import '../Css/Global.css';

const topicsData = [
  // fetch from api later
  {
    icon: <FaChartLine className="topic-icon-style topic-green" />,
    title: "Productivity",
    animation: productivityAnimation,
    route: "/maintenance",
    description: "{{productivity description here}}"
  },
  {
    icon: <FaIndustry className="topic-icon-style topic-blue" />,
    title: "Product",
    animation: productAnimation,
    route: "/maintenance",
    description: "{{product & process description here}}"
  },
  {
    icon: <FaTools className="topic-icon-style topic-orange" />,
    title: "Infrastructure",
    animation: infrastructureAnimation,
    route: "/maintenance",
    description: "{{infra description here}}"
  },
  {
    icon: <FaLightbulb className="topic-icon-style topic-yellow" />,
    title: "Moonshine",
    animation: productivityAnimation,
    route: "/maintenance",
    description: "{{moonshine description here}}"
  },
];

const Topic = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h3" className="section-title">
        End-to-end topic solutions covered
      </Typography>

      {/* <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
          gap: 3,
        }}
      > */}
        <Grid container spacing={2} justifyContent={{justifyContent: "space-between"}}>
        {/* {topicsData.map((item, index) => (

        ))} */}
        </Grid>
      {/* </Box> */}


      {/* 
          On mobile (xs), use flex row with overflowX to allow horizontal scrolling.
          On small screens (sm) and up, switch to a grid layout.
        */}
      <Grid container spacing={3}
        sx={{
          // Switch container display based on screen size
          display: {
            xs: "flex",    // flex row on mobile
            sm: "grid",    // grid on larger screens
          },
          flexWrap: {
            xs: "nowrap",  // no wrap on mobile so cards scroll horizontally
            sm: "wrap",    // normal wrapping in grid mode
          },
          overflowX: {
            xs: "auto",    // enable horizontal scrolling on mobile
            sm: "visible", // no scroll on larger screens
          },
          gridTemplateColumns: {
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          maxWidth: "1400px",
          margin: "0 auto",
          paddingX: { xs: 2, md: 0 },
          alignItems: "stretch",
        }}
      >
        {topicsData.map((item, index) => (
          <Grid container
            key={index}
            sx={{
              flex: {
                xs: "0 0 auto", // don’t shrink below minWidth
                sm: "1 1 auto", // normal flex in grid mode
              },
              minWidth: {
                xs: "240px",    // set a min width for mobile
                sm: "auto",
              },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Card key={index}
              className={`card ${darkMode ? `dark-mode` : null}`}
              elevation={0}
              variant="outlined"
              sx={{ height: "350px" }}
            >
              <Stack sx={{
                height: "100%",
                justifyContent: "space-between"
              }}>
                <div>
                <Card 
                  sx={{ 
                    width: "100%", 
                    height: 150, 
                    backgroundColor: "white", 
                    padding: 1, 
                    boxShadow: "none", 
                    borderRadius: 0 
                  }} 
                  elevation={0}
                >
                  <CardContent sx={{ padding: 0, height: "100%" }}>
                    <Lottie 
                      animationData={item.animation} 
                      loop={true}
                      style={{ height: "100%", width: "100%", objectFit: "contain" }}
                    />
                  </CardContent>
                </Card>
                  <CardContent
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    <Typography variant="h5" component="div">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </div>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => navigate(item.route)}
                  >
                    Learn more
                  </Button>
                </CardActions>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Topic;
