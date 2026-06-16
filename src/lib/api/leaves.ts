import { apiGet, apiPost } from "../apiClient";

export type LeaveRequest = {
  leaveId: string;
  employeeId: string;
  employeeName?: string;
  leaveType: "Annual" | "Casual" | "Sick" | "Unpaid" | string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: string;
  paidDays?: number;
  unpaidDays?: number;
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const getLeaveRequests = () =>
  apiGet<LeaveRequest[]>("leaveRequests");

export const applyLeave = (data: {
  employeeCode: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
}) => apiPost<LeaveRequest>("applyLeave", data);