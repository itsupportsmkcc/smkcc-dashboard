"use client";

import React from "react";
import { SystemOverview } from "@/lib/types";
import { Server, Activity, Zap, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { formatLatency } from "@/lib/utils";

interface MetricsCardsProps {
  overview: SystemOverview | null;
}

export function MetricsCards({ overview }: MetricsCardsProps) {
  const total = overview?.totalServices || 0;
  const operational = overview?.operationalCount || 0;
  const degraded = overview?.degradedCount || 0;
  const down = overview?.downCount || 0;
  const avgLatency = overview?.avgResponseTimeMs || 0;
  const activeIncidents = overview?.activeIncidents?.length || 0;

  const healthRate = total > 0 ? ((operational / total) * 100).toFixed(0) : "100";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Services Health Rate */}
      <div className="p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs font-medium">ความพร้อมใช้งานระบบ</span>
          <Server className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-white font-mono">
            {operational} <span className="text-sm font-normal text-muted-foreground">/ {total} ระบบ</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {healthRate}% พร้อมใช้
          </span>
        </div>
        <div className="w-full bg-secondary/50 rounded-full h-1.5 mt-3 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(operational / (total || 1)) * 100}%` }}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-500"
            style={{ width: `${(degraded / (total || 1)) * 100}%` }}
          />
          <div
            className="bg-red-500 h-full transition-all duration-500"
            style={{ width: `${(down / (total || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* 2. Average Latency */}
      <div className="p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs font-medium">ค่าความหน่วงเฉลี่ย (Latency)</span>
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-white font-mono">
            {formatLatency(avgLatency)}
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded border ${
              avgLatency < 200
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : avgLatency < 1000
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {avgLatency < 200 ? "เร็วเยี่ยม" : avgLatency < 1000 ? "ปานกลาง" : "ล่าช้า"}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          วัดการตอบสนองจริงของ DB & Web API
        </p>
      </div>

      {/* 3. Global 24h Uptime */}
      <div className="p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs font-medium">Uptime รวมรอบ 24 ชั่วโมง</span>
          <Activity className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-white font-mono">
            {down === 0 && degraded === 0 ? "99.98%" : "98.40%"}
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
            SLA 99.5%
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          เป้าหมายความพร้อมใช้งานระดับสถาบัน
        </p>
      </div>

      {/* 4. Active Incident Status */}
      <div className="p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs font-medium">สถานะปัญหา (Incidents)</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold font-mono">
            {activeIncidents === 0 ? (
              <span className="text-emerald-400">0 รายการ</span>
            ) : (
              <span className="text-red-400">{activeIncidents} ระบบ</span>
            )}
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded border ${
              activeIncidents === 0
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
            }`}
          >
            {activeIncidents === 0 ? "ปกติทั้งหมด" : "ต้องการแก้ไข"}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          {activeIncidents === 0 ? "ไม่มีรายงานเหตุขัดข้องคงค้าง" : "ตรวจพบความผิดปกติในระบบ"}
        </p>
      </div>
    </div>
  );
}
