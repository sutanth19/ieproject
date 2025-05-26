import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from '../Page/Home/Home';
import Contact from '../Page/Home/Contact';
import Topic from '../Page/Home/Topic';
import Login from '../Page/Auth/Login';
import RegisterPage from '../Page/Auth/Register';
import GanttView from '../Page/Gantt/GanttView';
import AdminRoutes from './AdminRoutes';
import Maintenance from '../Page/Maintenance/Maintenance';


const ProtectedAdminRoute = ({ children }) => {
  return children;
};

const MainRoutes = ({ loginKey = 0 }) => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* Main routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/topics" element={<Topic />} />
      <Route path="/gantt" element={<GanttView />} />
      
      {/* Project routes */}
      <Route path="/project/list" element={<div>Project List Page</div>} />
      <Route path="/project/gantt" element={<GanttView />} />
      
      <Route path="/admin/*" element={
        <ProtectedAdminRoute>
          <AdminRoutes />
        </ProtectedAdminRoute>
      } />
      
      <Route path="/login" element={
        <Login 
          key={`login-${loginKey}`}
        />
      } />
      
      {/* Registration */}
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/maintenance" element={<Maintenance />} />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default MainRoutes;