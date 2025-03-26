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
import { segmentData } from "../../utils/masterData"; // Pastikan path sesuai

interface Props {
  reports: ReportData[];
}

const SegmentChart: React.FC<Props> = ({ reports }) => {
  // Mengelompokkan data berdasarkan segment dan menghitung jumlahnya
  const dataMap = reports.reduce((acc: Record<string, number>, report) => {
    // Gunakan "Others" jika tidak ada nilai segment, atau bisa disesuaikan sesuai kebutuhan
    const key = report.segment || "Others";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Membuat chartData berdasarkan seluruh kategori dari segmentData
  const chartData = segmentData
    .map((segment) => ({
      name: segment,
      count: dataMap[segment] || 0,
    }))
    // Memfilter data agar hanya yang memiliki count >= 1 yang ditampilkan
    .filter((item) => item.count >= 1);

  return (
    <div className="rounded-lg md:flex-1 w-full md:mt-0 mt-8 bg-slate-100 md:px-0 px-4">
      <h3 className="text-xl font-semibold text-left p-5">Problem Segment</h3>
      <ResponsiveContainer className={"pr-8 "} width="100%" height={300}>
        <BarChart
          layout="vertical"
          width={400} // Lebar grafik ditambah agar label tidak terpotong
          height={chartData.length * 50} // Tinggi grafik disesuaikan dengan jumlah data
          data={chartData}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="count" fill="#CE1212" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SegmentChart;
