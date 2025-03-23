import React, { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { areaData } from "../../utils/masterData";

// Definisikan tipe data report
interface ReportData {
  area: string;
  // properti lainnya jika diperlukan
}

interface AreaChartReportProps {
  reports: ReportData[];
}

const AreaChartReport: React.FC<AreaChartReportProps> = ({ reports }) => {
  // Agregasi data berdasarkan area
  const data = useMemo(() => {
    const areaCounts: Record<string, number> = {};
    reports.forEach((report) => {
      if (report.area) {
        areaCounts[report.area] = (areaCounts[report.area] || 0) + 1;
      }
    });
    const chartData = areaData.map((area) => ({
      area, // gunakan property 'area' untuk RadarChart
      count: areaCounts[area] || 0,
    }));
    return chartData;
  }, [reports]);

  return (
    <div className="rounded-lg w-5/12 bg-slate-100">
      <h3 className="text-xl font-semibold text-left p-5">Area Problem</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="area" />
          <PolarRadiusAxis />
          <Radar
            name="Report Count"
            dataKey="count"
            stroke="#CE1212"
            fill="#CE1212"
            fillOpacity={0.6}
          />
          <Tooltip />
          {/* <Legend /> */}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartReport;
