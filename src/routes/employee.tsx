import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Clock, CalendarDays, Wallet, FileText, User, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/employee")({
  component: EmployeeLayout,
});

const nav = [
  { to: "/employee", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employee/attendance", label: "Attendance", icon: Clock },
  { to: "/employee/leaves", label: "Leaves", icon: CalendarDays },
  { to: "/employee/payroll", label: "Payroll", icon: Wallet },
  { to: "/employee/documents", label: "Documents", icon: FileText },
  { to: "/employee/applications", label: "Applications", icon: ClipboardList },
  { to: "/employee/profile", label: "Profile", icon: User },
];

function EmployeeLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card p-4 md:block">
        <h2 className="mb-6 text-lg font-semibold">Employee Portal</h2>
        <nav className="space-y-1">
          {nav.map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="md:ml-64 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}