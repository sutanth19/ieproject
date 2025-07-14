// src/Page/Admin/AdminTraining/AdminTCCS/AdminTCCS.tsx
import React from "react";
import AdminTrainingCarousel from "../AdminTrainingSharedComponent/AdminTrainingCarousel/AdminTrainingCarousel";

const AdminWebinar: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Webinar Admin Page</h2>
      <AdminTrainingCarousel trainingType="Webinar" />
    </div>
  );
};

export default AdminWebinar;