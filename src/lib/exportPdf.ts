import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Employee } from "@/hooks/useEmployees";

export function exportEmployeesPdf(employees: Employee[], title = "Employee Report") {
  const doc = new jsPDF({ orientation: "landscape" });

  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 95);
  doc.text("OnkarNova Technologies", 14, 18);
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(title, 14, 27);
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text(`Generated: ${new Date().toLocaleString()}  |  Total: ${employees.length} employees`, 14, 33);

  // Line
  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.5);
  doc.line(14, 36, 283, 36);

  // Table
  autoTable(doc, {
    startY: 40,
    head: [["#", "Name", "Email", "Phone", "Department", "Position", "Salary", "Hire Date", "Status", "City", "Country"]],
    body: employees.map((e, i) => [
      i + 1,
      `${e.first_name} ${e.last_name}`,
      e.email,
      e.phone || "—",
      e.department,
      e.position,
      `$${e.salary.toLocaleString()}`,
      new Date(e.hire_date).toLocaleDateString(),
      e.status.replace("_", " ").toUpperCase(),
      e.city || "—",
      e.country || "—",
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 245, 250] },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}  |  OnkarNova Technologies - Employee Management System`,
        14,
        doc.internal.pageSize.height - 8
      );
    },
  });

  doc.save(`employees_report_${new Date().toISOString().split("T")[0]}.pdf`);
}

export function exportSingleEmployeePdf(emp: Employee) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(30, 58, 95);
  doc.text("OnkarNova Technologies", 14, 18);
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("Employee Details", 14, 26);
  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.5);
  doc.line(14, 30, 196, 30);

  const fields = [
    ["Full Name", `${emp.first_name} ${emp.last_name}`],
    ["Email", emp.email],
    ["Phone", emp.phone || "—"],
    ["Department", emp.department],
    ["Position", emp.position],
    ["Salary", `$${emp.salary.toLocaleString()}`],
    ["Hire Date", new Date(emp.hire_date).toLocaleDateString()],
    ["Status", emp.status.replace("_", " ").toUpperCase()],
    ["Address", emp.address || "—"],
    ["City", emp.city || "—"],
    ["Country", emp.country || "—"],
  ];

  autoTable(doc, {
    startY: 35,
    body: fields,
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50, textColor: [30, 58, 95] },
      1: { cellWidth: 130 },
    },
    styles: { fontSize: 10, cellPadding: 4 },
    alternateRowStyles: { fillColor: [240, 245, 250] },
    theme: "plain",
  });

  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text("OnkarNova Technologies - Employee Management System", 14, doc.internal.pageSize.height - 8);

  doc.save(`employee_${emp.first_name}_${emp.last_name}.pdf`);
}
