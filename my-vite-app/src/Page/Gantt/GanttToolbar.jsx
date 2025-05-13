import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TuneIcon from '@mui/icons-material/Tune';
import './../Css/Global.css'; 

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
  onFilterReset,
  darkMode = false
}) => {
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
    <Box className={`gantt-toolbar-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header Title */}
      <Box className={`gantt-toolbar-header ${darkMode ? 'dark-mode' : ''}`}>
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
          className: `date-filter-popover ${darkMode ? 'dark-mode' : ''}`
        }}
      >
        <Box className="date-filter-container">
          {/* Popover Header */}
          <Box className="date-filter-header">
            <Typography variant="subtitle2" className="date-filter-title">
              <FilterListIcon fontSize="small" />
              Date Range Filter
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleFilterClose}
              className="date-filter-close"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {/* Filter Form */}
          <Box className={`date-filter-form ${darkMode ? 'dark-mode' : ''}`}>
            {/* Start Date */}
            <Box className="date-filter-form-group">
              <Typography variant="body2" className={`date-filter-form-label ${darkMode ? 'dark-mode' : ''}`}>
                Start Date
              </Typography>
              <input
                type="date"
                className={`date-filter-input ${darkMode ? 'dark-mode' : ''}`}
                value={formatDateForInput(localStartDate)}
                onChange={handleLocalStartDateChange}
              />
            </Box>
            
            {/* End Date */}
            <Box className="date-filter-form-group">
              <Typography variant="body2" className={`date-filter-form-label ${darkMode ? 'dark-mode' : ''}`}>
                End Date
              </Typography>
              <input
                type="date"
                className={`date-filter-input ${darkMode ? 'dark-mode' : ''}`}
                value={formatDateForInput(localEndDate)}
                onChange={handleLocalEndDateChange}
              />
            </Box>
            
            {/* Action Buttons */}
            <Box className="date-filter-actions">
              <button 
                className={`date-filter-button date-filter-reset ${darkMode ? 'dark-mode' : ''}`}
                onClick={handleResetFilter}
              >
                <RestartAltIcon style={{ fontSize: '16px', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Reset
              </button>
              <button 
                className="date-filter-button date-filter-apply"
                onClick={handleApplyFilter}
              >
                Apply
              </button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default GanttToolbar;