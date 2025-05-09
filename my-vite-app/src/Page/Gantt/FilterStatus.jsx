import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const FilterStatus = ({ isFiltered, startDate, endDate, totalCount, filteredCount, onClear }) => {
  if (!isFiltered) return null;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric"
    });
  };
  
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        backgroundColor: '#e3f2fd', 
        margin: '8px 0',
        borderColor: '#bbdefb'
      }}
    >
      <CardContent sx={{ 
        padding: '8px 16px !important', 
        '&:last-child': { paddingBottom: '8px !important' }
      }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterAltIcon fontSize="small" sx={{ color: '#2196f3' }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#0d47a1' }}>
              Showing filtered tasks:
            </Typography>
            
            {/* Date range display with chips */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              {startDate && (
                <Chip 
                  label={`From: ${formatDate(startDate)}`} 
                  size="small"
                  sx={{ 
                    backgroundColor: '#bbdefb', 
                    fontWeight: 500, 
                    fontSize: '0.75rem',
                    height: '24px',
                    color: '#0d47a1'
                  }}
                />
              )}
              
              {endDate && (
                <Chip 
                  label={`To: ${formatDate(endDate)}`} 
                  size="small"
                  sx={{ 
                    backgroundColor: '#bbdefb', 
                    fontWeight: 500, 
                    fontSize: '0.75rem',
                    height: '24px',
                    color: '#0d47a1'
                  }}
                />
              )}
              
              <Chip 
                label={`${filteredCount} of ${totalCount} tasks`} 
                size="small"
                sx={{ 
                  backgroundColor: '#90caf9', 
                  fontWeight: 500, 
                  fontSize: '0.75rem',
                  height: '24px',
                  ml: 0.5,
                  color: '#0d47a1'
                }}
              />
            </Box>
          </Box>
          
          <Button 
            size="small" 
            onClick={onClear}
            sx={{ 
              color: '#1565c0', 
              textTransform: 'none',
              minWidth: 'auto',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(13, 71, 161, 0.08)'
              }
            }}
          >
            Clear
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FilterStatus;