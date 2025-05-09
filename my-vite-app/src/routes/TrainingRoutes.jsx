// src/routes/TrainingRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Training from '../Page/Home/Training';
import Workday from '../Page/Training/Workday/Workday';
import TCCS from '../Page/Training/TCCS/TCCS';
import Webinar from '../Page/Training/Webinar/Webinar';
import EJabilization from '../Page/Training/e-Jabilization/EJabilization';

const TrainingRoutes = () => {
  return (
    <Routes>
      {/* /training => overview page */}
      <Route index element={<Training />} />
      
      {/* /training/workday => <Workday/> in Training.jsx trainings route cll this path  */}
      <Route path="workday" element={<Workday />} />
      <Route path="tccs" element={<TCCS />} />
      <Route path="webinar" element={<Webinar />} />
      <Route path="e-jabilization" element={<EJabilization />} />
    </Routes>
  );
};

export default TrainingRoutes;
