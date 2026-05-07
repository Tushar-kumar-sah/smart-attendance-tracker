import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

import "../styles/layout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-section">
        <Navbar />

        <div className="page-content">
          {children}
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;