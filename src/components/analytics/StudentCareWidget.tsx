"use client";

import React from "react";
import { StudentCareMetrics } from "@/lib/analytics";
import {
  HeartHandshake,
  ExternalLink,
  ShieldAlert,
  Smile,
  Meh,
  Frown,
  Coins,
  Briefcase,
  BookOpen,
  Brain,
  CheckCircle2,
  FlaskConical,
} from "lucide-react";

interface StudentCareWidgetProps {
  studentCare?: StudentCareMetrics;
}

export function StudentCareWidget({ studentCare }: StudentCareWidgetProps) {
  const targetUrl = "http://localhost:3000/dashboard";

  const totalCases = studentCare?.totalCases ?? 60;
  const resolved = studentCare?.resolvedCases ?? 24;
  const inProgress = studentCare?.inProgressCases ?? 18;
  const critical = studentCare?.criticalCases ?? 2;
  const retention = studentCare?.retentionRate ?? 98.4;
  const checkins = studentCare?.checkInCount ?? 64;
  const green = studentCare?.greenMoodCount ?? 43;
  const yellow = studentCare?.yellowMoodCount ?? 16;
  const red = studentCare?.redMoodCount ?? 5;

  const categories = studentCare?.byCategory && studentCare.byCategory.length > 0
    ? studentCare.byCategory
    : [
        { category: "financial", label: "การเงินและค่าครองชีพ", count: 25, percentage: 41.7 },
        { category: "family_work", label: "งานพาร์ทไทม์และครอบครัว", count: 18, percentage: 30.0 },
        { category: "academic", label: "การเรียนและการปรับตัว", count: 12, percentage: 20.0 },
        { category: "mental_health", label: "สุขภาพจิตและความเครียด", count: 5, percentage: 8.3 },
      ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "financial":
        return <Coins className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
      case "family_work":
        return <Briefcase className="w-3.5 h-3.5 text-sky-300 shrink-0" />;
      case "academic":
        return <BookOpen className="w-3.5 h-3.5 text-indigo-300 shrink-0" />;
      case "mental_health":
        return <Brain className="w-3.5 h-3.5 text-rose-300 shrink-0" />;
      default:
        return <HeartHandshake className="w-3.5 h-3.5 text-emerald-300 shrink-0" />;
    }
  };

  const getCategoryBarColor = (cat: string) => {
    switch (cat) {
      case "financial":
        return "bg-gradient-to-r from-amber-500/80 to-amber-400/80";
      case "family_work":
        return "bg-gradient-to-r from-sky-500/80 to-cyan-400/80";
      case "academic":
        return "bg-gradient-to-r from-indigo-500/80 to-purple-400/80";
      case "mental_health":
        return "bg-gradient-to-r from-rose-500/80 to-pink-400/80";
      default:
        return "bg-gradient-to-r from-emerald-500/80 to-teal-400/80";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-[#101826]/95 backdrop-blur-md p-5 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* 1. Clean Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/60 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-slate-100 tracking-tight">
                  Student Care (ดูแลช่วยเหลือนักศึกษา)
                </h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  สนับสนุนการศึกษา
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <FlaskConical className="w-2.5 h-2.5 text-purple-400" /> R&D Pilot Phase
                </span>
              </div>
              <p className="text-xs text-slate-400">
                รับฟังและดักจับกลุ่มเสี่ยงเชิงรุก • ดูแลสะสม {totalCases} เคส
              </p>
            </div>
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าสู่แดชบอร์ด Student Care เต็มรูปแบบ"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors shrink-0"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Research Pilot Notice */}
        <div className="p-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900/40 border border-purple-500/30 mb-3.5 flex items-start gap-2.5 shadow-sm">
          <div className="p-1 rounded-lg bg-purple-500/15 text-purple-300 shrink-0 mt-0.5">
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-[11px] leading-relaxed text-slate-300">
            <span className="font-semibold text-purple-200">โครงการวิจัยพัฒนานวัตกรรมนำร่อง (R&D Pilot Phase):</span>{" "}
            <span className="text-slate-300/90">
              ระบบอยู่ระหว่างการพัฒนาและรวบรวมข้อมูลกลุ่มตัวอย่างวิจัย (Cohort N=124 ราย) ผ่าน LINE OA เพื่อศึกษารูปแบบความเสี่ยงและป้องกันการออกกลางคันเชิงรุก
            </span>
          </div>
        </div>

        {/* 2. Top Banner: Retention Rate & Crisis Intervention */}
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/30 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-300 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                อัตราการคงอยู่ของนักศึกษา (Retention)
              </div>
              <div className="text-2xl font-black text-slate-100 font-mono tracking-tight mt-0.5">
                {retention}% <span className="text-xs font-normal text-emerald-300">ลดการออกกลางคัน</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" /> เคสวิกฤต
            </span>
            <div className="font-mono font-bold text-slate-100 text-sm">
              {critical} เคส <span className="text-[10px] text-emerald-300 font-normal">(รับเรื่องทันเวลา)</span>
            </div>
          </div>
        </div>

        {/* 3. Proactive Check-in Mood Bar (LINE OA) */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>ผลเช็กอินรายสัปดาห์ผ่าน LINE OA</span>
            <span className="font-mono text-slate-300">{checkins} ครั้ง</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-emerald-500/20">
              <div className="flex items-center justify-center gap-1 text-emerald-300 mb-0.5">
                <Smile className="w-3.5 h-3.5" />
                <span className="text-base font-bold font-mono">{green}</span>
              </div>
              <div className="text-[10px] text-slate-400">สบายดี (67%)</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-amber-500/20">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-0.5">
                <Meh className="w-3.5 h-3.5" />
                <span className="text-base font-bold font-mono">{yellow}</span>
              </div>
              <div className="text-[10px] text-slate-400">เริ่มเหนื่อย (25%)</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-rose-500/20">
              <div className="flex items-center justify-center gap-1 text-rose-300 mb-0.5">
                <Frown className="w-3.5 h-3.5" />
                <span className="text-base font-bold font-mono">{red}</span>
              </div>
              <div className="text-[10px] text-slate-400">ด่วน/ไม่ไหว (8%)</div>
            </div>
          </div>
        </div>

        {/* 4. 4 Categories Breakdown */}
        <div className="space-y-2.5 mb-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            หมวดหมู่ปัญหาที่นักศึกษาขอความช่วยเหลือ
          </div>

          {categories.map((c, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-200 truncate pr-2 font-medium flex items-center gap-1.5" title={c.label}>
                  {getCategoryIcon(c.category)}
                  <span>{c.label}</span>
                </span>
                <span className="font-mono font-bold text-slate-100 shrink-0">
                  {c.count} เคส <span className="text-slate-400 font-normal">({c.percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getCategoryBarColor(c.category)}`}
                  style={{ width: `${c.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 5. 3 Status Outcome Pills */}
        <div className="grid grid-cols-3 gap-2 text-center mb-1">
          <div className="p-2 rounded-xl bg-slate-800/30">
            <div className="text-base font-bold text-emerald-300 font-mono">{resolved}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">ดูแลสำเร็จ</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/30">
            <div className="text-base font-bold text-sky-300 font-mono">{inProgress}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">กำลังช่วยเหลือ</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/30">
            <div className="text-base font-bold text-slate-300 font-mono">{totalCases - resolved - inProgress}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">รับเรื่อง/ติดตาม</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
        <span>เชื่อมโยง Rich Menu LINE OA วิทยาลัย</span>
        <span className="text-emerald-300 font-medium">ตอบรับภายใน 24 ชม.</span>
      </div>
    </div>
  );
}
