import React from "react";
import { motion } from "framer-motion";
import "../../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      {/* Animated Background */}
      <div className="floating-circle circle1"></div>
      <div className="floating-circle circle2"></div>
      <div className="floating-circle circle3"></div>

      {/* NAVBAR */}
      <motion.nav
        className="landing-navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="brand-section">
          <img src="/ctcs-logo.png" alt="CTCS Logo" className="landing-logo" />

          <div>
            <h2>Central Tax Collection System</h2>
            <p>Smart Governance Platform</p>
          </div>
        </div>

        <div className="nav-buttons">
          <button className="glass-btn" onClick={() => navigate("/login")}>
            Admin Login
          </button>
          <button className="primary-btn" onClick={() => navigate("/citizen-portal")}>Citizen Portal</button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <div className="hero-section">
        <motion.div
          className="hero-left"
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1>
            Modernizing Municipal Revenue
            <span> Through Intelligent Automation</span>
          </h1>

          <p>
            Enterprise-grade tax assessment, citizen management, payment
            lifecycle, arrears tracking and analytics platform built for smart
            governance.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn large-btn">Launch Dashboard</button>

            <button className="glass-btn large-btn">Explore Features</button>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          className="hero-right"
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="dashboard-card"
            whileHover={{
              scale: 1.03,
              rotate: 1,
            }}
          >
            <div className="dashboard-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>

            <div className="stats-grid">
              <motion.div className="stat-card" whileHover={{ y: -8 }}>
                <h3>₹ 2.4 Cr</h3>
                <p>Total Collection</p>
              </motion.div>

              <motion.div className="stat-card" whileHover={{ y: -8 }}>
                <h3>14,280</h3>
                <p>Citizens</p>
              </motion.div>

              <motion.div className="stat-card" whileHover={{ y: -8 }}>
                <h3>91%</h3>
                <p>Recovery Rate</p>
              </motion.div>

              <motion.div className="stat-card" whileHover={{ y: -8 }}>
                <h3>1,250</h3>
                <p>Pending Demands</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
