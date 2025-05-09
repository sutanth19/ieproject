import React from 'react';
import IconButton from '@mui/material/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material';

/**
 * Custom styles for day cells (used in zoom configuration)
 * @param {Date} date The date to style
 * @returns {Object|null} Style object or null
 */
export const dayStyle = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6 ? { backgroundColor: '#f5f5f5' } : null;
};

/**
 * Custom template for hours (used in zoom configuration)
 * @param {Date} date The date to format
 * @returns {string} Formatted hour string
 */
export const hoursTemplate = (date) => {
  const hours = date.getHours();
  return hours === 0 ? "12 AM" : hours === 12 ? "12 PM" : hours > 12 ? `${hours - 12} PM` : `${hours} AM`;
};

/**
 * Get zoom configuration object
 * @param {number} currentZoomLevel Current zoom level
 * @returns {Object} Zoom configuration object
 */
export const getZoomConfig = (currentZoomLevel) => {
  return {
    maxCellWidth: 400,
    level: currentZoomLevel,
    levels: [
      // Level 0: Year view
      {
        minCellWidth: 200,
        scales: [{ unit: "year", step: 1, format: "yyyy" }],
      },
      // Level 1: Year + Quarter view
      {
        minCellWidth: 150,
        scales: [
          { unit: "year", step: 1, format: "yyyy" },
          { unit: "quarter", step: 1, format: "QQQQ" },
        ],
      },
      // Level 2: Quarter + Month view
      {
        minCellWidth: 250,
        scales: [
          { unit: "quarter", step: 1, format: "QQQQ" },
          { unit: "month", step: 1, format: "MMMM yyy" },
        ],
      },
      // Level 3: Month + Week view
      {
        minCellWidth: 100,
        scales: [
          { unit: "month", step: 1, format: "MMMM yyy" },
          { unit: "week", step: 1, format: "'Week' w" },
        ],
      },
      // Level 4: Month + Day view
      {
        maxCellWidth: 200,
        scales: [
          { unit: "month", step: 1, format: "MMMM yyy" },
          { unit: "day", step: 1, format: "d", css: dayStyle },
        ],
      },
      // Level 5: Day + 6-hour blocks
      {
        minCellWidth: 25,
        scales: [
          { unit: "day", step: 1, format: "MMM d", css: dayStyle },
          { unit: "hour", step: 6, format: hoursTemplate },
        ],
      },
      // Level 6: Day + Hour view (most detailed)
      {
        scales: [
          { unit: "day", step: 1, format: "MMM d", css: dayStyle },
          { unit: "hour", step: 1, format: "HH:mm" },
        ],
      },
    ],
  };
};

/**
 * ZoomControls Component
 * 
 * @param {Object} props Component properties
 * @param {number} props.currentZoomLevel Current zoom level
 * @param {number} props.maxZoomLevel Maximum zoom level
 * @param {Function} props.onZoomIn Handler for zoom in action
 * @param {Function} props.onZoomOut Handler for zoom out action
 * @param {Function} props.onViewChange Handler for view type change
 */
const ZoomControls = ({ 
  currentZoomLevel, 
  maxZoomLevel, 
  onZoomIn, 
  onZoomOut, 
  onViewChange 
}) => {
  const theme = useTheme();

  // Map view types to zoom levels
  const monthViewLevel = 2;
  const weekViewLevel = 3;
  const dayViewLevel = 4;

  // Styling for the zoom controls container
  const zoomControlsStyle = {
    position: 'absolute',
    top: '8px',
    right: '16px',
    zIndex: 10,
    display: 'flex',
    gap: '8px'
  };

  return (
    <div style={zoomControlsStyle}>
      {/* Zoom buttons */}
      <Paper elevation={2} sx={{ display: 'flex', borderRadius: '24px', padding: '4px' }}>
        <Tooltip title="Zoom Out">
          <IconButton 
            size="small" 
            onClick={onZoomOut} 
            disabled={currentZoomLevel === 0}
            sx={{ color: theme.palette.primary.main }}
          >
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom In">
          <IconButton 
            size="small" 
            onClick={onZoomIn} 
            disabled={currentZoomLevel === maxZoomLevel}
            sx={{ color: theme.palette.primary.main }}
          >
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
      </Paper>
      
      {/* View type buttons */}
      <Paper elevation={2} sx={{ display: 'flex', borderRadius: '24px', padding: '4px' }}>
        <Tooltip title="Month View">
          <IconButton 
            size="small" 
            onClick={() => onViewChange(monthViewLevel)} 
            color={currentZoomLevel === monthViewLevel ? "primary" : "default"}
            sx={{ backgroundColor: currentZoomLevel === monthViewLevel ? 'rgba(25, 118, 210, 0.08)' : 'transparent' }}
          >
            <CalendarViewMonthIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Week View">
          <IconButton 
            size="small" 
            onClick={() => onViewChange(weekViewLevel)} 
            color={currentZoomLevel === weekViewLevel ? "primary" : "default"}
            sx={{ backgroundColor: currentZoomLevel === weekViewLevel ? 'rgba(25, 118, 210, 0.08)' : 'transparent' }}
          >
            <CalendarViewWeekIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Day View">
          <IconButton 
            size="small" 
            onClick={() => onViewChange(dayViewLevel)} 
            color={currentZoomLevel === dayViewLevel ? "primary" : "default"}
            sx={{ backgroundColor: currentZoomLevel === dayViewLevel ? 'rgba(25, 118, 210, 0.08)' : 'transparent' }}
          >
            <CalendarViewDayIcon />
          </IconButton>
        </Tooltip>
      </Paper>
    </div>
  );
};

export default ZoomControls;