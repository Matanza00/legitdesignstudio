import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEmployees } from "@/hooks/useEmployees";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function initials(name?: string) {
  if (!name) return "AD";

  return name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProfilePage() {
  const { data: employees = [], isLoading, error } = useEmployees();

  // Since app has one admin login, profile is management/admin profile.
  const adminEmployee =
    employees.find((e) => e.status === "Permanent") || employees[0];

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="My profile"
          description="Manage personal info, security and notifications."
        />
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="My profile"
          description="Manage personal info, security and notifications."
        />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My profile"
        description="Manage personal info, security and notifications."
      />

      <div className="rounded-2xl border bg-card p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-base bg-primary text-primary-foreground">
            {initials(adminEmployee?.name || "Admin")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            {adminEmployee?.name || "Admin"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {adminEmployee
              ? `${adminEmployee.designation || "Management"} · ${
                  adminEmployee.department || "Admin"
                }`
              : "Management · Admin"}
          </p>
        </div>

        <Button variant="outline" size="sm" disabled>
          Change photo
        </Button>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <div className="rounded-2xl border bg-card p-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Full name</Label>
              <Input value={adminEmployee?.name || "Admin"} readOnly />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input value={adminEmployee?.email || ""} readOnly />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Phone</Label>
              <Input value={adminEmployee?.phone || ""} readOnly />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Employee code</Label>
              <Input value={adminEmployee?.employeeCode || "ADMIN"} readOnly />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs">Address</Label>
              <Input value={adminEmployee?.address || ""} readOnly />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <div className="rounded-2xl border bg-card p-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Current password</Label>
              <Input type="password" disabled />
            </div>

            <div className="space-y-1.5" />

            <div className="space-y-1.5">
              <Label className="text-xs">New password</Label>
              <Input type="password" disabled />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Confirm new password</Label>
              <Input type="password" disabled />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between rounded-xl border p-4 opacity-70">
              <div>
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">
                  Security settings will be connected after login module.
                </p>
              </div>
              <Switch disabled />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <div className="rounded-2xl border bg-card p-6 space-y-3">
            {[
              "Email notifications",
              "Leave approval alerts",
              "Payroll reminders",
              "Attendance summaries",
            ].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
              >
                <span className="text-sm">{n}</span>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className="rounded-2xl border bg-card p-6">
            <ul className="space-y-3">
              {[
                {
                  action: "Opened HRMS dashboard",
                  time: "Today",
                  ip: "Local browser",
                },
                {
                  action: "Connected Google Sheets backend",
                  time: "Recently",
                  ip: "Apps Script",
                },
                {
                  action: "Payroll module enabled",
                  time: "Recently",
                  ip: "System",
                },
              ].map((l, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between text-sm border-b last:border-0 pb-3 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{l.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.time} · {l.ip}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}