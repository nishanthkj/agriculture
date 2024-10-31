import { useEffect } from "react";

interface GaugeProps {
  value: number;
  maxValue: number;
}

const Gauge: React.FC<GaugeProps> = ({ value, maxValue }) => {
  useEffect(() => {
    // Logic to initialize the gauge, e.g., using a library
  }, [value, maxValue]);

  return (
    <div className="gauge">
      <p>{`Soil Moisture: ${value}/${maxValue}`}</p>
      {/* Placeholder for gauge visualization */}
      <div
        className="gauge-display"
        style={{ width: `${(value / maxValue) * 100}%` }}
      />
    </div>
  );
};

export default Gauge;
