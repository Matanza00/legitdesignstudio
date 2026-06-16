import { apiGet, apiPost } from "../apiClient";

export type AttendanceRecord = {
  attendanceId: string;
  employeeId: string;
  employeeName?: string;
  attendanceDate: string;
  checkIn?: string;
  checkOut?: string;
  breakStart?: string;
  breakEnd?: string;
  lateMinutes?: number;
  breakMinutes?: number;
  workingMinutes?: number;
  deficitMinutes?: number;
  isLate?: boolean | string;
  latitude?: number;
  longitude?: number;
  ipAddress?: string;
  attendanceStatus: string;
};

export type AttendanceCorrection = {
  correctionId: string;
  employeeId: string;
  employeeName?: string;
  attendanceDate: string;
  requestType: string;
  oldValue?: string;
  newValue: string;
  reason: string;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const getAttendanceCorrections = () =>
  apiGet<AttendanceCorrection[]>("attendanceCorrections");

export const approveAttendanceCorrection = (correctionId: string) =>
  apiPost("approveAttendanceCorrection", {
    correctionId,
    approvedBy: "Admin",
  });

export const getAttendance = () =>
  apiGet<AttendanceRecord[]>("attendance");

export const checkIn = (data: {
  employeeCode: string;
  latitude: number;
  longitude: number;
  ipAddress: string;
}) => apiPost("checkIn", data);

export const breakStart = (employeeCode: string) =>
  apiPost("breakStart", { employeeCode });

export const breakEnd = (employeeCode: string) =>
  apiPost("breakEnd", { employeeCode });

export const checkOut = (employeeCode: string) =>
  apiPost("checkOut", { employeeCode });