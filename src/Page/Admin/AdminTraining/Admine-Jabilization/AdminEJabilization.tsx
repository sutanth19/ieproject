// src/Page/Admin/AdminTraining/Admine-Jabilization/AdminEJabilization.jsx
import React from "react";
import AdminTrainingCarousel from "../AdminTrainingSharedComponent/AdminTrainingCarousel/AdminTrainingCarousel";

const AdminEJabilization = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>e-Jabilization Admin Page</h2>
      <AdminTrainingCarousel trainingType="EJABILIZATION" />
    </div>
  );
};

export default AdminEJabilization;
