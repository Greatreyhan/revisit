import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ReportData } from "../interface/Report";

interface Props {
  reports: ReportData[];
}

const VehicleAgeMileageScatterChart: React.FC<Props> = ({ reports }) => {
  // Membuat data untuk scatter chart
  const data = reports
    .map((report) => {
      // Pastikan productionDate dan problemDate ada
      if (!report.productionDate || !report.problemDate) return null;

      const prodDate = new Date(report.productionDate);
      const probDate = new Date(report.problemDate);

      // Menghitung usia kendaraan dalam hari dan konversi ke bulan (approx. 30 hari per bulan)
      const ageInDays =
        (probDate.getTime() - prodDate.getTime()) / (1000 * 3600 * 24);
      const ageInMonths = ageInDays / 30;

      // Konversi mileage ke number
      const mileage = Number(report.mileage);

      // Validasi nilai
      if (isNaN(ageInMonths) || isNaN(mileage)) return null;

      return { mileage, age: ageInMonths };
    })
    .filter((point) => point !== null) as { mileage: number; age: number }[];

  return (
    <div className="rounded-lg flex-1 bg-slate-100">
      <h3 className="text-xl font-semibold text-left p-5">Problem Segment</h3>
      <ResponsiveContainer className={"px-8 py-4 "} width="100%" height={400}>

        <ScatterChart
          width={800}
          height={400}
          margin={{ top: 20, right: 30, bottom: 40, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="mileage"
            name="Mileage"
            label={{
              value: "Mileage",
              position: "insideBottom",
              offset: -10,
            }}
          />
          <YAxis
            type="number"
            dataKey="age"
            name="Vehicle Age (months)"
            label={{
              value: "Vehicle Age (months)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          {/* <Legend /> */}
          <Scatter name="Reports" data={data} fill="#CE1212" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VehicleAgeMileageScatterChart;
