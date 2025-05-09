import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from '../Page/Home/Home';
//import About from '../Page/About/About';
import Contact from '../Page/Home/Contact';
import Topic from '../Page/Home/Topic';
import Login from '../Page/Auth/Login';
import RegisterPage from '../Page/Auth/Register';
import GanttView from '../Page/Gantt/GanttView';
import AdminRoutes from './AdminRoutes';  // Import AdminRoutes
import { useAuth } from '../Page/Auth/AuthContext';

// Protected route component for admin routes
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // During development, you can bypass auth check - remove for production
  if (import.meta.env.DEV) {
    return children;
  }
  
  // In production, properly check authentication
  return isAuthenticated ? children : <Navigate to="/ieportal/login" replace />;
};

const MainRoutes = ({ basePath = '', loginKey = 0 }) => {
  const location = useLocation();
  const { handleLoginSuccess } = useAuth();

  // Fixed getBasePath function that returns the proper base path
  const getBasePath = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[1] === 'ieportal' ? '/ieportal' : '';
  };
  
  const currentBasePath = getBasePath();

  return (
    <Routes>
      {/* Base redirects */}
      <Route path="/" element={<Navigate to={`${currentBasePath}/login`} replace />} />
      <Route path="/ieportal" element={<Navigate to={`${currentBasePath}/login`} replace />} />
      
      {/* Main routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/ieportal/home" element={<Home />} />
      
      {/*
      <Route path="/about" element={<About />} />
      <Route path="/ieportal/about" element={<About />} /> */}
      
      <Route path="/contact" element={<Contact />} />
      <Route path="/ieportal/contact" element={<Contact />} />
      
      <Route path="/topics" element={<Topic />} />
      <Route path="/ieportal/topics" element={<Topic />} />
      
      <Route path="/gantt" element={<GanttView />} />
      <Route path="/ieportal/gantt" element={<GanttView />} />
      
      {/* Admin routes - these are now properly connected */}
      <Route path="/admin/*" element={
        <ProtectedAdminRoute>
          <AdminRoutes />
        </ProtectedAdminRoute>
      } />
      <Route path="/ieportal/admin/*" element={
        <ProtectedAdminRoute>
          <AdminRoutes />
        </ProtectedAdminRoute>
      } />
      
      {/* Login routes with force remount via key */}
      <Route path="/login" element={
        <Login 
          key={`login-${loginKey}`}
          onLoginSuccess={() => {
            if (handleLoginSuccess) handleLoginSuccess();
          }} 
        />
      } />
      <Route path="/ieportal/login" element={
        <Login 
          key={`ieportal-login-${loginKey}`}
          onLoginSuccess={() => {
            if (handleLoginSuccess) handleLoginSuccess();
          }} 
        />
      } />
      
      {/* Registration */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/ieportal/register" element={<RegisterPage />} />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to={`${currentBasePath}/login`} replace />} />
    </Routes>
  );
};

export default MainRoutes;