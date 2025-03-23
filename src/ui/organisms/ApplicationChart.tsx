import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ReportData } from "../interface/Report";
import { cargoTypesData } from "../../utils/masterData"; // Pastikan path sesuai

interface Props {
  reports: ReportData[];
}

const ApplicationChart: React.FC<Props> = ({ reports }) => {
  // Mengelompokkan data berdasarkan application dan menghitung jumlahnya
  const dataMap = reports.reduce((acc: Record<string, number>, report) => {
    const key = report.application || "Others";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Membuat chartData berdasarkan seluruh kategori dari cargoTypesData
  const chartData = cargoTypesData.map((cargoType) => ({
    name: cargoType,
    count: dataMap[cargoType] || 0,
  }));

  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4">Aplikasi (Cargo Types)</h2>
      <BarChart
        layout="vertical"
        width={900} // Lebar grafik ditambah agar label tidak terpotong
        height={chartData.length * 50} // Tinggi grafik disesuaikan dengan jumlah data
        data={chartData}
        margin={{ top: 20, right: 30, left: 180, bottom: 20 }} // Margin kiri ditingkatkan agar label terlihat jelas
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" allowDecimals={false} />
        <YAxis dataKey="name" type="category" width={180} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default ApplicationChart;
