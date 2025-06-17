import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import maintenanceAnimation from './maintenance.json';

const Maintenance = () => {
  useEffect(() => {
    // Lock scroll only when this component is mounted
    document.body.style.overflow = 'hidden';

    return () => {
      // Re-enable scroll when leaving the page
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
        paddingTop: '80px', // ✅ Push content down below nav bar
        boxSizing: 'border-box',
        gap: '20px' // ✅ Add spacing between elements
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
