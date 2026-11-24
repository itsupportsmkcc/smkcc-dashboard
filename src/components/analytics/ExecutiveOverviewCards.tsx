"use client";

import React from "react";
import { ExecutiveDashboardData } from "@/lib/analytics";
import { GraduationCap, Users, Monitor, Package, Wrench, ExternalLink, HeartHandshake } from "lucide-react";

interface ExecutiveOverviewCardsProps {
  data: ExecutiveDashboardData | null;
}

export function ExecutiveOverviewCards({ data }: ExecutiveOverviewCardsProps) {
  const summary = data?.summary;
  const admission = data?.admission;
  const attendance = data?.attendance;
  const studentCare = data?.studentCare;
  const asset = data?.asset;
  const watsadu = data?.watsadu;
  const helpdesk = data?.helpdesk;

  const URLS = {
    admission: "https://smkcc.vercel.app/stats",
    attendance: "https://attendance-smkcc.vercel.app/attendance",
    studentCare: "http://localhost:3000/dashboard",
    asset: "https://smkcc-asset-x.vercel.app/admin",
    watsadu: "https://smkcc-kumwatsadu.vercel.app/?view=exec",
    helpdesk: "https://smkcc-it-helpdesk.vercel.app/admin/dashboard",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-2">
      {/* 1. Admission KPI */}
      <div className="p-4 rounded-2xl bg-[#101826]/95 border border-slate-700/40 hover:border-slate-600/60 transition-all shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <GraduationCap className="w-4 h-4 text-emerald-300" />
            <span>รับสมัครนักศึกษา</span>
          </div>
          <a
            href={URLS.admission}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าระบบรับสมัครเรียน"
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
        <div className="flex items-baseline justify-between my-1">
          <div className="text-3xl font-black text-slate-100 font-mono tracking-tight tv-kpi-num">
            {summary?.totalApplicants ?? 143}
            <span className="text-xs font-normal text-slate-400 ml-1">คน</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-300 font-mono">
            5 สาขาวิชา
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span>อนุมัติแล้ว <strong className="text-slate-200 font-mono">{admission?.approvedCount ?? 37}</strong></span>
          <span>รอตรวจ <strong className="text-amber-300 font-mono">{admission?.pendingCount ?? 13}</strong></span>
        </div>
      </div>

      {/* 2. Attendance KPI */}
      <div className="p-4 rounded-2xl bg-[#101826]/95 border border-slate-700/40 hover:border-slate-600/60 transition-all shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Users className="w-4 h-4 text-sky-300" />
            <span>เช็คชื่อเข้าเรียน</span>
          </div>
          <a
            href={URLS.attendance}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าระบบเช็คชื่อเข้าเรียน"
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
        <div className="flex items-baseline justify-between my-1">
          <div className="text-3xl font-black text-slate-100 font-mono tracking-tight tv-kpi-num">
            {attendance?.attendanceRate ?? 99.1}
            <span className="text-xs font-normal text-slate-400 ml-0.5">%</span>
          </div>
          <span className="text-[11px] font-medium text-sky-300 font-mono">
            {summary?.totalStudents ?? 71} นศ.
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span>บันทึกสะสม <strong className="text-slate-200 font-mono">{attendance?.totalRecords ?? 455}</strong></span>
          <span>5 รายวิชา</span>
        </div>
      </div>

      {/* 3. Student Care KPI */}
      <div className="p-4 rounded-2xl bg-[#101826]/95 border border-slate-700/40 hover:border-slate-600/60 transition-all shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <HeartHandshake className="w-4 h-4 text-rose-300" />
            <span>Student Care</span>
          </div>
          <a
            href={URLS.studentCare}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าระบบ Student Care (ระบบดูแลนักศึกษา)"
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
        <div className="flex items-baseline justify-between my-1">
          <div className="text-3xl font-black text-slate-100 font-mono tracking-tight tv-kpi-num">
            {studentCare?.totalCases ?? 60}
            <span className="text-xs font-normal text-slate-400 ml-1">เคส</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-300 font-mono">
            คงอยู่ {studentCare?.retentionRate ?? 98.4}%
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span>ดูแลสำเร็จ <strong className="text-slate-200 font-mono">{studentCare?.resolvedCases ?? 34}</strong></span>
          <span>ต่อเนื่อง <strong className="text-amber-300 font-mono">{studentCare?.inProgressCases ?? 24}</strong></span>
        </div>
      </div>

      {/* 4. Asset Management KPI */}
      <div className="p-4 rounded-2xl bg-[#101826]/95 border border-slate-700/40 hover:border-slate-600/60 transition-all shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Monitor className="w-4 h-4 text-indigo-300" />
            <span>ครุภัณฑ์ AssetX</span>
          </div>
          <a
            href={URLS.asset}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าระบบ smkccAssetX"
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
        <div className="flex items-baseline justify-between my-1">
          <div className="text-3xl font-black text-slate-100 font-mono tracking-tight tv-kpi-num">
            {summary?.totalEquipments ?? 108}
            <span className="text-xs font-normal text-slate-400 ml-1">ชิ้น</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-300 font-mono">
            พร้อมยืม {asset?.availableBorrowCount ?? 5} เครื่อง
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span>ประจำการ <strong className="text-slate-200 font-mono">{asset?.activeInUseCount ?? 100}</strong></span>
          <span>ถูกยืม <strong className="text-amber-300 font-mono">{asset?.currentlyBorrowedCount ?? 1}</strong></span>
        </div>
      </div>

      {/* 4. Watsadu (Material Control) KPI */}
      <div className="p-4 rounded-2xl bg-[#101826]/95 border border-slate-700/40 hover:border-slate-600/60 transition-all shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Package className="w-4 h-4 text-amber-300" />
            <span>ระบบคุมวัสดุ</span>
          </div>
          <a
            href={URLS.watsadu}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าระบบคุมวัสดุ"
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
        <div className="flex items-baseline justify-between my-1">
          <div className="text-3xl font-black text-slate-100 font-mono tracking-tight tv-kpi-num">
            {summary?.totalMaterials ?? 16}
            <span className="text-xs font-normal text-slate-400 ml-1">รายการ</span>
          </div>
          <span className="text-[11px] font-medium text-amber-300 font-mono">
            {watsadu?.totalPersonnel ?? 38} บุคลากร
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span>รับเข้า <strong className="text-slate-200 font-mono">{watsadu?.totalMovesIn ?? 2}</strong></span>
          <span>เบิกจ่าย <strong className="text-slate-200 font-mono">{watsadu?.totalMovesOut ?? 2}</strong></span>
        </div>
      </div>

      {/* 5. IT Helpdesk KPI */}
      <div className="p-4 rounded-2xl bg-[#101826]/95 border border-slate-700/40 hover:border-slate-600/60 transition-all shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Wrench className="w-4 h-4 text-rose-300" />
            <span>IT Helpdesk</span>
          </div>
          <a
            href={URLS.helpdesk}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าระบบ IT Helpdesk"
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
        <div className="flex items-baseline justify-between my-1">
          <div className="text-3xl font-black text-slate-100 font-mono tracking-tight tv-kpi-num">
            {helpdesk?.resolutionRate ?? 100}
            <span className="text-xs font-normal text-slate-400 ml-0.5">%</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-300 font-mono">
            แก้ไขสำเร็จครบ
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span>เคสทั้งหมด <strong className="text-slate-200 font-mono">{summary?.totalHelpdeskTickets ?? 2}</strong></span>
          <span>คงค้าง <strong className="text-slate-200 font-mono">{helpdesk?.pendingTickets ?? 0}</strong></span>
        </div>
      </div>
    </div>
  );
}
