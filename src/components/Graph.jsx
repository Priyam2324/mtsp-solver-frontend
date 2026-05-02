import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#182035",
        border: "1px solid rgba(255,255,255,0.13)",
        borderRadius: 8,
        padding: "7px 11px",
        fontSize: 12,
        fontFamily: "'Inter', sans-serif",
        color: "#e8eeff",
      }}>
        <div style={{ color: "#8fa0c0", marginBottom: 2, fontSize: 11 }}>Gen {label}</div>
        <div style={{ color: "#2dd4a0", fontWeight: 700 }}>
          Fitness: {payload[0].value?.toFixed(2)} km
        </div>
      </div>
    );
  }
  return null;
};

export default function Graph({ data }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const chartData = data.map((v, i) => ({ iter: i, fitness: v }));

  if (!mounted) return null;

  if (data.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 6,
        color: "#404e6a",
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18"/>
          <path d="M7 16l4-4 4 4 4-4"/>
        </svg>
        Run optimization to see fitness curve
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minHeight: 10, minWidth: 10, width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: -10, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="iter"
            stroke="#334155"
            tick={{ fill: "#475569", fontSize: 10, fontFamily: "Inter, sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "#1e293b" }}
            label={{ value: "Generation", position: "insideBottom", offset: -2, fill: "#475569", fontSize: 10 }}
          />
          <YAxis
            stroke="#334155"
            tick={{ fill: "#475569", fontSize: 10, fontFamily: "Inter, sans-serif" }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            dataKey="fitness"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#10b981", stroke: "#0d9488", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}