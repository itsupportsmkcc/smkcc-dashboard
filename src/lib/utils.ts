import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLatency(ms: number | null): string {
  if (ms === null || ms === undefined || ms < 0) return "-- ms";
  if (ms < 1) return "<1 ms";
  return `${Math.round(ms)} ms`;
}

export function formatUptimePercent(percent: number): string {
  if (isNaN(percent) || percent < 0) return "100.00%";
  return `${percent.toFixed(2)}%`;
}

export function timeAgo(timestamp: string | number): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 10) return "เมื่อสักครู่";
  if (seconds < 60) return `${seconds} วินาทีที่แล้ว`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hours / 24);
  return `${days} วันที่แล้ว`;
}
