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
import { problemCategoriesData } from "../../utils/masterData";

interface Props {
  reports: ReportData[];
}

const LargeClassificationChart: React.FC<Props> = ({ reports }) => {
  // Mengelompokkan data berdasarkan largeClassification dan menghitung jumlahnya
  const dataMap = reports.reduce((acc: Record<string, number>, report) => {
    const key = report.largeClassification || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Membuat chartData berdasarkan seluruh kategori dari problemCategoriesData
  const chartData = problemCategoriesData.map((category) => ({
    name: category,
    count: dataMap[category] || 0,
  }));

  return (
      <ResponsiveContainer height={300}>
        <BarChart
          layout="vertical"
          width={400}
          height={chartData.length * 50}
          data={chartData}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" width={150} interval={0} />
          <Tooltip />
          <Bar dataKey="count" fill="#CE1212" />
        </BarChart>
      </ResponsiveContainer>
  );
};

export default LargeClassificationChart;
