import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { useTheme } from "@/components/theme-provider";

type WorkspaceAnalyticsChartProps = {
  data: {
    totalTasks: number;
    overdueTasks: number;
    completedTasks: number;
  };
};

const COLORS = {
  total: "#3b82f6",
  completed: "#10b981",
  overdue: "#f43f5e",
};

export const WorkspaceAnalyticsChart = ({ data }: WorkspaceAnalyticsChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const tickColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";

  const barData = [
    { name: "Total", value: data.totalTasks, color: COLORS.total },
    { name: "Completed", value: data.completedTasks, color: COLORS.completed },
    { name: "Overdue", value: data.overdueTasks, color: COLORS.overdue },
  ];

  const donutData = [
    { name: "Completed", value: data.completedTasks || 0, color: COLORS.completed },
    { name: "Overdue", value: data.overdueTasks || 0, color: COLORS.overdue },
    {
      name: "In Progress",
      value: Math.max(0, data.totalTasks - data.completedTasks - data.overdueTasks),
      color: "#a78bfa",
    },
  ].filter((d) => d.value > 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomBarTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-2 px-3 rounded-lg shadow-md text-sm">
          <span className="font-semibold">{payload[0].payload.name}</span>
          <span className="ml-2 text-foreground">{payload[0].value}</span>
        </div>
      );
    }
    return null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomPieTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-2 px-3 rounded-lg shadow-md text-sm">
          <span className="font-semibold">{payload[0].name}</span>
          <span className="ml-2 text-foreground">{payload[0].value}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Bar Chart */}
      <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          <h3 className="text-base font-semibold">Task Overview</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5 ml-4">Breakdown of all workspace tasks</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: tickColor }}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: tickColor }}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: isDark ? "#1e293b" : "#f1f5f9", radius: 6 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={55}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-5 bg-violet-500 rounded-full" />
          <h3 className="text-base font-semibold">Task Distribution</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-2 ml-4">Status breakdown</p>
        <div className="flex-1 h-[220px]">
          {donutData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`donut-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No task data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
