import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BadgeDollarSign,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import {
  getAccountsOverview,
  type ProfitDistributionItem,
  type RevenueExpenseTrendItem,
} from "@/lib/api/accounts";

export const Route = createFileRoute("/_app/accounts")({
  component: AccountsLayout,
});

function formatPKR(value: number | string | undefined) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function AccountsLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  const tabs = [
    { url: "/accounts", label: "Overview" },
    { url: "/accounts/revenue", label: "Revenue" },
    { url: "/accounts/expenses", label: "Expenses" },
    { url: "/accounts/reserve", label: "Reserve" },
    { url: "/accounts/profit-distribution", label: "Profit Distribution" },
  ];

  const isRoot = path === "/accounts";

  return (
    <div>
      <PageHeader
        title="Accounts"
        description="Revenue, expenses, reserve and profit distribution."
      />

      <div className="mb-6 inline-flex rounded-xl border bg-card p-1 overflow-x-auto">
        {tabs.map((t) => {
          const active = path === t.url;

          return (
            <Link
              key={t.url}
              to={t.url}
              className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {isRoot ? <Overview /> : <Outlet />}
    </div>
  );
}

function Overview() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["accountsOverview"],
    queryFn: getAccountsOverview,
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Loading accounts overview...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }

  const summary = data?.summary ?? {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    reserveBalance: 0,
  };

  const trend: RevenueExpenseTrendItem[] = data?.trend ?? [];
  const distribution: ProfitDistributionItem[] = data?.distribution ?? [];

  const selectedMonth = new Date().toISOString().slice(0, 7);

  const currentMonthData = trend.find(
    (t) => String(t.month).slice(0, 7) === selectedMonth
  );

  const monthlyRevenue = Number(currentMonthData?.revenue || 0);
  const monthlyExpense = Number(currentMonthData?.expense || 0);
  const monthlyProfit = monthlyRevenue - monthlyExpense;
  const monthlyReserve = monthlyProfit > 0 ? monthlyProfit * 0.3 : 0;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Revenue (MTD)"
          value={formatPKR(summary.totalRevenue)}
          icon={TrendingUp}
          tone="success"
        />

        <StatCard
          label="Expenses (MTD)"
          value={formatPKR(summary.totalExpenses)}
          icon={TrendingDown}
          tone="warning"
        />

        <StatCard
          label="Net Profit"
          value={formatPKR(summary.netProfit)}
          icon={BadgeDollarSign}
          tone={summary.netProfit >= 0 ? "success" : "danger"}
        />

        <StatCard
          label="Reserve"
          value={formatPKR(summary.reserveBalance)}
          icon={PiggyBank}
          tone="accent"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue vs Expenses" description="Last 6 months">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-chart-2)"
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-chart-2)"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-chart-4)"
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-chart-4)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                />

                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickFormatter={(v) => `${(Number(v) / 1000000).toFixed(1)}M`}
                />

                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => formatPKR(v)}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-2)"
                  fill="url(#rev)"
                  strokeWidth={2.5}
                />

                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="var(--color-chart-4)"
                  fill="url(#exp)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">
            Distribution snapshot
          </h3>

          {distribution.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No distribution data available.
            </p>
          ) : (
            <ul className="space-y-3">
              {distribution.map((p) => (
                <li key={p.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{p.name}</span>
                    <span className="tabular-nums">
                      {formatPKR(p.amount)}
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    {p.percent}%
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label={`Revenue (${selectedMonth})`}
            value={formatPKR(monthlyRevenue)}
            icon={TrendingUp}
            tone="success"
          />

          <StatCard
            label={`Expenses (${selectedMonth})`}
            value={formatPKR(monthlyExpense)}
            icon={TrendingDown}
            tone="warning"
          />

          <StatCard
            label={`Profit (${selectedMonth})`}
            value={formatPKR(monthlyProfit)}
            icon={BadgeDollarSign}
            tone={monthlyProfit >= 0 ? "success" : "danger"}
          />

          <StatCard
            label={`Reserve (${selectedMonth})`}
            value={formatPKR(monthlyReserve)}
            icon={PiggyBank}
            tone="accent"
          />
        </div>
    </>
  );
}