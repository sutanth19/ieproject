// GanttView.jsx - Enhanced with date filtering functionality
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Gantt, Willow } from "wx-react-gantt";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import "wx-react-gantt/dist/gantt.css";
import { getZoomConfig } from "./ZoomControls";
import GanttToolbar from "./GanttToolbar";
import './../Css/Global.css'; 
import Form from "./Form";
import SimpleDataProvider from "./SimpleDataProvider"; 

const SERVER_URL = "http://localhost:5001/api/gantt";

const MyGanttComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiRef = useRef(null);
  const [store, setStore] = useState(null);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(4);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Date filter states
  const [originalTasks, setOriginalTasks] = useState([]);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  
  // Create the data provider
  const dataProvider = useRef(new SimpleDataProvider(SERVER_URL));

  // Get theme and create media queries
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // Create zoom config from the helper
  const zoomConfig = getZoomConfig(currentZoomLevel);

  // Function to load data from server
  const loadData = useCallback(() => {
    console.log("Loading data from server...");
    setLoading(true);
    
    dataProvider.current.getData()
      .then(data => {
        console.log("Server data received:", data);
        const tasksData = data.tasks || [];
        setTasks(tasksData);
        setOriginalTasks(tasksData); // Store the original unfiltered tasks
        setLinks(data.links || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading Gantt data:", err);
        setError(`Failed to load project data: ${err.message}`);
        setLoading(false);
        
        // If server fails, use fallback data
        const fallbackTasks = getFallbackTasks();
        setTasks(fallbackTasks);
        setOriginalTasks(fallbackTasks); // Store the original unfiltered tasks
        setLinks(getFallbackLinks());
      });
  }, []);

  // Initial data load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Set up API chain - FIXED to properly connect to data provider
  useEffect(() => {
    if (apiRef.current) {
      const api = apiRef.current;
      
      // Get the tasks state once
      const tasksState = api.getState().tasks;
      if (tasksState) {
        setStore(tasksState);
        console.log("API and store initialized successfully");
      }
      
      // Set the data provider in the chain - THIS IS CRUCIAL FOR CRUD TO WORK
      api.setNext(dataProvider.current);
      console.log("Data provider set in the API chain");
      
      // Set up event listeners for task changes
      api.on("task-added", (data) => {
        console.log("Task added:", data);
        // Refresh data after task is added
        loadData();
      });
      
      api.on("task-updated", (data) => {
        console.log("Task updated:", data);
        // Refresh data after task is updated
        loadData();
      });
      
      api.on("task-deleted", (data) => {
        console.log("Task deleted:", data);
        setSelectedTask(null);
        // Refresh data after task is deleted
        loadData();
      });
      
      // Intercept the default editor and show custom form instead
      api.intercept("show-editor", (data) => {
        if (tasksState) {
          const taskData = tasksState.byId(data.id);
          if (taskData) {
            console.log("Intercepted editor for task:", taskData);
            setSelectedTask(taskData);
            return false; // Prevent default editor from opening
          }
        }
        return true;
      });
      
      // Listen for zoom level changes
      api.on("zoom-change", (data) => {
        setCurrentZoomLevel(data.level);
      });
      
      // Listen for task selection changes
      api.on("task-selected", (data) => {
        if (tasksState) {
          const taskData = tasksState.byId(data.id);
          if (taskData) {
            console.log("Task selected:", taskData);
            setSelectedTask(taskData);
          }
        }
      });
      
      // Listen for task deselection
      api.on("task-deselected", () => {
        setSelectedTask(null);
      });
    }
  // Only depend on apiRef.current to avoid infinite re-renders
  }, [apiRef.current, loadData]);

  // Function to calculate the end date of a task
  const calculateEndDate = (task) => {
    if (task.start && task.duration) {
      const endDate = new Date(task.start);
      endDate.setDate(endDate.getDate() + task.duration);
      return endDate;
    }
    return task.end; // Return the end date if it exists
  };

  // Function to apply date filters
  const applyDateFilters = () => {
    if (!startDateFilter && !endDateFilter) {
      // No filters set, show all tasks
      setTasks(originalTasks);
      setIsFiltered(false);
      return;
    }

    setIsFiltered(true);
    
    let filteredTasks = [...originalTasks];
    
    if (startDateFilter) {
      const startFilter = new Date(startDateFilter);
      // Set to beginning of the day
      startFilter.setHours(0, 0, 0, 0);
      
      filteredTasks = filteredTasks.filter(task => {
        // We're checking if the task's end date is >= the start filter date
        const taskEnd = calculateEndDate(task);
        return taskEnd ? taskEnd >= startFilter : true;
      });
    }
    
    if (endDateFilter) {
      const endFilter = new Date(endDateFilter);
      // Set to end of the day
      endFilter.setHours(23, 59, 59, 999);
      
      filteredTasks = filteredTasks.filter(task => {
        // We're checking if the task's start date is <= the end filter date
        return task.start ? task.start <= endFilter : true;
      });
    }
    
    // Update the displayed tasks
    setTasks(filteredTasks);
    
    // Log filtering results
    console.log(`Filtered from ${originalTasks.length} to ${filteredTasks.length} tasks`);
  };

  // Reset date filters
  const resetDateFilters = () => {
    setStartDateFilter("");
    setEndDateFilter("");
    setTasks(originalTasks);
    setIsFiltered(false);
    console.log("Date filters reset, showing all tasks");
  };

  // Handle start date change
  const handleStartDateChange = (e) => {
    setStartDateFilter(e.target.value);
  };

  // Handle end date change
  const handleEndDateChange = (e) => {
    setEndDateFilter(e.target.value);
  };

  // Fallback data in case of server error
  const getFallbackTasks = () => {
    return [
      {
        id: 1,
        open: true,
        start: new Date(2025, 4, 1),
        duration: 15,
        text: "IE Portal",
        progress: 30,
        type: "summary"
      },
      {
        id: 2,
        parent: 1,
        start: new Date(2025, 4, 1),
        duration: 5,
        text: "UI Focus",
        progress: 45,
        type: "summary"
      },
      // Add more fallback tasks as needed
    ];
  };

  const getFallbackLinks = () => {
    return [
      { id: 1, source: 7, target: 6, type: "s2s" }
    ];
  };

  // Handle zoom in button click
  const handleZoomIn = () => {
    if (currentZoomLevel < zoomConfig.levels.length - 1) {
      const newLevel = currentZoomLevel + 1;
      setCurrentZoomLevel(newLevel);
      
      if (apiRef.current) {
        apiRef.current.exec("set-zoom-level", { level: newLevel });
      }
    }
  };

  // Handle zoom out button click
  const handleZoomOut = () => {
    if (currentZoomLevel > 0) {
      const newLevel = currentZoomLevel - 1;
      setCurrentZoomLevel(newLevel);
      
      if (apiRef.current) {
        apiRef.current.exec("set-zoom-level", { level: newLevel });
      }
    }
  };

  // Handle adding a new task
  const handleAddTask = () => {
    if (apiRef.current) {
      const today = new Date();
      const newTask = {
        text: "New Task",
        start: today,
        duration: 3,
        progress: 0
      };
      
      console.log("Adding new task:", newTask);
      apiRef.current.exec("add-task", newTask)
        .then(result => {
          console.log("Task added successfully:", result);
          // Refresh data to show the new task
          loadData();
        })
        .catch(err => {
          console.error("Failed to add task:", err);
          setError(`Failed to add task: ${err.message}`);
        });
    }
  };

  // Handle editing the selected task
  const handleEditTask = () => {
    if (selectedTask && apiRef.current) {
      console.log("Editing task:", selectedTask);
      setSelectedTask(selectedTask);
    }
  };

  // Handle deleting the selected task
  const handleDeleteTask = () => {
    if (selectedTask && apiRef.current) {
      if (window.confirm(`Are you sure you want to delete the task "${selectedTask.text}"?`)) {
        console.log("Deleting task:", selectedTask);
        apiRef.current.exec("delete-task", { id: selectedTask.id })
          .then(result => {
            console.log("Task deleted successfully:", result);
            setSelectedTask(null);
            // Refresh data to remove the deleted task
            loadData();
          })
          .catch(err => {
            console.error("Failed to delete task:", err);
            setError(`Failed to delete task: ${err.message}`);
          });
      }
    }
  };

  // Handle form actions - IMPROVED with error handling and feedback
  const handleFormAction = (ev) => {
    const { action, data } = ev;
    console.log("Form action:", action, data);

    switch (action) {
      case "close-form":
        setSelectedTask(null);
        break;

      case "update-task":
        if (apiRef.current) {
          console.log("Updating task with data:", data);
          
          // Ensure data has the right format
          const taskData = { ...data };
          
          // Make sure date is a Date object
          if (taskData.start && !(taskData.start instanceof Date)) {
            taskData.start = new Date(taskData.start);
          }
          
          // Convert strings to numbers
          if (typeof taskData.duration === 'string') {
            taskData.duration = Number(taskData.duration);
          }
          
          if (typeof taskData.progress === 'string') {
            taskData.progress = Number(taskData.progress);
          }
          
          apiRef.current.exec("update-task", taskData)
            .then(result => {
              console.log("Task updated successfully:", result);
              setSelectedTask(null);
              // Refresh data to show the updated task
              loadData();
            })
            .catch(err => {
              console.error("Failed to update task:", err);
              setError(`Failed to update task: ${err.message}`);
            });
        }
        break;
        
      case "delete-task":
        if (apiRef.current) {
          console.log("Deleting task from form:", data);
          apiRef.current.exec("delete-task", data)
            .then(result => {
              console.log("Task deleted successfully:", result);
              setSelectedTask(null);
              // Refresh data to remove the deleted task
              loadData();
            })
            .catch(err => {
              console.error("Failed to delete task:", err);
              setError(`Failed to delete task: ${err.message}`);
            });
        }
        break;
        
      default:
        console.warn("Unknown form action:", action);
        break;
    }
  };

  // Adjust scales based on screen size
  const getResponsiveScales = () => {
    if (isXSmallScreen) {
      return [
        { unit: "month", step: 1, format: "MMM" },
        { unit: "day", step: 3, format: "d" },
      ];
    }
    
    if (isSmallScreen) {
      return [
        { unit: "month", step: 1, format: "MMM yyyy" }, 
        { unit: "day", step: 2, format: "d" },
      ];
    }
    
    return [
      { unit: "month", step: 1, format: "MMMM yyyy" },
      { unit: "day", step: 1, format: "d" },
    ];
  };

  // Enhanced task types list with custom types
  const taskTypes = [
    { id: "task", label: "Task" },
    { id: "milestone", label: "Milestone" },
    { id: "summary", label: "Project" },
    { id: "urgent", label: "Urgent" },
    { id: "narrow", label: "Narrow" },
    { id: "progress", label: "Progress" },
    { id: "round", label: "Rounded" }
  ];

  // Use useEffect to modify document styling
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#f5f5f5';
    
    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100%';
      root.style.width = '100%';
      root.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.overflow = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Main content container style - full height and width
  const contentContainerStyle = {
    height: 'calc(100vh - 64px)', // Subtract header height
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  // Container style with full height
  const containerStyle = {
    height: '100%',
    padding: isXSmallScreen ? '4px' : isSmallScreen ? '8px' : '12px',
    paddingTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  // Gantt container style - give it flex-grow to fill available space
  const ganttContainerStyle = {
    marginTop: '12px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  // Willow wrapper style - ensure it fills parent
  const willowStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  // Loading state display
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>Loading project data...</div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Error state display
  if (error && !tasks.length) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '20px', color: 'red' }}>{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#0056b3', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      {/* Main content with Container */}
      <div style={contentContainerStyle}>
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            padding: '8px 16px', 
            color: '#c62828', 
            borderRadius: '4px',
            margin: '0 12px',
            marginBottom: '8px'
          }}>
            {error}
            <button 
              onClick={() => setError(null)} 
              style={{
                marginLeft: '12px',
                background: 'none',
                border: 'none',
                color: '#c62828',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>
          </div>
        )}
        <Container 
          maxWidth="xl" 
          disableGutters
          sx={containerStyle}
        >
          {/* Toolbar Component with Date Filtering */}
          <GanttToolbar
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            isTaskSelected={Boolean(selectedTask)}
            currentZoomLevel={currentZoomLevel}
            maxZoomLevel={zoomConfig.levels.length - 1}
            startDate={startDateFilter}
            endDate={endDateFilter}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            onFilterApply={applyDateFilters}
            onFilterReset={resetDateFilters}
          />
          
          {/* Filter Status Indicator */}
          {isFiltered && (
            <div style={{ 
              backgroundColor: '#e3f2fd', 
              padding: '4px 12px', 
              color: '#0d47a1', 
              borderRadius: '4px',
              margin: '8px 0',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>
                Showing filtered tasks: 
                {startDateFilter && ` from ${new Date(startDateFilter).toLocaleDateString()}`}
                {endDateFilter && ` to ${new Date(endDateFilter).toLocaleDateString()}`}
                {` (${tasks.length} of ${originalTasks.length} tasks)`}
              </span>
              <button 
                onClick={resetDateFilters} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0d47a1',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  padding: '0 4px'
                }}
              >
                Clear
              </button>
            </div>
          )}
          
          {/* Gantt chart container with flex-grow */}
          <div style={ganttContainerStyle}>
            <Willow customStyles={willowStyle}>
              <Gantt 
                apiRef={apiRef}
                tasks={tasks} 
                links={links} 
                scales={getResponsiveScales()}
                width="100%"
                height="100%"
                zoom={zoomConfig}
                taskTypes={taskTypes}
              />
            </Willow>
          </div>
        </Container>
      </div>
      
      {/* Custom form dialog - shown when a task is selected */}
      {selectedTask && (
        <Form 
          task={selectedTask} 
          taskTypes={taskTypes} 
          onAction={handleFormAction} 
        />
      )}
    </React.Fragment>
  );
};

export default MyGanttComponent;