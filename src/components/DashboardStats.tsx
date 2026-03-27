import { Users, UserCheck, UserX, Clock, DollarSign, Building2 } from "lucide-react";
import type { Employee } from "@/hooks/useEmployees";

interface Props {
  employees: Employee[];
}

export default function DashboardStats({ employees }: Props) {
  const total = employees.length;
  const active = employees.filter((e) => e.status === "active").length;
  const inactive = employees.filter((e) => e.status === "inactive").length;
  const onLeave = employees.filter((e) => e.status === "on_leave").length;
  const avgSalary = total > 0 ? employees.reduce((s, e) => s + e.salary, 0) / total : 0;
  const departments = new Set(employees.map((e) => e.department)).size;

  const stats = [
    { label: "Total Employees", value: total, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active", value: active, icon: UserCheck, color: "text-success", bg: "bg-success/10" },
    { label: "Inactive", value: inactive, icon: UserX, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "On Leave", value: onLeave, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "Avg. Salary", value: `$${Math.round(avgSalary).toLocaleString()}`, icon: DollarSign, color: "text-accent", bg: "bg-accent/10" },
    { label: "Departments", value: departments, icon: Building2, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card rounded-lg p-4 shadow-card animate-slide-up border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className={`${s.bg} ${s.color} p-2 rounded-lg`}>
              <s.icon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-card-foreground">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
