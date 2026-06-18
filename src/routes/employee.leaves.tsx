import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyLeave, getLeaveRequests, type LeaveRequest } from "@/lib/api/leaves";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/employee/leaves")({
  component: EmployeeLeaves,
});

function days(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
  return Math.floor((e.getTime() - s.getTime()) / 86400000) + 1;
}

function EmployeeLeaves() {
  const qc = useQueryClient();
  const { data: raw = [] } = useQuery({ queryKey: ["leaveRequests"], queryFn: getLeaveRequests });

  const [form, setForm] = useState({ leaveType: "", startDate: "", endDate: "", reason: "" });
  const records = Array.isArray(raw) ? raw.filter((l) => l.employeeId === CURRENT_EMPLOYEE_ID) : [];

  const mutation = useMutation({
    mutationFn: applyLeave,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leaveRequests"] });
      setForm({ leaveType: "", startDate: "", endDate: "", reason: "" });
    },
  });

  const totalDays = days(form.startDate, form.endDate);

  function submit() {
    mutation.mutate({
      employeeCode: CURRENT_EMPLOYEE_CODE,
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      totalDays,
      reason: form.reason,
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">My Leaves</h1>
      <p className="text-muted-foreground">Apply for leave and track approval status.</p>

      <div className="mt-6 rounded-2xl border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Apply Leave</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label className="text-xs">Type</Label><Select value={form.leaveType} onValueChange={(v) => setForm((p) => ({ ...p, leaveType: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Annual">Annual</SelectItem><SelectItem value="Casual">Casual</SelectItem><SelectItem value="Sick">Sick</SelectItem><SelectItem value="Unpaid">Unpaid</SelectItem></SelectContent></Select></div>
          <div><Label className="text-xs">Total Days</Label><Input value={Math.max(totalDays, 0)} readOnly /></div>
          <div><Label className="text-xs">Start Date</Label><Input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} /></div>
          <div><Label className="text-xs">End Date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} /></div>
          <div className="md:col-span-2"><Label className="text-xs">Reason</Label><Textarea value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} /></div>
        </div>
        <Button className="mt-4" disabled={mutation.isPending || !form.leaveType || totalDays <= 0} onClick={submit}>
          {mutation.isPending ? "Submitting..." : "Submit Leave"}
        </Button>
      </div>

      <div className="mt-6">
        <DataTable<LeaveRequest>
          rowKey={(r) => r.leaveId}
          data={records}
          columns={[
            { key: "leaveType", header: "Type" },
            { key: "startDate", header: "Start" },
            { key: "endDate", header: "End" },
            { key: "totalDays", header: "Days", render: (r) => Number(r.totalDays || 0) },
            { key: "paidDays", header: "Paid", render: (r) => Number(r.paidDays || 0) },
            { key: "unpaidDays", header: "Unpaid", render: (r) => Number(r.unpaidDays || 0) },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      </div>
    </div>
  );
}