import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReportData {
  problemDate: string; // Contoh: "2025-03-22"
  unitInvolves?: {
    VIN: string;
    mileage: string;
  }[];
}

interface TimeSeriesCasesLineChartProps {
  reports: ReportData[];
}

const TimeSeriesCasesLineChart: React.FC<TimeSeriesCasesLineChartProps> = ({ reports }) => {
  // Agregasi data: Kelompokkan laporan berdasarkan tanggal dan hitung total kasus
  const data = useMemo(() => {
    const grouped: Record<string, number> = {};
    reports.forEach((report) => {
      const date = report.problemDate;
      if (!date) return;
      
      // Jika terdapat data unitInvolves, hitung jumlah unit, jika tidak ada, hitung 1
      const count = report.unitInvolves && Array.isArray(report.unitInvolves) && report.unitInvolves.length > 0
        ? report.unitInvolves.length
        : 1;
      
      grouped[date] = (grouped[date] || 0) + count;
    });

    // Ubah objek grouped menjadi array untuk Recharts
    const result = Object.entries(grouped).map(([date, total]) => ({
      date,
      total,
    }));

    // Urutkan data berdasarkan tanggal ascending
    result.sort((a, b) => a.date.localeCompare(b.date));
    return result;
  }, [reports]);

  return (
    <div className="px-8 py-4 rounded-lg w-full bg-slate-100">
      <h3 className="text-xl font-semibold text-left px-8 py-6">Time to Time Problem</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(dateStr) => {
              const dateObj = new Date(dateStr);
              const day = dateObj.getDate();
              const month = dateObj.toLocaleString("id-ID", { month: "short" });
              return `${day} ${month}`;
            }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#CE1212"
            fill="#CE1212"
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesCasesLineChart;
