import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from './../../themes/ThemeContext';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import './../Css/Global.css'; 

const Introduction = () => {
    const { darkMode } = useTheme();

    const ieJobScope = [
        {
            icon: <Avatar sx={{ bgcolor: `${darkMode ? `rgba(0, 0, 0, 0.3)` : `rgba(0, 0, 0, 0.05)`}`, height: "50px", width: "50px" }}>
                <PrecisionManufacturingIcon className="ie-icon" />
            </Avatar>,
            title: <Typography variant='body1' fontWeight={500}>IE Core</Typography>,
            // description: "Focuses on line or station setup, capacity, and direct labor sizing, as well as layout improvements."
            description: <Typography variant='caption'>
                Focuses on line or station setup, capacity, and direct labor sizing, as well as layout improvements.
                </Typography>,
        },
        {
            icon: <Avatar sx={{ bgcolor: `${darkMode ? `rgba(0, 0, 0, 0.3)` : `rgba(0, 0, 0, 0.05)`}` }}>
                <DesignServicesIcon className="ie-icon" />
            </Avatar>,
            title: <Typography variant='body1' fontWeight={500}>IE Product</Typography>,
            // description: "Centers on product-related tasks, including product visual aids (VA) and other design enhancements."
            description: <Typography variant='caption'>
                Centers on product-related tasks, including product visual aids (VA) and other design enhancements.
            </Typography>,
        },
    ];


    return (
        <Box>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={3}>
                        <Typography variant="h2" className='section-title'>
                            Welcome to IE Portal
                        </Typography>
                        <Typography variant="h5" className='section-description' noWrap={false}>
                            Industrial Engineering designs efficient production
                            <strong style={{ fontWeight: "800" }}> layouts </strong> and <strong style={{ fontWeight: "800" }}> processes </strong>
                            to boost productivity, cut waste and costs, and ensure top-quality standards in an organization.
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} >
                    <Stack spacing={1} alignItems={{ alignItems: "center" }} sx={{ marginTop: "16px" }}>
                        {ieJobScope.map((item, index) => (
                            <Tooltip key={index} title="Learn more" placement='top' arrow>
                                <Card className='ie-job-scope' key={index}>
                                    <CardHeader
                                        avatar={item.icon}
                                        title={item.title}
                                        subheader={
                                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                              {item.description}
                                            </Box>
                                        }
                                        >
                                    </CardHeader>
                                </Card>
                            </Tooltip>
                        ))}
                    </Stack>
                    <Typography align='right' sx={{ fontStyle: "italic", fontSize: "0.6rem" }} color='textSecondary'>
                        *Jabil Penang, Industrial Engineering is primarily divided into two scopes
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Introduction;