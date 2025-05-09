import React, { useState } from 'react';
import { useTheme } from '../../context_themes/ThemeContext';
import { motion } from 'framer-motion';

const Contact = ({ onClose }) => {
  const { darkMode } = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Close modal handler
  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };
  
  // Click outside to close (optional)
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      showNotification('error', 'Please complete all fields');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showNotification('error', 'Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('success', 'Message sent successfully');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      showNotification('error', 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };
  
  // Theme colors
  const colors = {
    background: darkMode ? '#0a192f' : '#f0f4f8',
    modalBg: darkMode ? '#172a46' : '#ffffff',
    inputBg: darkMode ? '#1d3557' : '#f8fafc',
    text: darkMode ? '#e6f1ff' : '#334155',
    label: darkMode ? '#a8b2d1' : '#64748b',
    inputBorder: darkMode ? '#3a506b' : '#e2e8f0',
    inputFocusBorder: darkMode ? '#64ffda' : '#3b82f6',
    buttonBg: darkMode ? '#0ea5e9' : '#2563eb',
    buttonHover: darkMode ? '#38bdf8' : '#3b82f6',
    success: '#10b981',
    error: '#ef4444'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif"
      }}
      onClick={handleOutsideClick}
    >
      <motion.div
        style={{
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: colors.modalBg,
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks from closing modal
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: `1px solid ${darkMode ? '#2d3748' : '#e2e8f0'}`
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: 600,
            color: colors.text,
            margin: 0
          }}>
            Contact Us
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.label,
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>
        
        {/* Form content - with scrollable area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="name"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: colors.label
                }}
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder=" name"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '15px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: colors.text,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.inputFocusBorder;
                  e.target.style.boxShadow = `0 0 0 2px ${darkMode ? 'rgba(100, 255, 218, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.inputBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: colors.label
                }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=".email@example.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '15px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: colors.text,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.inputFocusBorder;
                  e.target.style.boxShadow = `0 0 0 2px ${darkMode ? 'rgba(100, 255, 218, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.inputBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="message"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: colors.label
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                rows="5"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '15px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: colors.text,
                  transition: 'all 0.2s ease',
                  resize: 'vertical',
                  minHeight: '100px',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.inputFocusBorder;
                  e.target.style.boxShadow = `0 0 0 2px ${darkMode ? 'rgba(100, 255, 218, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.inputBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                background: colors.buttonBg,
                color: 'white',
                fontWeight: 500,
                fontSize: '15px',
                border: 'none',
                borderRadius: '6px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = colors.buttonHover;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = colors.buttonBg;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isSubmitting ? (
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      marginRight: '8px',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </motion.div>
      
      {/* Notification */}
      {notification.show && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: notification.type === 'success' ? colors.success : colors.error,
            color: 'white',
            padding: '10px 16px',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {notification.message}
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};


export default Contact;