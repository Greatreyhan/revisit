import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sesuaikan tipe data report sesuai data yang difilter
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
  // Agregasi data: Kelompokkan laporan berdasarkan tanggal dan hitung jumlah kasus per kategori unit (berdasarkan VIN)
  const data = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};
    reports.forEach((report) => {
      const date = report.problemDate;
      if (!date) return;

      if (!grouped[date]) {
        grouped[date] = {};
      }

      // Jika terdapat data unitInvolves, hitung per kategori unit
      if (report.unitInvolves && Array.isArray(report.unitInvolves) && report.unitInvolves.length > 0) {
        report.unitInvolves.forEach((unit) => {
          const unitKey = unit.VIN || "Unknown";
          grouped[date][unitKey] = (grouped[date][unitKey] || 0) + 1;
        });
      } else {
        // Jika tidak ada unit, tambahkan kategori "No Unit"
        grouped[date]["No Unit"] = (grouped[date]["No Unit"] || 0) + 1;
      }
    });

    // Ubah objek grouped menjadi array yang dapat diproses oleh Recharts
    const result = Object.entries(grouped).map(([date, unitCounts]) => ({
      date,
      ...unitCounts,
    }));

    // Urutkan data berdasarkan tanggal ascending
    result.sort((a, b) => a.date.localeCompare(b.date));
    return result;
  }, [reports]);

  // Ambil daftar kategori unit (berdasarkan VIN) secara unik
  const unitNames = useMemo(() => {
    const unitsSet = new Set<string>();
    reports.forEach((report) => {
      if (report.unitInvolves && Array.isArray(report.unitInvolves) && report.unitInvolves.length > 0) {
        report.unitInvolves.forEach((unit) => {
          const unitKey = unit.VIN || "Unknown";
          unitsSet.add(unitKey);
        });
      } else {
        unitsSet.add("No Unit");
      }
    });
    return Array.from(unitsSet);
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
          {unitNames.map((unit) => (
            <Area
              key={unit}
              type="monotone"
              dataKey={unit}
              stroke="#CE1212"
              fill="#CE1212"
              activeDot={{ r: 8 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesCasesLineChart;
