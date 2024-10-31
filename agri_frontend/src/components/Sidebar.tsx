import Link from "next/link";

const Sidebar = () => (
  <div className="sidebar">
    <h2>Agriculture</h2>
    <ul>
      <li>
        <Link href="/dashboard">Home</Link>
      </li>
      <li>
        <Link href="/crop-prediction">Crop Prediction</Link>
      </li>
      <li>
        <Link href="/soil-health">Soil Health</Link>
      </li>
      <li>
        <Link href="/pest-prediction">Pest Prediction</Link>
      </li>
      <li>
        <Link href="/real-time-monitoring/climate-history">
          Climate History
        </Link>
      </li>
      <li>
        <Link href="/real-time-monitoring/price-history">Price History</Link>
      </li>
      <li>
        <Link href="/real-time-monitoring/production">Production</Link>
      </li>
      <li>
        <Link href="/managing/camera">Camera</Link>
      </li>
      <li>
        <Link href="/managing/stocks-works">Stocks/Works</Link>
      </li>
      <li>
        <Link href="/managing/labourer">Labourer</Link>
      </li>
    </ul>
  </div>
);

export default Sidebar;
