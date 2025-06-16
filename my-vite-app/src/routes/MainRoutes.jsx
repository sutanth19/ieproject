import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Pages
import Home from '../Page/Home/Home';
import Contact from '../Page/Home/Contact';
import Topic from '../Page/Home/Topic';
import Login from '../Page/Auth/Login';
import RegisterPage from '../Page/Auth/Register';
import GanttView from '../Page/Gantt/GanttView';
import ProjectList from '../Page/Gantt/List';
import Maintenance from '../Page/Maintenance/Maintenance';

// Admin routes
import AdminRoutes from './AdminRoutes';

// Dynamic topic detail page
import GenericTopics from './../Page/Topics/GenericTopics';



// Protected route wrapper (if needed later)
const ProtectedAdminRoute = ({ children }) => {
  return children;
};

const MainRoutes = ({ loginKey = 0 }) => {
  const location = useLocation();

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      {/* Topics overview and dynamic topic detail */}
      <Route path="/topics" element={<Topic />} />
      <Route path="/topics/:topicId" element={<GenericTopics />} /> 

      {/* Project and Gantt routes */}
      <Route path="/gantt" element={<GanttView />} />
      <Route path="/project/list" element={<ProjectList />} />
      <Route path="/project/gantt" element={<GanttView />} />

      {/* Admin routes */}
      <Route path="/admin/*" element={
        <ProtectedAdminRoute>
          <AdminRoutes />
        </ProtectedAdminRoute>
      } />

      {/* Auth */}
      <Route path="/login" element={<Login key={`login-${loginKey}`} />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Maintenance */}
      <Route path="/maintenance" element={<Maintenance />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default MainRoutes;
