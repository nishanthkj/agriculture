// src/components/Climate/Climate.jsx
"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Climate = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"], // Example data labels (months)
    datasets: [
      {
        label: "Temperature (°C)",
        data: [22, 24, 21, 23, 25, 27], // Example temperature data
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        tension: 0.1,
      },
      {
        label: "Rainfall (mm)",
        data: [10, 20, 30, 40, 25, 35], // Example rainfall data
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)", // Line color
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Climate History Data",
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

export default Climate;
