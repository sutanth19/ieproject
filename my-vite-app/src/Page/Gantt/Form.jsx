// Form.jsx - Fixed implementation with proper date handling
import React, { useState, useEffect } from 'react';

// Basic styling for the form overlay
const formStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer'
  },
  field: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  progressSlider: {
    flex: 1
  },
  progressValue: {
    width: '40px',
    textAlign: 'right'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    color: '#333'
  },
  saveButton: {
    backgroundColor: '#0056b3',
    color: 'white'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white'
  }
};

export const Form = ({ task, taskTypes, onAction }) => {
  // For debugging
  useEffect(() => {
    console.log("Form initialized with task:", task);
    console.log("Start date type:", task.start instanceof Date ? "Date object" : typeof task.start);
  }, [task]);
  
  // Initialize form state from task props
  const [formData, setFormData] = useState({
    id: task.id,
    text: task.text || '',
    type: task.type || 'task',
    progress: task.progress || 0,
    duration: task.duration || 1,
    start: task.start,
    parent: task.parent || 0,
    open: task.open !== undefined ? task.open : true
  });

  // Update form data when task changes
  useEffect(() => {
    setFormData({
      id: task.id,
      text: task.text || '',
      type: task.type || 'task',
      progress: task.progress || 0,
      duration: task.duration || 1,
      start: task.start,
      parent: task.parent || 0,
      open: task.open !== undefined ? task.open : true
    });
  }, [task]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for numeric inputs
    if (name === 'duration') {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        setFormData({
          ...formData,
          [name]: numValue
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Handle progress slider changes
  const handleProgressChange = (e) => {
    setFormData({
      ...formData,
      progress: Number(e.target.value)
    });
  };

  // Handle form submission with proper data conversion
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a copy of formData for submission
    const submissionData = { ...formData };
    
    // Make sure the date is a Date object
    if (submissionData.start && !(submissionData.start instanceof Date)) {
      submissionData.start = new Date(submissionData.start);
    }
    
    // Convert numeric strings to actual numbers
    submissionData.duration = Number(submissionData.duration);
    submissionData.progress = Number(submissionData.progress);
    
    // Log the data being sent
    console.log("Submitting form with data:", submissionData);
    
    // Call the parent component's action handler
    onAction({
      action: 'update-task',
      data: submissionData
    });
  };

  // Handle task deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      console.log("Deleting task:", task.id);
      onAction({
        action: 'delete-task',
        data: { id: task.id }
      });
    }
  };

  // Handle form close
  const handleClose = () => {
    console.log("Closing form");
    onAction({ action: 'close-form' });
  };

  // Format date in a way suitable for date input
  const formatDateForInput = (date) => {
    if (!date) return '';
    
    let dateObj;
    
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      console.warn("Invalid date format:", date);
      return '';
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn("Invalid date:", date);
      return '';
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  return (
    <div style={formStyles.overlay}>
      <div style={formStyles.form}>
        <div style={formStyles.header}>
          <h3 style={formStyles.title}>Edit Task</h3>
          <button style={formStyles.closeButton} onClick={handleClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Task Name */}
          <div style={formStyles.field}>
            <label style={formStyles.label} htmlFor="text">Task Name</label>
            <input
              style={formStyles.input}
              type="text"
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Task Type */}
          <div style={formStyles.field}>
            <label style={formStyles.label} htmlFor="type">Task Type</label>
            <select
              style={formStyles.select}
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              {taskTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
          
          {/* Start Date */}
          <div style={formStyles.field}>
            <label style={formStyles.label} htmlFor="start">Start Date</label>
            <input
              style={formStyles.input}
              type="date"
              id="start"
              name="start"
              value={formatDateForInput(formData.start)}
              onChange={(e) => {
                // Convert input value to Date object
                if (e.target.value) {
                  const date = new Date(e.target.value);
                  if (!isNaN(date.getTime())) {
                    console.log("Setting start date:", date);
                    setFormData({
                      ...formData,
                      start: date
                    });
                  } else {
                    console.warn("Invalid date input:", e.target.value);
                  }
                }
              }}
              required
            />
          </div>
          
          {/* Duration */}
          <div style={formStyles.field}>
            <label style={formStyles.label} htmlFor="duration">Duration (days)</label>
            <input
              style={formStyles.input}
              type="number"
              id="duration"
              name="duration"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Progress */}
          <div style={formStyles.field}>
            <label style={formStyles.label} htmlFor="progress">Progress</label>
            <div style={formStyles.progressContainer}>
              <input
                style={formStyles.progressSlider}
                type="range"
                id="progress"
                name="progress"
                min="0"
                max="100"
                step="5"
                value={formData.progress}
                onChange={handleProgressChange}
              />
              <span style={formStyles.progressValue}>{formData.progress}%</span>
            </div>
          </div>
          
          {/* Open/Collapsed (for summary tasks) */}
          {formData.type === 'summary' && (
            <div style={formStyles.field}>
              <label>
                <input
                  type="checkbox"
                  name="open"
                  checked={formData.open}
                  onChange={handleChange}
                />
                {' '}Show subtasks
              </label>
            </div>
          )}
          
          {/* Action Buttons */}
          <div style={formStyles.buttons}>
            <button 
              type="button" 
              style={{...formStyles.button, ...formStyles.deleteButton}}
              onClick={handleDelete}
            >
              Delete
            </button>
            <button 
              type="button" 
              style={{...formStyles.button, ...formStyles.cancelButton}}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{...formStyles.button, ...formStyles.saveButton}}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;