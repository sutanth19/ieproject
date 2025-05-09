import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TuneIcon from '@mui/icons-material/Tune';
import './../Css/Global.css'; // Import the Global.css file instead of a separate CSS file


const GanttToolbar = ({
  onZoomIn,
  onZoomOut,
  currentZoomLevel = 4,
  maxZoomLevel = 6,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFilterApply,
  onFilterReset
}) => {
  const theme = useTheme();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');
  
  // Check if filter is active
  const isFilterActive = Boolean(startDate || endDate);
  const openFilterPopover = Boolean(filterAnchorEl);
  const filterId = openFilterPopover ? 'filter-popover' : undefined;

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Format date for input
  const formatDateForInput = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle filter button click
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Handle filter popover close
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle local date changes
  const handleLocalStartDateChange = (e) => {
    setLocalStartDate(e.target.value);
  };

  const handleLocalEndDateChange = (e) => {
    setLocalEndDate(e.target.value);
  };

  // Apply filter and close popover
  const handleApplyFilter = () => {
    if (onStartDateChange) {
      const event = { target: { value: localStartDate } };
      onStartDateChange(event);
    }
    
    if (onEndDateChange) {
      const event = { target: { value: localEndDate } };
      onEndDateChange(event);
    }
    
    if (onFilterApply) onFilterApply();
    handleFilterClose();
  };

  // Reset filter and close popover
  const handleResetFilter = () => {
    setLocalStartDate('');
    setLocalEndDate('');
    
    if (onFilterReset) onFilterReset();
    handleFilterClose();
  };

  return (
    <Box className="gantt-toolbar-container">
      {/* Header Title */}
      <Box className="gantt-toolbar-header">
        <Typography component="h1" className="gantt-toolbar-title">
          IE Gantt Chart
        </Typography>
        
        {/* Simple Controls */}
        <Box className="gantt-toolbar-controls">
          {isFilterActive && (
            <Box className="gantt-toolbar-filter-tag">
              <DateRangeIcon className="gantt-toolbar-filter-icon" />
              <Typography variant="body2" className="gantt-toolbar-filter-text">
                {startDate && endDate 
                  ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
                  : startDate 
                    ? `From ${formatDateForDisplay(startDate)}`
                    : `Until ${formatDateForDisplay(endDate)}`
                }
              </Typography>
            </Box>
          )}

          <Box className="gantt-toolbar-actions">
            {/* Filter */}
            <Tooltip title="Filter">
              <IconButton
                aria-describedby={filterId}
                onClick={handleFilterClick}
                size="small"
                className="gantt-toolbar-icon-button"
              >
                <TuneIcon fontSize="small" />
              </IconButton>
            </Tooltip>


            {/* Zoom Out */}
            <Tooltip title="Zoom Out">
              <IconButton
                size="small"
                onClick={onZoomOut}
                disabled={currentZoomLevel === 0}
                className="gantt-toolbar-icon-button"
              >
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Zoom In */}
            <Tooltip title="Zoom In">
              <IconButton
                size="small"
                onClick={onZoomIn}
                disabled={currentZoomLevel === maxZoomLevel}
                className="gantt-toolbar-icon-button"
              >
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      
      {/* Filter Popover */}
      <Popover
        id={filterId}
        open={openFilterPopover}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          className: "gantt-toolbar-popover"
        }}
      >
        <Box className="gantt-toolbar-popover-container">
          {/* Popover Header */}
          <Box className="gantt-toolbar-popover-header">
            <Typography variant="subtitle2" className="gantt-toolbar-popover-title">
              <FilterListIcon fontSize="small" />
              Date Range Filter
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleFilterClose}
              className="gantt-toolbar-popover-close"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {/* Filter Form */}
          <Box className="gantt-toolbar-form">
            {/* Start Date */}
            <Box className="gantt-toolbar-form-group">
              <Typography variant="body2" className="gantt-toolbar-form-label">
                Start Date
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={formatDateForInput(localStartDate)}
                onChange={handleLocalStartDateChange}
                InputProps={{
                  className: "gantt-toolbar-input"
                }}
              />
            </Box>
            
            {/* End Date */}
            <Box className="gantt-toolbar-form-group">
              <Typography variant="body2" className="gantt-toolbar-form-label">
                End Date
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={formatDateForInput(localEndDate)}
                onChange={handleLocalEndDateChange}
                InputProps={{
                  className: "gantt-toolbar-input"
                }}
              />
            </Box>
            
            {/* Action Buttons */}
            <Box className="gantt-toolbar-actions-buttons">
              <Button 
                variant="outlined" 
                onClick={handleResetFilter}
                startIcon={<RestartAltIcon />}
                size="small"
                className="gantt-toolbar-button gantt-toolbar-reset"
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                onClick={handleApplyFilter}
                size="small"
                className="gantt-toolbar-button gantt-toolbar-apply"
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default GanttToolbar;