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
        tag: ["tag1", "tag2-long-tag-here-for-example-overflow-of-the-content", "tag3-try-long-text-here"]
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
        tag: ["tag1", "tag2-long-tag-here-for-example-overflow-of-the-content", "tag3-try-long-text-here"]
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

// Restructure data to pair news and announcements by index for row alignment
const createPairedRows = (newsContent) => {
    const newsItems = newsContent.filter(item => item.type === "news");
    const announcementItems = newsContent.filter(item => item.type === "announcement");
    const maxLength = Math.max(newsItems.length, announcementItems.length);
    
    const pairedRows = [];
    for (let i = 0; i < maxLength; i++) {
        pairedRows.push({
            news: newsItems[i] || null,
            announcement: announcementItems[i] || null
        });
    }
    return pairedRows;
};

const pairedRows = createPairedRows(newsContent);

const NewsCard = ({ item, isLast }) => {
    if (!item) return <Box />; // Empty placeholder if no item
    
    return (
        <Card
            sx={{ 
                display: 'flex', 
                mb: isLast ? 0 : 2,
                borderLeft: "4px solid #46BFE8",
                borderRadius: '5px',
                height: '100%' // This ensures the card fills the available height
            }}
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
                <Box display="flex" flexDirection="column" justifyContent="space-between" gap={1.25} height="100%">
                    <Box>
                        <Link href="someherejugak" variant="h5" color="textPrimary" underline="none">{item.title}</Link>
                        <Typography variant="subtitle1" color="text.secondary">
                            {item.description}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box 
                            className="tag-scroll-container"
                            sx={{ 
                                flex: 1, 
                                minWidth: 0,
                                '&::after': {
                                    display: 'none'
                                },
                                '&::-webkit-scrollbar-button': {
                                    display: 'none !important'
                                },
                                backgroundColor: 'transparent'
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ 
                                    flexWrap: 'nowrap', 
                                    minWidth: 'max-content',
                                    py: 0.5  
                                }}
                            >
                                {item.tag.map((tag, idx) => (
                                    <Chip
                                        key={idx}
                                        size="small"
                                        clickable
                                        label={tag}
                                        sx={{ 
                                            height: 'auto', 
                                            borderRadius: '5px', 
                                            flexShrink: 0,
                                            '& .MuiChip-label': {
                                                padding: '4px 8px' 
                                            }
                                        }}
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
    );
};

const News = () => {
    return (
        <Box>
            <Grid container spacing={3} justifyContent="center">
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

                {pairedRows.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        <Grid size={{ xs: 6 }} sx={{ display: 'flex' }}>
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <NewsCard 
                                    item={row.news} 
                                    isLast={rowIndex === pairedRows.length - 1} 
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 6 }} sx={{ display: 'flex' }}>
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <NewsCard 
                                    item={row.announcement} 
                                    isLast={rowIndex === pairedRows.length - 1} 
                                />
                            </Box>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Box>
    );
};

export default News;