// src/Page/Maintenance/Maintenance.tsx

import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import maintenanceAnimation from './maintenance.json';

const Maintenance: React.FC = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        paddingTop: '80px',
        boxSizing: 'border-box',
        gap: '20px'
      }}
    >
      <Lottie animationData={maintenanceAnimation} style={{ height: 300 }} />
      <h2 style={{ fontSize: '24px', color: '#555' }}>🚧 Page Under Maintenance</h2>
      <p style={{ fontSize: '16px', color: '#555' }}>
        This page is currently under development. Please check back later.
      </p>
    </div>
  );
};

export default Maintenance;
