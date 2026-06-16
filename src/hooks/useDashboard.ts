import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [
        employees,
        attendance,
        leaves,
        payroll,
        revenues,
        expenses,
        reserve,
      ] = await Promise.all([
        api.get("/employees"),
        api.get("/attendance"),
        api.get("/leave"),
        api.get("/payroll"),
        api.get("/revenue"),
        api.get("/expense"),
        api.get("/reserve"),
      ]);

      return {
        employees: employees.data.data || [],
        attendance: attendance.data.data || [],
        leaves: leaves.data.data || [],
        payroll: payroll.data.data || [],
        revenues: revenues.data.data || [],
        expenses: expenses.data.data || [],
        reserve: reserve.data.data || [],
      };
    },
  });
}