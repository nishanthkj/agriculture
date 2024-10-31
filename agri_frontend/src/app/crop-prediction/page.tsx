"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const CropPrediction = () => {
  const [cropData, setCropData] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/crop-prediction/`)
      .then((response) => setCropData(response.data))
      .catch((error) =>
        console.error("Error fetching crop prediction data:", error)
      );
  }, []);

  return (
    <div>
      <h1>Crop Prediction</h1>
      <ul>
        {cropData.map((crop, index) => (
          <li key={index}>
            {crop.name} - {crop.prediction}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CropPrediction;
