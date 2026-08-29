import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "purple" | "amber" | "red";
  trend?: { value: number; label: string };
  className?: string;
}

const colorMap = {
  blue: {
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/20",
    icon: "bg-brand-blue/15 text-brand-blue",
    value: "text-brand-blue",
  },
  green: {
    bg: "bg-gate-answered/10",
    border: "border-gate-answered/20",
    icon: "bg-gate-answered/15 text-gate-answered",
    value: "text-gate-answered",
  },
  purple: {
    bg: "bg-gate-review/10",
    border: "border-gate-review/20",
    icon: "bg-gate-review/15 text-gate-review",
    value: "text-gate-review",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "bg-amber-500/15 text-amber-400",
    value: "text-amber-400",
  },
  red: {
    bg: "bg-gate-unanswered/10",
    border: "border-gate-unanswered/20",
    icon: "bg-gate-unanswered/15 text-gate-unanswered",
    value: "text-gate-unanswered",
  },
};

export default function StatCard({ title, value, subtitle, icon, color = "blue", trend, className }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn("glass-card p-5 hover:border-brand-blue/30 transition-all duration-200 group", c.bg, c.border, className)}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2.5 rounded-lg", c.icon)}>
          {icon}
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trend.value >= 0 ? "text-gate-answered" : "text-gate-unanswered")}>
            {trend.value >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className={cn("text-3xl font-bold tracking-tight mb-1", c.value)}>{value}</div>
      <div className="text-text-primary text-sm font-medium">{title}</div>
      {subtitle && <div className="text-text-muted text-xs mt-0.5">{subtitle}</div>}
    </div>
  );
}
