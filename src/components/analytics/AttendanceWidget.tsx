"use client";

import React from "react";
import { AttendanceMetrics } from "@/lib/analytics";
import { Users, ExternalLink, CalendarCheck, HeartHandshake } from "lucide-react";

interface AttendanceWidgetProps {
  attendance?: AttendanceMetrics;
}

export function AttendanceWidget({ attendance }: AttendanceWidgetProps) {
  const rate = attendance?.attendanceRate ?? 99.1;
  const targetUrl = "https://attendance-smkcc.vercel.app/attendance";

  const sampleCourses = [
    { code: "BC101", name: "เทคโนโลยีสารสนเทศเพื่อการจัดการ", rate: "99.4%" },
    { code: "LM202", name: "การจัดการโลจิสติกส์และการกระจายสินค้า", rate: "98.9%" },
    { code: "PA104", name: "หลักการปกครองท้องถิ่นไทย", rate: "99.2%" },
    { code: "IM201", name: "การจัดการอุตสาหกรรมเบื้องต้น", rate: "98.8%" },
    { code: "MG101", name: "หลักการจัดการและองค์การสมัยใหม่", rate: "99.5%" },
  ];

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-[#101826]/95 backdrop-blur-md p-5 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Clean Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/60 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-slate-100 tracking-tight">ระบบเช็คชื่อเข้าเรียน</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  สนับสนุนการศึกษา
                </span>
              </div>
              <p className="text-xs text-slate-400">
                สถิตินักศึกษา {attendance?.totalStudents ?? 71} คน ใน {attendance?.totalCourses ?? 5} รายวิชา
              </p>
            </div>
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าสู่ระบบเช็คชื่อเข้าเรียน"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors shrink-0"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Rate Banner - Clean Soft Style */}
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/30 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-300 flex items-center justify-center font-bold shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                อัตราการเข้าเรียนรวม
              </div>
              <div className="text-2xl font-black text-slate-100 font-mono tracking-tight mt-0.5">
                {rate}% <span className="text-xs font-normal text-emerald-300">เกณฑ์ดีเยี่ยม</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400">ประมวลผลสะสม</span>
            <div className="font-mono font-bold text-slate-100 text-sm">{attendance?.totalRecords ?? 455} ครั้ง</div>
          </div>
        </div>

        {/* 3 Status Numbers */}
        <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-xl font-bold text-emerald-300 font-mono">
              {attendance?.presentCount ?? 451}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">มาเรียนปกติ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-xl font-bold text-amber-300 font-mono">
              {attendance?.lateCount ?? 4}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">มาสาย</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-xl font-bold text-slate-400 font-mono">
              {attendance?.absentCount ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">ขาดเรียน</div>
          </div>
        </div>

        {/* Course Attendance List */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            อัตราการเข้าเรียนแยกรายวิชา
          </div>

          <div className="space-y-1.5">
            {sampleCourses.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 border border-slate-800/40 text-xs hover:bg-slate-800/60 transition-colors"
              >
                <div className="truncate mr-2 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-sky-300 font-bold shrink-0">
                    {c.code}
                  </span>
                  <span className="text-slate-300 truncate text-[11px]" title={c.name}>
                    {c.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-300 text-xs shrink-0">
                  {c.rate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Care Connection */}
        <div className="mt-4 p-3 rounded-xl bg-slate-800/35 border border-slate-700/35 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-300">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-100">Student Care</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  สนับสนุนการศึกษา
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                ระบบดูแลนักศึกษาเชิงรุกเพื่อลดการออกกลางคัน
              </p>
            </div>
          </div>
          <a
            href="http://localhost:3000/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าระบบ Student Care"
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white font-medium px-2.5 py-1 rounded-lg bg-slate-700/40 hover:bg-slate-700 transition-colors shrink-0"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
        <span>บันทึกผ่าน QR Code สดในห้องเรียน</span>
        <span className="text-sky-300 font-medium">ออนไลน์ปกติ</span>
      </div>
    </div>
  );
}
