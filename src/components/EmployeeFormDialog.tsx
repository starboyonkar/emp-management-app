import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDepartments, useCreateEmployee, useUpdateEmployee } from "@/hooks/useEmployees";
import type { Employee } from "@/hooks/useEmployees";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
}

const emptyForm = {
  first_name: "", last_name: "", email: "", phone: "", department: "", position: "",
  salary: 0, hire_date: new Date().toISOString().split("T")[0], status: "active",
  address: "", city: "", country: "",
};

export default function EmployeeFormDialog({ open, onOpenChange, employee }: Props) {
  const [form, setForm] = useState(emptyForm);
  const { data: departments = [] } = useDepartments();
  const createMut = useCreateEmployee();
  const updateMut = useUpdateEmployee();
  const isEdit = !!employee;

  useEffect(() => {
    if (employee) {
      setForm({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || "",
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
        hire_date: employee.hire_date,
        status: employee.status,
        address: employee.address || "",
        city: employee.city || "",
        country: employee.country || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [employee, open]);

  const set = (key: string, value: string | number) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      phone: form.phone || null,
      address: form.address || null,
      city: form.city || null,
      country: form.country || null,
      avatar_url: null,
    };
    if (isEdit) {
      await updateMut.mutateAsync({ id: employee!.id, ...payload });
    } else {
      await createMut.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const isPending = createMut.isPending || updateMut.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>First Name *</Label>
              <Input required value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Last Name *</Label>
              <Input required value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Department *</Label>
              <Select value={form.department} onValueChange={(v) => set("department", v)}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Position *</Label>
              <Input required value={form.position} onChange={(e) => set("position", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Salary *</Label>
              <Input type="number" required min={0} value={form.salary} onChange={(e) => set("salary", Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Hire Date *</Label>
              <Input type="date" required value={form.hire_date} onChange={(e) => set("hire_date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Status *</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="gradient-primary text-primary-foreground">
              {isPending ? "Saving..." : isEdit ? "Update" : "Add Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
