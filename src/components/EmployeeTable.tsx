import { useState } from "react";
import { Edit, Trash2, ChevronUp, ChevronDown, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Employee } from "@/hooks/useEmployees";

interface Props {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
}

type SortKey = "first_name" | "department" | "position" | "salary" | "hire_date" | "status";

const statusVariant: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-destructive/10 text-destructive border-destructive/20",
  on_leave: "bg-warning/10 text-warning border-warning/20",
};

export default function EmployeeTable({ employees, onEdit, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("first_name");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...employees].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
    return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : null;

  const headers: { key: SortKey; label: string }[] = [
    { key: "first_name", label: "Employee" },
    { key: "department", label: "Department" },
    { key: "position", label: "Position" },
    { key: "salary", label: "Salary" },
    { key: "hire_date", label: "Hire Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="bg-card rounded-lg shadow-card border border-border/50 overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={() => toggleSort(h.key)}
                  className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                >
                  <span className="flex items-center gap-1">
                    {h.label}
                    <SortIcon col={h.key} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((emp) => (
              <tr key={emp.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-card-foreground">{emp.first_name} {emp.last_name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />{emp.email}
                      </span>
                      {emp.phone && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />{emp.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-card-foreground">{emp.department}</td>
                <td className="px-4 py-3 text-sm text-card-foreground">{emp.position}</td>
                <td className="px-4 py-3 text-sm font-semibold text-card-foreground">${emp.salary.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(emp.hire_date).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={`text-xs capitalize ${statusVariant[emp.status] || ""}`}>
                    {emp.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onEdit(emp)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(emp.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
