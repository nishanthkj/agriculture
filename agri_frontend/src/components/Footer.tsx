// components/Footer.tsx

import React from "react";

const styles = {
  footer: {
    backgroundColor: "#f6f1ff",
    color: "#3e3e52",
    padding: "20px",
    textAlign: "center" as "center",
    position: "absolute" as "absolute",
    bottom: 0,
    top: "auto",
    width: "100%",
    borderTop: "1px solid #ddd",
  },
  footerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as "wrap",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  footerLinks: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    gap: "15px",
  },
  footerLink: {
    textDecoration: "none",
    color: "#3e3e52",
    transition: "color 0.3s",
  },
  footerLinkHover: {
    color: "#0070f3",
  },
  copyright: {
    fontSize: "0.9rem",
    color: "#888",
  },
};

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <ul style={styles.footerLinks}>
          <li>
            <a href="#" style={styles.footerLink}>
              About
            </a>
          </li>
          <li>
            <a href="#" style={styles.footerLink}>
              Contact
            </a>
          </li>
          <li>
            <a href="#" style={styles.footerLink}>
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" style={styles.footerLink}>
              Terms of Service
            </a>
          </li>
        </ul>
        <p style={styles.copyright}>
          © {new Date().getFullYear()} Neuro Kode. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
