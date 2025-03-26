import React, { useMemo } from "react";
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from "recharts";
import { ReportData } from "../interface/Report";
import {
    problemCategoriesData,
    classificationMap,
} from "../../utils/masterData";

// Palet warna untuk inner pie (large classification)
const INNER_COLORS = [
    "#4E79A7",
    "#F28E2B",
    "#E15759",
    "#76B7B2",
    "#59A14F",
    "#EDC948",
    "#B07AA1",
    "#FF9DA7",
];

/**
 * Fungsi untuk mengubah kecerahan warna hex.
 * Persentase negatif akan membuat warna lebih gelap, positif membuat lebih terang.
 */
const adjustBrightness = (hex: string, percent: number): string => {
    hex = hex.replace(/^#/, "");
    const num = parseInt(hex, 16);
    let r = (num >> 16) + Math.round((percent / 100) * 255);
    let g = ((num >> 8) & 0x00ff) + Math.round((percent / 100) * 255);
    let b = (num & 0x0000ff) + Math.round((percent / 100) * 255);

    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)}`;
};

interface OuterDataItem {
    name: string;
    count: number;
    parent: string;
    segmentIndex?: number;
}

interface Props {
    reports: ReportData[];
}

const PieClassification: React.FC<Props> = ({ reports }) => {
    // Inner Pie Data: Berdasarkan largeClassification
    const innerData = useMemo(() => {
        return problemCategoriesData
            .map((large) => {
                const count = reports.filter(
                    (report) => report.largeClassification === large
                ).length;
                return { name: large, count };
            })
            .filter((item) => item.count > 0);
    }, [reports]);

    // Mapping dari kategori besar ke warna (berdasarkan urutan innerData)
    const parentColorMap = useMemo(() => {
        const map: Record<string, string> = {};
        innerData.forEach((d, idx) => {
            map[d.name] = INNER_COLORS[idx % INNER_COLORS.length];
        });
        return map;
    }, [innerData]);

    // Outer Pie Data: Berdasarkan middleClassification yang valid sesuai mapping classificationMap
    const outerData: OuterDataItem[] = useMemo(() => {
        const data: OuterDataItem[] = [];

        problemCategoriesData.forEach((large) => {
            const reportsForLarge = reports.filter(
                (report) => report.largeClassification === large
            );
            const validMiddles = classificationMap[large] || [];
            validMiddles.forEach((middle) => {
                const count = reportsForLarge.filter(
                    (report) => report.middleClassification === middle
                ).length;
                if (count > 0) {
                    data.push({ name: middle, count, parent: large });
                }
            });
        });

        return data;
    }, [reports]);

    // Menambahkan properti segmentIndex untuk setiap segmen outer berdasarkan parent-nya
    useMemo(() => {
        const parentCount: Record<string, number> = {};
        outerData.forEach((segment) => {
            if (parentCount[segment.parent] === undefined) {
                parentCount[segment.parent] = 0;
            } else {
                parentCount[segment.parent] += 1;
            }
            segment.segmentIndex = parentCount[segment.parent];
        });
    }, [outerData]);

    // Mempersiapkan custom legend payload berdasarkan outerData
    const legendPayload = useMemo(() => {
        return outerData.map((entry) => {
            const baseColor = parentColorMap[entry.parent];
            const color = adjustBrightness(baseColor, -10 * (entry.segmentIndex || 0));
            return {
                value: `${entry.count} ${entry.name}  `,
                type: "square",
                color,
                payload: entry,
            };
        });
    }, [outerData, parentColorMap]);

    return (
        <div className={"md:px-8 py-4 rounded-lg md:w-7/12 w-full bg-slate-100"}>
            <h3 className="text-xl font-semibold text-left px-8 py-6">Problem Classification</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Tooltip />
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        // @ts-ignore
                        payload={legendPayload}
                    />
                    {/* Inner Pie: Large Classification */}
                    <Pie
                        data={innerData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                    // label
                    >
                        {innerData.map((_, index) => (
                            <Cell
                                key={`inner-${index}`}
                                fill={INNER_COLORS[index % INNER_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    {/* Outer Pie: Middle Classification */}
                    <Pie
                        data={outerData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                    // label
                    >
                        {outerData.map((entry, index) => {
                            const baseColor = parentColorMap[entry.parent];
                            const adjustedColor = adjustBrightness(
                                baseColor,
                                -10 * (entry.segmentIndex || 0)
                            );
                            return <Cell key={`outer-${index}`} fill={adjustedColor} />;
                        })}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieClassification;
