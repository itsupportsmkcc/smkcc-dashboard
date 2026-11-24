"use client";

import React from "react";
import { AdmissionMetrics } from "@/lib/analytics";
import { GraduationCap, ExternalLink, CheckCircle2, Clock } from "lucide-react";

interface AdmissionWidgetProps {
  admission?: AdmissionMetrics;
}

export function AdmissionWidget({ admission }: AdmissionWidgetProps) {
  const byProgram = admission?.byProgram || [];
  const total = admission?.totalApplicants || 143;
  const targetUrl = "https://smkcc.vercel.app/stats";

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-[#101826]/95 backdrop-blur-md p-5 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Clean Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/60 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-slate-100 tracking-tight">ระบบรับสมัครนักศึกษาใหม่</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  สนับสนุนการศึกษา
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ปีการศึกษา 2569 • รวมผู้สมัคร {total} คน
              </p>
            </div>
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าสู่ระบบรับสมัครนักศึกษาใหม่"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors shrink-0"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* 2 Clean Status Highlights */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span className="text-xs text-slate-300 font-medium">อนุมัติเรียบร้อย</span>
            </div>
            <span className="text-lg font-black text-emerald-300 font-mono">
              {admission?.approvedCount ?? 37} <span className="text-xs font-normal text-slate-400">คน</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="text-xs text-slate-300 font-medium">รอตรวจสอบเอกสาร</span>
            </div>
            <span className="text-lg font-black text-amber-300 font-mono">
              {admission?.pendingCount ?? 13} <span className="text-xs font-normal text-slate-400">คน</span>
            </span>
          </div>
        </div>

        {/* 5 Program Breakdown Bars */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            สถิติผู้สมัครแยกตามหลักสูตร / สาขาวิชา
          </div>

          {byProgram.map((prog, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-200 truncate pr-2 font-medium" title={prog.name}>
                  {prog.name}
                </span>
                <span className="font-mono font-bold text-slate-100 shrink-0">
                  {prog.count} คน <span className="text-slate-400 font-normal">({prog.percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-emerald-500/80 to-teal-400/80"
                  style={{ width: `${prog.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
        <span>เชื่อมต่อฐานข้อมูล Neon PostgreSQL</span>
        <span className="text-emerald-300 font-medium">อัปเดตอัตโนมัติ</span>
      </div>
    </div>
  );
}
