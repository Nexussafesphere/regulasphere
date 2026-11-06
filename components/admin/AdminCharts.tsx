"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { UserGrowthData, SectorComplianceData, DocumentVerificationStats } from "@/types/admin";

const COLORS = ["#1f6b62", "#c9963e", "#739b82", "#c65d4b", "#3d8b80", "#805a20"];

const AXIS_STYLE = { fontSize: 11, fill: "#7f8d87" };
const GRID_STYLE = { stroke: "#dfe7e1", strokeDasharray: "4 4" };
const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid #dfe7e1",
  boxShadow: "0 10px 24px rgba(21,35,31,0.10)",
  fontSize: 12,
};

/** Shown in place of a chart when there's no data to plot yet. */
function EmptyChartState({ label = "No data yet" }: { label?: string }) {
  return (
    <div className="h-full min-h-55 flex flex-col items-center justify-center gap-2 text-center px-4">
      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-[#8C8F72]">
        <BarChart3 className="w-5 h-5" />
      </div>
      <p className="text-xs font-medium text-slate-400 dark:text-[#8C8F72]">{label}</p>
    </div>
  );
}

interface UserGrowthChartProps {
  data: UserGrowthData[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  if (!data || data.length === 0) return <EmptyChartState label="No user growth data yet" />;

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1f6b62" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1f6b62" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={36} allowDecimals={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="total_users"
          stroke="#1f6b62"
          fillOpacity={1}
          fill="url(#colorUsers)"
          name="Total Users"
        />
        <Area
          type="monotone"
          dataKey="new_users"
          stroke="#c9963e"
          fillOpacity={0.3}
          fill="#c9a96e"
          name="New Users"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface SectorComplianceChartProps {
  data: SectorComplianceData[];
}

export function SectorComplianceChart({ data }: SectorComplianceChartProps) {
  if (!data || data.length === 0) return <EmptyChartState label="No sector compliance data yet" />;

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={240}>
      <BarChart data={data}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis
          dataKey="sector"
          tick={AXIS_STYLE}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={58}
        />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={36} allowDecimals={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="avg_compliance_score" fill="#1f6b62" name="Avg Score" radius={[6, 6, 0, 0]} />
        <Bar dataKey="compliant_businesses" fill="#c9963e" name="Compliant" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface DocumentStatsChartProps {
  data: DocumentVerificationStats[];
}

export function DocumentStatsChart({ data }: DocumentStatsChartProps) {
  if (!data || data.length === 0) return <EmptyChartState label="No document stats yet" />;

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}${percent == null ? "" : ` (${(percent * 100).toFixed(0)}%)`}`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
          nameKey="status"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface ComplianceTrendChartProps {
  data: Array<{ month: string; avg_score: number }>;
}

export function ComplianceTrendChart({ data }: ComplianceTrendChartProps) {
  if (!data || data.length === 0) return <EmptyChartState label="No compliance trend data yet" />;

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={240}>
      <LineChart data={data}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={AXIS_STYLE} axisLine={false} tickLine={false} width={36} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="avg_score"
          stroke="#1f6b62"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Compliance Score"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface RegulatorOverviewChartProps {
  data: Array<{
    regulator: string;
    total_obligations: number;
    completed: number;
    overdue: number;
    compliance_rate: number;
  }>;
}

export function RegulatorOverviewChart({ data }: RegulatorOverviewChartProps) {
  if (!data || data.length === 0) return <EmptyChartState label="No regulator data yet" />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="regulator" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={36} allowDecimals={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="completed" stackId="a" fill="#4D8B72" name="Completed" radius={[6, 6, 0, 0]} />
        <Bar dataKey="overdue" stackId="a" fill="#C65D4B" name="Overdue" />
        <Bar dataKey="total_obligations" fill="#1f6b62" name="Total" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}