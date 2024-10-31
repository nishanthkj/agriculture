import { Line } from "react-chartjs-2";

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="chart">
      <Line data={data} />
    </div>
  );
};

export default Chart;
