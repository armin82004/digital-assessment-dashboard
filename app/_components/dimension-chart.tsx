"use client";

import { useState, useMemo, type CSSProperties } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toPersianDigits, type DimensionScore } from "@/lib/db/results-helpers";

const CHART_TYPES = [
  { value: "bar", label: "میله‌ای" },
  { value: "radar", label: "راداری" },
  { value: "pie", label: "دایره‌ای" },
  { value: "area", label: "ناحیه‌ای" },
  { value: "radialBar", label: "میله شعاعی" },
];

const PIE_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

const tooltipFormatter = (value: unknown): [string, string] => [
  toPersianDigits(Number(value ?? 0).toFixed(2)),
  "امتیاز",
];
const axisTickFormatter = (value: number) => toPersianDigits(value);

const tooltipContentStyle: CSSProperties = {
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  fontSize: 12,
};
const tooltipLabelStyle: CSSProperties = { color: "var(--popover-foreground)" };
const tooltipItemStyle: CSSProperties = { color: "var(--popover-foreground)" };

function DimensionLegend({
  chartData,
}: {
  chartData: { name: string; score: number }[];
}) {
  return (
    <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
      {chartData.map((d, i) => (
        <li key={d.name} className="flex items-center gap-1.5">
          <span
            className="inline-block size-2.5 rounded-sm"
            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
          />
          <span className="text-muted-foreground">{d.name}</span>
        </li>
      ))}
    </ul>
  );
}

function PolarAngleTick(props: {
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  payload?: { value: string };
  textAnchor?: string;
}) {
  const { x = 0, y = 0, cx = 0, cy = 0, payload, textAnchor } = props;
  const text = payload?.value ?? "";
  const words = text.split(" ");

  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length > 10 && current) {
      lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  const startDy = -(lines.length - 1) * 6 + (y > cy ? 8 : -2);

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fontSize={10}
      fill="var(--muted-foreground)"
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? startDy : 12}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function DimensionChart({ data }: { data: DimensionScore[] }) {
  const [chartType, setChartType] = useState("bar");

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.dimension_title,
        score: d.dimension_score === null ? 0 : Number(d.dimension_score),
      })),
    [data],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">امتیاز هر بُعد</span>
        <Select
          value={chartType}
          onValueChange={(value) => setChartType(value ?? "bar")}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="نوع نمودار">
              {(value: string | null) =>
                CHART_TYPES.find((t) => t.value === value)?.label ??
                "نوع نمودار"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CHART_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} tickFormatter={axisTickFormatter} />
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
              <Bar
                dataKey="score"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : chartType === "radar" ? (
            <RadarChart data={chartData} outerRadius="60%">
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={<PolarAngleTick />} />
              <PolarRadiusAxis
                domain={[0, 5]}
                tickFormatter={axisTickFormatter}
              />
              <Radar
                dataKey="score"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.4}
              />
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
            </RadarChart>
          ) : chartType === "pie" ? (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="score"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine
                label={({ value }) => toPersianDigits(Number(value).toFixed(2))}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
              <Legend
                content={() => <DimensionLegend chartData={chartData} />}
              />
            </PieChart>
          ) : chartType === "area" ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} tickFormatter={axisTickFormatter} />
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.3}
              />
            </AreaChart>
          ) : (
            <RadialBarChart
              data={chartData}
              innerRadius="20%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="score"
                background
                label={{
                  fill: "var(--foreground)",
                  fontSize: 10,
                  formatter: (v: number) => toPersianDigits(v.toFixed(2)),
                }}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </RadialBar>
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
              <Legend
                content={() => <DimensionLegend chartData={chartData} />}
              />
            </RadialBarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
