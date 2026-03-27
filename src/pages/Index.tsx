import { useState, useMemo } from "react";
import { Search, Plus, Filter, Users, FileDown, Trash2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees, useDepartments, useDeleteEmployee } from "@/hooks/useEmployees";
import type { Employee } from "@/hooks/useEmployees";
import DashboardStats from "@/components/DashboardStats";
import EmployeeTable from "@/components/EmployeeTable";
import EmployeeFormDialog from "@/components/EmployeeFormDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import DepartmentChart from "@/components/DepartmentChart";
import Footer from "@/components/Footer";
import { exportEmployeesPdf } from "@/lib/exportPdf";
import logoImg from "@/assets/logo.png";

export default function Index() {
  const { data: employees = [], isLoading } = useEmployees();
  const { data: departments = [] } = useDepartments();
  const deleteMut = useDeleteEmployee();

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch =
        `${e.first_name} ${e.last_name} ${e.email} ${e.position}`.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "all" || e.department === deptFilter;
      const matchStatus = statusFilter === "all" || e.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, search, deptFilter, statusFilter]);

  // Reset page when filters change
  useMemo(() => setPage(1), [search, deptFilter, statusFilter]);

  const handleEdit = (emp: Employee) => { setEditEmp(emp); setFormOpen(true); };
  const handleAdd = () => { setEditEmp(null); setFormOpen(true); };
  const handleDelete = async () => {
    if (deleteId) { await deleteMut.mutateAsync(deleteId); setDeleteId(null); }
  };

  const handleExportAll = () => exportEmployeesPdf(filtered, "Employee Report — All Filtered");
  const handleExportSelected = () => {
    const selected = filtered.filter(e => selectedIds.includes(e.id));
    if (selected.length) exportEmployeesPdf(selected, `Employee Report — ${selected.length} Selected`);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteMut.mutateAsync(id);
    }
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="gradient-primary px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="OnkarNova Technologies" className="h-12 w-12 rounded-full object-cover border-2 border-primary-foreground/30" />
              <div>
                <h1 className="text-2xl font-display font-bold text-primary-foreground">Employee Management System</h1>
                <p className="text-primary-foreground/70 text-sm">OnkarNova Technologies — Manage your workforce efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleExportAll} variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
                <Download className="h-4 w-4 mr-2" /> Export PDF
              </Button>
              <Button onClick={handleAdd} className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0">
                <Plus className="h-4 w-4 mr-2" /> Add Employee
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-4 pb-12 space-y-6 flex-1 w-full">
        {/* Stats */}
        <DashboardStats employees={employees} />

        {/* Chart */}
        <DepartmentChart employees={employees} />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search employees..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>
              <Button size="sm" variant="outline" onClick={handleExportSelected}>
                <FileDown className="h-4 w-4 mr-1" /> Export
              </Button>
              <Button size="sm" variant="destructive" onClick={handleBulkDelete} disabled={deleteMut.isPending}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <EmployeeTable
            employees={filtered}
            onEdit={handleEdit}
            onDelete={setDeleteId}
            selectedIds={selectedIds}
            onSelectChange={setSelectedIds}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        )}

        <p className="text-xs text-muted-foreground text-center">
          Showing {filtered.length} of {employees.length} employees
        </p>
      </main>

      <Footer />

      <EmployeeFormDialog open={formOpen} onOpenChange={setFormOpen} employee={editEmp} />
      <DeleteConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} onConfirm={handleDelete} isPending={deleteMut.isPending} />
    </div>
  );
}
