"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaSeedling,
  FaHeart,
  FaTrash,
  FaFolderOpen,
  FaCamera,
  FaBoxes,
  FaUser,
} from "react-icons/fa";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
  },
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "60px",
    backgroundColor: "#0070f3",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    zIndex: 1000,
  },
  navbarLeft: {
    display: "flex",
    alignItems: "center",
  },
  navbarTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginLeft: "10px",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#f6f1ff",
    padding: "20px",
    color: "#3e3e52",
    height: "calc(100vh - 60px)",
    position: "fixed",
    top: "60px",
    left: 0,
    overflowY: "auto",
    transition: "transform 0.3s ease-in-out",
    zIndex: 1000,
  },
  sidebarClosed: {
    transform: "translateX(-100%)",
  },
  toggleButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  navList: {
    listStyle: "none",
    padding: 0,
  },
  navItem: {
    marginBottom: "10px",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#3e3e52",
    padding: "8px",
    borderRadius: "8px",
    transition: "background-color 0.3s",
  },
  navLinkActive: {
    backgroundColor: "#e3d9ff",
  },
  icon: {
    marginRight: "10px",
    fontSize: "18px",
  },
  badge: {
    marginLeft: "auto",
    backgroundColor: "#e3d9ff",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
  },
  sectionTitle: {
    margin: "20px 0 10px",
    fontWeight: "bold",
    color: "#6e6e80",
  },
  mainContent: {
    marginLeft: "250px", // Space for sidebar
    padding: "20px",
    paddingTop: "80px", // Space for navbar
    transition: "margin-left 0.3s ease-in-out",
  },
  mainContentSidebarClosed: {
    marginLeft: "60px", // Adjusted for collapsed sidebar
  },
};

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navbarLeft}>
          <button style={styles.toggleButton} onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 style={styles.navbarTitle}>Neuro Kode</h1>
        </div>
      </div>

      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebar,
          ...(isSidebarOpen ? {} : styles.sidebarClosed),
        }}
      >
        <h2 style={styles.sidebarTitle}>Agriculture</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link href="/" style={styles.navLink}>
              <FaHome style={styles.icon} />
              Home <span style={styles.badge}>24</span>
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/crop-prediction" style={styles.navLink}>
              <FaSeedling style={styles.icon} />
              Crop Prediction
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/soil-health" style={styles.navLink}>
              <FaHeart style={styles.icon} />
              Soil Health
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/pest-prediction" style={styles.navLink}>
              <FaTrash style={styles.icon} />
              Pest Prediction
            </Link>
          </li>

          <li style={styles.sectionTitle}>Real Time Monitoring</li>
          <li style={styles.navItem}>
            <Link href="/climate-history" style={styles.navLink}>
              <FaFolderOpen style={styles.icon} />
              Climate History
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/price-history" style={styles.navLink}>
              <FaFolderOpen style={styles.icon} />
              Price History
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/production" style={styles.navLink}>
              <FaFolderOpen style={styles.icon} />
              Production
            </Link>
          </li>

          <li style={styles.sectionTitle}>Managing</li>
          <li style={styles.navItem}>
            <Link href="/camera" style={styles.navLink}>
              <FaCamera style={styles.icon} />
              Camera
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/stocks" style={styles.navLink}>
              <FaBoxes style={styles.icon} />
              Stocks/Works
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/labourer" style={styles.navLink}>
              <FaUser style={styles.icon} />
              Labourer
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        style={{
          ...styles.mainContent,
          ...(isSidebarOpen ? {} : styles.mainContentSidebarClosed),
        }}
      ></div>
    </div>
  );
};

export default SidebarLayout;
