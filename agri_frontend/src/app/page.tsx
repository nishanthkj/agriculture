import Link from "next/link";

const Home = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Agriculture AI Dashboard</h1>
        <p>
          Empowering farmers and agricultural stakeholders with AI-driven
          insights.
        </p>
      </header>
      <main style={styles.mainContent}>
        <section style={styles.features}>
          <h2>Key Features</h2>
          <ul>
            <li>
              <Link href="/crop-prediction">Crop Prediction</Link>: AI-driven
              suggestions for optimal crop selection.
            </li>
            <li>
              <Link href="/soil-health">Soil Health Monitoring</Link>: Real-time
              soil health analysis via IoT sensors.
            </li>
            <li>
              <Link href="/pest-prediction">Pest Prediction</Link>: Predictive
              insights on pest risks for proactive management.
            </li>
            <li>
              <Link href="/real-time-monitoring/climate-history">
                Climate & Price History
              </Link>
              : Historical data for informed decision-making.
            </li>
          </ul>
        </section>
        <section style={styles.cta}>
          <h2>Get Started</h2>
          <p>
            Sign up now to access all features and improve your agricultural
            practices.
          </p>
          <Link href="/auth/register">
            <span style={styles.signupButton}>Sign Up</span>
          </Link>
        </section>
      </main>
      <footer style={styles.footer}>
        <p>&copy; 2024 Neuro Kode. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center" as "center",
    marginBottom: "20px",
  },
  mainContent: {
    width: "100%",
    maxWidth: "800px",
  },
  features: {
    margin: "20px 0",
  },
  link: {
    color: "#0070f3",
    textDecoration: "none",
  },
  cta: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    textAlign: "center" as "center",
  },
  signupButton: {
    padding: "10px 20px",
    backgroundColor: "#0070f3",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  footer: {
    marginTop: "auto",
    textAlign: "center" as "center",
    padding: "20px 0",
    borderTop: "1px solid #eaeaea",
    width: "100%",
  },
};

export default Home;
