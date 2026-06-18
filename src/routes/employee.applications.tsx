import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/employee/applications")({
  component: () => (
    <div>
      <h1 className="text-3xl font-bold">Applications</h1>
      <p className="text-muted-foreground">Attendance correction, reimbursement, advance salary and other requests.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {["Attendance Correction", "Reimbursement", "Advance Salary", "Loan Request", "Asset Request", "Resignation"].map((a) => (
          <div key={a} className="rounded-2xl border bg-card p-5">
            <p className="font-medium">{a}</p>
            <p className="text-xs text-muted-foreground">Form coming next</p>
          </div>
        ))}
      </div>
    </div>
  ),
});