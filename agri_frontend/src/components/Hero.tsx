// components/HeroSection.tsx

"use client"; // Declares this as a Client Component

import React, { useState } from "react";

const styles = {
  hero: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh", // Adjusted to fit the entire viewport height
    backgroundColor: "#0070f3",
    color: "white",
    padding: "20px",
    textAlign: "center" as "center",
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "bold" as "bold",
    marginBottom: "10px",
  },
  subheading: {
    fontSize: "1.25rem",
    marginBottom: "20px",
  },
  ctaButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    color: "#0070f3",
    backgroundColor: "white",
    borderRadius: "8px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    fontWeight: "bold" as "bold",
  },
};

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section style={styles.hero}>
      <h1 style={styles.heading}>Welcome to Neuro Kode</h1>
      <p style={styles.subheading}>
        Discover insights, data-driven solutions, and transformative AI for
        agriculture.
      </p>
      <a
        href="#get-started"
        style={{
          ...styles.ctaButton,
          backgroundColor: isHovered ? "#005bb5" : "white",
          color: isHovered ? "white" : "#0070f3",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Get Started
      </a>
    </section>
  );
};

export default HeroSection;
