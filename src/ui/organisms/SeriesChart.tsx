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
import { seriesData } from "../../utils/masterData"; // Pastikan path sesuai

interface Props {
  reports: ReportData[];
}

const SeriesChart: React.FC<Props> = ({ reports }) => {
  // Mengelompokkan data laporan berdasarkan properti series
  const dataMap = reports.reduce((acc: Record<string, number>, report) => {
    const key = report.series || "Others";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Membuat chartData berdasarkan seluruh kategori dari seriesData
  const chartData = seriesData.map((series) => ({
    name: series,
    count: dataMap[series] || 0,
  }));
  
  return (
    <div className="rounded-lg flex-1 bg-slate-100">
      <h3 className="text-xl font-semibold text-left p-5">Series Problem</h3>
      <ResponsiveContainer className={"p-4 pr-8 pl-0"} width={"100%"} height={300}>
        <BarChart data={chartData}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="count" fill="#CE1212" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeriesChart;
