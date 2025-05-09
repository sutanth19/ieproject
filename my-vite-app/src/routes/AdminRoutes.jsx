// Updated src/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../Page/Admin/AdminDashboard/AdminDashboard';
import Dashboard from '../Page/Admin/Dashboard/Dashboard';
import Messages from '../Page/Admin/Messages/Messages';

// Import the training pages
import AdminWorkday from '../Page/Admin/AdminTraining/AdminWorkday/AdminWorkday';
import AdminTCCS from '../Page/Admin/AdminTraining/AdminTCCS/AdminTCCS';
import AdminWebinar from '../Page/Admin/AdminTraining/AdminWebinar/AdminWebinar';
import AdminEJabilization from '../Page/Admin/AdminTraining/Admine-Jabilization/AdminEJabilization';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Parent layout route for admin dashboard */}
      <Route path="/" element={<AdminDashboard />}>
        {/* Default route shows Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Other admin routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="messages" element={<Messages />} />

        {/* Training routes */}
        <Route path="trainings">
          <Route path="workday" element={<AdminWorkday />} />
          <Route path="tccs" element={<AdminTCCS />} />
          <Route path="webinar" element={<AdminWebinar />} />
          <Route path="ejabilization" element={<AdminEJabilization />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;