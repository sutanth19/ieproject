import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Home from '../Page/Home/Home';
import Topic from '../Page/Home/Topic';
import Login from '../Page/Auth/Login';
import RegisterPage from '../Page/Auth/Register';
import GanttView from '../Page/Gantt/GanttView';
import ProjectList from '../Page/Gantt/List';
import Maintenance from '../Page/Maintenance/Maintenance';
import AdminRoutes from './AdminRoutes';
import GenericTopics from '../Page/Topics/GenericTopics';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  return <>{children}</>;
};

interface MainRoutesProps {
  loginKey?: number;
}

const MainRoutes: React.FC<MainRoutesProps> = ({ loginKey = 0 }) => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/topics" element={<Topic />} />
      <Route path="/topics/:topicId" element={<GenericTopics />} />
      <Route path="/gantt" element={<GanttView />} />
      <Route path="/project/list" element={<ProjectList />} />
      <Route path="/project/gantt" element={<GanttView />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedAdminRoute>
            <AdminRoutes />
          </ProtectedAdminRoute>
        }
      />
      <Route path="/login" element={ <Login  key={`login-${loginKey}`} onLoginSuccess={() => {
        console.log('Login successful');
      }}
            />
          }
        />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default MainRoutes;
