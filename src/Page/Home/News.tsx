import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid, { GridProps } from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import '../Css/Global.css';
import newsIcon from './../../assets/news_dark1.svg';
import notificationIcon from './../../assets/notification_dark1.svg';

interface NewsItem {
  type: "news" | "announcement";
  title: string;
  description: string;
  date: string;
  tag: string[];
}

interface RowPair {
  news: NewsItem | null;
  announcement: NewsItem | null;
}

interface NewsCardProps {
  item: NewsItem | null;
  isLast: boolean;
}

const newsContent: NewsItem[] = [
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

const createPairedRows = (content: NewsItem[]): RowPair[] => {
  const newsItems: NewsItem[] = content.filter((item: NewsItem) => item.type === "news");
  const announcementItems: NewsItem[] = content.filter((item: NewsItem) => item.type === "announcement");
  const maxLength: number = Math.max(newsItems.length, announcementItems.length);

  const pairedRows: RowPair[] = [];
  for (let i = 0; i < maxLength; i++) {
    pairedRows.push({
      news: newsItems[i] || null,
      announcement: announcementItems[i] || null,
    });
  }
  return pairedRows;
};

const pairedRows: RowPair[] = createPairedRows(newsContent);

const NewsCard: React.FC<NewsCardProps> = ({ item, isLast }) => {
  if (!item) return <Box />;

  return (
    <Card
      sx={{
        display: 'flex',
        mb: isLast ? 0 : 0.5,
        borderLeft: "4px solid #46BFE8",
        borderRadius: '5px',
        height: '100%',
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
            <Link href="somewhere" variant="h5" color="textPrimary" underline="none">
              {item.title}
            </Link>
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
                backgroundColor: 'transparent',
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexWrap: 'nowrap',
                  minWidth: 'max-content',
                  py: 0.5,
                }}
              >
                {item.tag.map((tag: string, idx: number) => (
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
                        padding: '4px 8px',
                      },
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

const News: React.FC = () => {
  return (
    <Box>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Typography variant="h3" className="section-title">
              News & Announcement
            </Typography>
            <Link href="somewhere" target="_blank">
              See more →
            </Link>
          </Stack>
        </Grid>

        {pairedRows.map((row: RowPair, rowIndex: number) => (
          <React.Fragment key={rowIndex}>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <NewsCard item={row.news} isLast={rowIndex === pairedRows.length - 1} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <NewsCard item={row.announcement} isLast={rowIndex === pairedRows.length - 1} />
              </Box>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default News;