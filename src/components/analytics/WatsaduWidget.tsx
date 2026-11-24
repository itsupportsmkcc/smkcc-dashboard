"use client";

import React from "react";
import { WatsaduMetrics } from "@/lib/analytics";
import { Package, ExternalLink, ArrowDownRight, ArrowUpRight } from "lucide-react";

interface WatsaduWidgetProps {
  watsadu?: WatsaduMetrics;
}

export function WatsaduWidget({ watsadu }: WatsaduWidgetProps) {
  const materials = watsadu?.materialsList || [];
  const moves = watsadu?.recentMoves || [];
  const targetUrl = "https://smkcc-kumwatsadu.vercel.app/?view=exec";

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-[#101826]/95 backdrop-blur-md p-5 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Clean Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/60 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-300">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-slate-100 tracking-tight">ระบบบริหารจัดการและคลังวัสดุ</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/25">
                  สนับสนุนการปฏิบัติงาน
                </span>
              </div>
              <p className="text-xs text-slate-400">
                คลังวัสดุสำนักงาน • เบิกจ่ายสำหรับ {watsadu?.totalPersonnel ?? 38} บุคลากร
              </p>
            </div>
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าสู่ระบบคุมพัสดุและวัสดุ"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors shrink-0"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* 3 Metric Pills - Clean Flat Style */}
        <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-xl font-bold text-slate-100 font-mono">{watsadu?.totalMaterials ?? 16}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">พัสดุในคลัง</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-xl font-bold text-emerald-300 font-mono flex items-center justify-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-300" />
              {watsadu?.totalMovesIn ?? 2}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">รับเข้าคลัง</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-xl font-bold text-sky-300 font-mono flex items-center justify-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-300" />
              {watsadu?.totalMovesOut ?? 2}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">เบิกจ่ายออก</div>
          </div>
        </div>

        {/* Materials List Preview */}
        <div className="space-y-2 mb-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            รายการพัสดุหมุนเวียนหลัก
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {materials.slice(0, 4).map((m, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-800/30 border border-slate-800/40 flex items-center justify-between text-xs"
              >
                <div className="truncate pr-1">
                  <span className="font-mono text-[10px] text-amber-300/90 block">{m.code}</span>
                  <span className="text-slate-300 truncate block text-[11px] font-medium" title={m.name}>
                    {m.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-200 text-xs shrink-0">
                  {m.minQty} {m.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Movement - Clean Single Row */}
        {moves.length > 0 && (
          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              ประวัติการเบิกจ่ายล่าสุด
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/30 border border-slate-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="text-[10px] text-emerald-300 font-mono font-bold shrink-0">
                  {moves[0].kind === "in" ? "รับเข้า" : "เบิกจ่าย"}
                </span>
                <span className="text-slate-300 truncate text-[11px]">{moves[0].desc}</span>
              </div>
              <span className="text-slate-400 text-[11px] shrink-0 font-mono">
                {moves[0].person.split(" ")[0]}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
        <span>คลังพัสดุและวัสดุสำนักงาน</span>
        <span className="text-amber-300 font-medium">บันทึกสด</span>
      </div>
    </div>
  );
}
