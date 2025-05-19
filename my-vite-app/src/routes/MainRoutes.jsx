import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from '../Page/Home/Home';
import Contact from '../Page/Home/Contact';
import Topic from '../Page/Home/Topic';
import Login from '../Page/Auth/Login';
import RegisterPage from '../Page/Auth/Register';
import GanttView from '../Page/Gantt/GanttView';
import AdminRoutes from './AdminRoutes';

// Simplified route that always allows access
const ProtectedAdminRoute = ({ children }) => {
  return children;
};

const MainRoutes = ({ loginKey = 0 }) => {
  const location = useLocation();

  return (
    <Routes>
      {/* Base redirect - now redirects to home page instead of login */}
      <Route path="/" element={<Home />} />
      
      {/* Main routes - regular paths */}
      <Route path="/home" element={<Home />} />
      <Route path="/topics" element={<Topic />} />
      <Route path="/gantt" element={<GanttView />} />
      
      {/* Project routes */}
      <Route path="/project/list" element={<div>Project List Page</div>} />
      <Route path="/project/gantt" element={<GanttView />} />
      
      {/* Admin routes */}
      <Route path="/admin/*" element={
        <ProtectedAdminRoute>
          <AdminRoutes />
        </ProtectedAdminRoute>
      } />
      
      {/* Login routes with force remount via key */}
      <Route path="/login" element={
        <Login 
          key={`login-${loginKey}`}
        />
      } />
      
      {/* Registration */}
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Catch all - redirect to home page instead of login */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default MainRoutes;