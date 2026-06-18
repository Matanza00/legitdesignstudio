import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getPayroll, type PayrollRecord } from "@/lib/api/payroll";

import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const Route = createFileRoute("/employee/payroll")({
  component: EmployeePayroll,
});

function formatPKR(v: number | string | undefined) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(Number(v || 0));
}

function EmployeePayroll() {
  const { data: raw = [] } = useQuery({ queryKey: ["payroll"], queryFn: getPayroll });
  const records = Array.isArray(raw) ? raw.filter((p) => p.employeeId === CURRENT_EMPLOYEE_ID) : [];

  return (
    <div>
      <h1 className="text-3xl font-bold">My Payroll</h1>
      <p className="text-muted-foreground">Salary, deductions and payslip history.</p>

      <div className="mt-6">
        <DataTable<PayrollRecord>
          rowKey={(r) => r.payrollId}
          data={records}
          columns={[
            { key: "month", header: "Month", render: (r) => String(r.month).slice(0, 7) },
            { key: "grossSalary", header: "Gross", render: (r) => formatPKR(r.grossSalary) },
            { key: "deductionAmount", header: "Deductions", render: (r) => formatPKR(r.deductionAmount) },
            { key: "bonus", header: "Bonus", render: (r) => formatPKR(r.bonus) },
            { key: "netSalary", header: "Net", render: (r) => <span className="font-semibold">{formatPKR(r.netSalary)}</span> },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      </div>
    </div>
  );
}