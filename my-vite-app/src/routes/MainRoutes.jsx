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

// Protected route component for admin routes only
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // During development, you can bypass auth check - remove for production
  if (import.meta.env.DEV) {
    return children;
  }
  
  // In production, redirect to home if not authenticated
  return isAuthenticated ? children : <Navigate to="/home" replace />;
};

const MainRoutes = ({ loginKey = 0 }) => {
  const location = useLocation();
  const { handleLoginSuccess } = useAuth();

  return (
    <Routes>
      {/* Base redirect - now redirects to home page instead of login */}
      <Route path="/" element={<Home />} />
      
      {/* Main routes - no need to duplicate with /ieportal prefix since BrowserRouter handles that */}
      <Route path="/home" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/topics" element={<Topic />} />
      <Route path="/gantt" element={<GanttView />} />
      
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
          onLoginSuccess={() => {
            if (handleLoginSuccess) handleLoginSuccess();
          }} 
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