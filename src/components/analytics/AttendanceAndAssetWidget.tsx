"use client";

import React from "react";
import { AttendanceMetrics, AssetMetrics } from "@/lib/analytics";
import { Users, Monitor, CheckCircle, Clock, AlertCircle, Building2, Laptop, Printer, Server } from "lucide-react";

interface AttendanceAndAssetWidgetProps {
  attendance?: AttendanceMetrics;
  asset?: AssetMetrics;
}

export function AttendanceAndAssetWidget({ attendance, asset }: AttendanceAndAssetWidgetProps) {
  const categories = asset?.byCategory || [];

  return (
    <div className="space-y-6">
      {/* 1. Attendance Widget */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ระบบเช็คชื่อเข้าเรียน (Attendance)</h3>
              <p className="text-xs text-muted-foreground">
                สถิตินักศึกษา {attendance?.totalStudents ?? 71} คน ใน 5 รายวิชา
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl font-extrabold text-cyan-400 font-mono">
              {attendance?.attendanceRate ?? 99.1}%
            </div>
            <div className="text-[10px] text-muted-foreground">อัตราการเข้าเรียนรวม</div>
          </div>
        </div>

        {/* Attendance Breakdown Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center">
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {attendance?.presentCount ?? 451}
            </div>
            <div className="text-[11px] text-emerald-300/80 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle className="w-3 h-3" /> มาเรียนปกติ
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-center">
            <div className="text-lg font-bold text-amber-400 font-mono">
              {attendance?.lateCount ?? 4}
            </div>
            <div className="text-[11px] text-amber-300/80 flex items-center justify-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> มาสาย
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-center">
            <div className="text-lg font-bold text-red-400 font-mono">
              {attendance?.absentCount ?? 0}
            </div>
            <div className="text-[11px] text-red-300/80 flex items-center justify-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" /> ขาดเรียน
            </div>
          </div>
        </div>
      </div>

      {/* 2. AssetX Widget */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">smkccAssetX ทะเบียนครุภัณฑ์</h3>
              <p className="text-xs text-muted-foreground">
                บริหารจัดการทรัพย์สินดิจิทัล {asset?.totalEquipments ?? 108} รายการ 17 สถานที่
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-base font-bold text-violet-300 font-mono">
              {asset?.totalValueBaht
                ? new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(
                    asset.totalValueBaht
                  )
                : "฿1,293,991"}
            </div>
            <div className="text-[10px] text-muted-foreground">มูลค่ารวมตามจัดซื้อ</div>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            สัดส่วนประเภทอุปกรณ์ (Hardware Assets)
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {categories.map((c, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-secondary/40 border border-border/50 flex items-center justify-between"
              >
                <div className="truncate pr-1">
                  <div className="text-xs font-medium text-white truncate flex items-center gap-1.5">
                    {c.category.toLowerCase().includes("notebook") ? (
                      <Laptop className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : c.category.toLowerCase().includes("printer") ? (
                      <Printer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : c.category.toLowerCase().includes("switch") || c.category.toLowerCase().includes("firewall") ? (
                      <Server className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    ) : (
                      <Monitor className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    )}
                    <span className="truncate">{c.category}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-white font-mono bg-card px-2 py-0.5 rounded border border-border/80 shrink-0">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
