// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // This is  extracted navbar

function Layout() {
  return (
    <>
      <Navbar />
      {/* 
        React Router will render whatever child routes
        you define in <Routes> inside <Outlet>.
      */}
      <Outlet />
    </>
  );
}

export default Layout;
