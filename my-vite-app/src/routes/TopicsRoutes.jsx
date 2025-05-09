// src/routes/TopicsRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// The main Topics overview component
import Topic from '../Page/Home/Topic';

// Import any individual topic pages
import Productivity from '../Page/Topics/Productivity/Productivity';
import ProductProcess from '../Page/Topics/ProductProcess/ProductProcess';
import MoonshineOfflineSustainin from '../Page/Topics/Moonshine & Offline Sustaining/MoonshineOfflineSustainin';
import InfraStandardization from '../Page/Topics/Infra & Standardization/InfraStandardization'

const TopicsRoutes = () => {
  return (
    <Routes>
      {/* topics, show the Topic (overview) page */}
      <Route index element={<Topic />} />

      {/* topics/productivity, show the Productivity page */}
      <Route path="productivity" element={<Productivity />} />
      <Route path="productProcess" element={<ProductProcess />} />
      <Route path="MoonshineOfflineSustainin" element={<MoonshineOfflineSustainin />} />
      <Route path="InfraStandardization" element={<InfraStandardization />} />


    </Routes>
  );
};

export default TopicsRoutes;
