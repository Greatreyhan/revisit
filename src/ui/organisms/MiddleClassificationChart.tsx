import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ReportData } from "../interface/Report";

interface Props {
  reports: ReportData[];
}

const MiddleClassificationChart: React.FC<Props> = ({ reports }) => {
  // Mengelompokkan data berdasarkan middleClassification dan menghitung jumlahnya
  const dataMap = reports.reduce((acc: Record<string, number>, report) => {
    const key = report.middleClassification || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Konversi dataMap ke array untuk grafik
  const chartData = Object.keys(dataMap).map((key) => ({
    name: key,
    count: dataMap[key],
  }));

  return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          width={400}
          height={chartData.length * 50}
          data={chartData}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="count" fill="#CE1212" />
        </BarChart>
      </ResponsiveContainer>
  );
};

export default MiddleClassificationChart;
