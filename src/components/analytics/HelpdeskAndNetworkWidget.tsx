"use client";

import React from "react";
import { HelpdeskMetrics, NetworkMetricsSummary } from "@/lib/analytics";
import { Wrench, Network, ExternalLink, ShieldCheck, Wifi, Cpu, CheckCircle2 } from "lucide-react";

interface HelpdeskAndNetworkWidgetProps {
  helpdesk?: HelpdeskMetrics;
  network?: NetworkMetricsSummary;
}

export function HelpdeskAndNetworkWidget({ helpdesk, network }: HelpdeskAndNetworkWidgetProps) {
  const helpdeskUrl = "https://smkcc-it-helpdesk.vercel.app/admin/dashboard";
  const networkUrl = "http://192.168.100.172:3000/playlists/play/cg557lrew2ewwb?kiosk";

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-[#101826]/95 backdrop-blur-md p-5 shadow-md flex flex-col justify-between h-full space-y-4">
      {/* 1. IT Helpdesk Section */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-300">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm text-slate-100">SMKCC IT Helpdesk</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/25">
                  สนับสนุนการปฏิบัติงาน
                </span>
              </div>
              <p className="text-[11px] text-slate-400">งานแจ้งซ่อมและสนับสนุนสารสนเทศ</p>
            </div>
          </div>

          <a
            href={helpdeskUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าสู่ระบบ SMKCC IT Helpdesk"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors shrink-0"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-xl font-bold text-slate-100 font-mono">{helpdesk?.totalTickets ?? 2}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">เคสทั้งหมด</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-xl font-bold text-emerald-300 font-mono flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {helpdesk?.resolvedTickets ?? 2}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">สำเร็จ (100%)</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-xl font-bold text-slate-400 font-mono">{helpdesk?.pendingTickets ?? 0}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">รอดำเนินการ</div>
          </div>
        </div>
      </div>

      {/* 2. Network Section */}
      <div className="pt-3 border-t border-slate-800/50">
        <div className="flex items-center justify-between pb-2.5 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-300">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm text-slate-100">SMKCC Network NOC</h4>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/25">
                  ความพร้อมใช้งาน
                </span>
              </div>
              <p className="text-[11px] text-slate-400">UniNet 10G, FortiGate 120G, Ruijie AP</p>
            </div>
          </div>

          <a
            href={networkUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าสู่ระบบจอทีวีห้อง NOC (Grafana Kiosk)"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors shrink-0"
          >
            <span>จอ Grafana</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-sm font-bold text-slate-100 font-mono flex items-center justify-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-sky-300" />
              10 Gbps
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">ความเร็วหลัก</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-sm font-bold text-emerald-300 font-mono flex items-center justify-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-300" />
              15 APs
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Wi-Fi ปล่อยสด</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-sm font-bold text-emerald-300 font-mono flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              99.5%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">SLA Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}
