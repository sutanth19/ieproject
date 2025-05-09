// src/Page/Admin/AdminTraining/Admine-Jabilization/AdminEJabilization.jsx
import React from "react";
import AdminTrainingCarousel from "../AdminTrainingSharedComponent/AdminTrainingCarousel/AdminTrainingCarousel";

const AdminTCCS = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>TCCS Admin Page</h2>
      <AdminTrainingCarousel trainingType="TCCS" />
    </div>
  );
};

export default AdminTCCS;
