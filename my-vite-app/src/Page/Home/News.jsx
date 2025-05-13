import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import '../Css/Global.css'

import newsIcon from './../../assets/news_dark1.svg';
import notificationIcon from './../../assets/notification_dark1.svg';

const newsContent = [
    {
        type: "news",
        title: "news 1",
        description: "long-text-here",
        date: "Apr 23, 2025",
        tag: ["tag1", "tag2-long-tag-here-for-example-overflow-of-the-content", "tag3"]
    },
    {
        type: "news",
        title: "news 2",
        description: "long-text-here",
        date: "Apr 27, 2025",
        tag: ["tag1", "tag2", "tag3"]
    },
    {
        type: "news",
        title: "news 3",
        description: "long-text-here",
        date: "Apr 30, 2025",
        tag: ["tag1", "tag2", "tag3"]
    },
    {
        type: "announcement",
        title: "announcement 1",
        description: "long-text-here",
        date: "Apr 23, 2025",
        tag: ["tag1", "tag2", "tag3"]
    },
    {
        type: "announcement",
        title: "announcement 2",
        description: "long-text-here",
        date: "Apr 27, 2025",
        tag: ["tag1", "tag2", "tag3"]
    },
    {
        type: "announcement",
        title: "announcement 3",
        description: "long-text-here",
        date: "Apr 30, 2025",
        tag: ["tag1", "tag2", "tag3"]
    },
];

const groupedContent = newsContent.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
}, {});

const News = () => {
    return (
        <Box>
            <Grid container spacing={3} justifyContent={{ justifyContent: "center" }}>
                <Grid size={{ xs: 12 }}>
                    <Stack direction='row' sx={{alignItems: 'baseline', justifyContent: 'space-between'}} >
                    <Typography variant="h3" className="section-title">
                        News & Announcement
                    </Typography>
                        <Link href="somewhere" target='_blank'>
                            See more →
                        </Link>
                    </Stack>
                </Grid>

                {Object.entries(groupedContent).map(([type, items]) => (
                    <Grid size={{ xs: 6 }} key={type}>
                        {items.map((item, index) => {
                            return (
                                <Card
                                    key={index}
                                    sx={{ display: 'flex', mb: index !== items.length - 1 ? 2 : 0 }}
                                    elevation={0}
                                >
                                    <CardActionArea sx={{ width: '20%', borderRadius: 0 }} disableRipple>
                                        <CardMedia
                                            component="img"
                                            sx={{ height: "100%", width: '100%', bgcolor: 'white' }}
                                            image={item.type === "news" ? newsIcon : notificationIcon}
                                            alt={item.type === "news" ? 'news_svg' : 'notification_svg'}
                                        />
                                    </CardActionArea>
                                    <CardContent sx={{ flex: 1, width: '60%', py: '10px !important' }}>
                                        <Box display="flex" flexDirection="column" justifyContent="space-between" gap={1.25}>
                                            <Box>
                                                <Link href="someherejugak" variant="h5" color="textPrimary" underline="none">{item.title}</Link>
                                                <Typography variant="subtitle1" color="text.secondary">
                                                    {item.description}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box sx={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        sx={{ flexWrap: 'nowrap', minWidth: 'max-content' }}
                                                    >
                                                        {item.tag.map((tag, idx) => (
                                                            <Chip
                                                            key={idx}
                                                            size="small"
                                                            clickable
                                                            label={tag}
                                                            sx={{ height: 'auto', borderRadius: '5px', flexShrink: 0 }}
                                                        />
                                                        ))}
                                                    </Stack>
                                                </Box>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ marginLeft: 1, flexShrink: 0 }}
                                                >
                                                    {item.date}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default News;

