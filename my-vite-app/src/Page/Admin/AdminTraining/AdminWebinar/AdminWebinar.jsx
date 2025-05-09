// src/Page/Admin/AdminTraining/AdminTCCS/AdminTCCS.jsx
import React from "react";
import AdminTrainingCarousel from "../AdminTrainingSharedComponent/AdminTrainingCarousel/AdminTrainingCarousel";

const AdminWebninar = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Webinar Admin Page</h2>
      <AdminTrainingCarousel trainingType="Webinar" />
    </div>
  );
};

export default AdminWebninar;
