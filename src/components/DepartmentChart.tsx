import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Employee } from "@/hooks/useEmployees";

const COLORS = [
  "hsl(217, 91%, 60%)", "hsl(262, 83%, 58%)", "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)", "hsl(190, 90%, 50%)",
  "hsl(280, 65%, 60%)", "hsl(160, 60%, 45%)",
];

interface Props {
  employees: Employee[];
}

export default function DepartmentChart({ employees }: Props) {
  const deptMap: Record<string, number> = {};
  employees.forEach((e) => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });
  const data = Object.entries(deptMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  return (
    <div className="bg-card rounded-lg shadow-card border border-border/50 p-5 animate-slide-up">
      <h3 className="font-display font-semibold text-card-foreground mb-4">Employees by Department</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)", fontSize: 13 }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
