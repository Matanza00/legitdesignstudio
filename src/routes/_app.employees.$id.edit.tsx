import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployee, useUpdateEmployee } from "@/hooks/useEmployees";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/employees/$id/edit")({
  component: EditEmployee,
});

function EditEmployee() {
  const { id } = useParams({ from: "/_app/employees/$id/edit" });
  const navigate = useNavigate();

  const { data: emp, isLoading, error } = useEmployee(id);
  const updateEmployee = useUpdateEmployee();

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (emp) {
      setForm(emp);
    }
  }, [emp]);

  function handleChange(field: string, value: string) {
    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    await updateEmployee.mutateAsync({
      employeeId: id,
      data: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        designation: form.designation,
        department: form.department,
        basicSalary: Number(form.basicSalary || 0),
        fuelAllowance: Number(form.fuelAllowance || 0),
        opdAllowance: Number(form.opdAllowance || 0),
      },
    });

    navigate({
      to: "/employees/$id",
      params: { id },
    });
  }

  if (isLoading) return <p>Loading employee...</p>;

  if (error) {
    return <p className="text-red-500">{error instanceof Error ? error.message : "Something went wrong"}</p>;
  }

  if (!emp) {
    return <p>Employee not found.</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Employees"
        title={`Edit ${emp.name}`}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/employees/$id" params={{ id }}>
                Cancel
              </Link>
            </Button>

            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={updateEmployee.isPending}
            >
              {updateEmployee.isPending ? "Saving..." : "Save"}
            </Button>
          </>
        }
      />

      <div className="rounded-2xl border bg-card p-6 max-w-3xl grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Name</Label>
          <Input
            value={form.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-xs">Email</Label>
          <Input
            value={form.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-xs">Phone</Label>
          <Input
            value={form.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-xs">Designation</Label>
          <Input
            value={form.designation || ""}
            onChange={(e) => handleChange("designation", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-xs">Department</Label>
          <Input
            value={form.department || ""}
            onChange={(e) => handleChange("department", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-xs">Basic Salary</Label>
          <Input
            type="number"
            value={form.basicSalary || ""}
            onChange={(e) => handleChange("basicSalary", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-xs">Fuel Allowance</Label>
          <Input
            type="number"
            value={form.fuelAllowance || ""}
            onChange={(e) => handleChange("fuelAllowance", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-xs">OPD Allowance</Label>
          <Input
            type="number"
            value={form.opdAllowance || ""}
            onChange={(e) => handleChange("opdAllowance", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>
    </div>
  );
}