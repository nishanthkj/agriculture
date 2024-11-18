// src/components/Price/Price.jsx
"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Price = () => {
  const data = {
    labels: ["2021 Q1", "2021 Q2", "2021 Q3", "2021 Q4", "2022 Q1", "2022 Q2"], // Example data labels (quarters)
    datasets: [
      {
        label: "Price ($)",
        data: [150, 200, 180, 210, 190, 220], // Example price data
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Price History Data",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default Price;
