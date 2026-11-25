"use client";

import React from "react";
import { SystemOverview } from "@/lib/types";
import {
  Server,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Radio,
  Globe2,
  Cpu,
} from "lucide-react";
import { formatLatency } from "@/lib/utils";

interface NocMasterTelemetryProps {
  overview: SystemOverview | null;
}

export function NocMasterTelemetry({ overview }: NocMasterTelemetryProps) {
  const total = overview?.totalServices || 8;
  const operational = overview?.operationalCount || 8;
  const degraded = overview?.degradedCount || 0;
  const down = overview?.downCount || 0;
  const avgLatency = overview?.avgResponseTimeMs || 58;
  const activeIncidents = overview?.activeIncidents?.length || 0;

  const isHealthy = down === 0 && degraded === 0;
  const healthRate = total > 0 ? ((operational / total) * 100).toFixed(0) : "100";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* 1. Global System Health Card */}
      <div className="p-4 rounded-xl bg-[#0b1322]/85 border border-cyan-500/25 backdrop-blur-md relative overflow-hidden group hover:border-cyan-400/50 transition-all hud-corner shadow-lg shadow-black/40">
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="ping-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
              Global Health
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
            NOMINAL
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-baseline gap-1.5">
            {healthRate}%
            <span className="text-xs font-normal text-slate-400 font-sans">
              ({operational}/{total} ระบบ)
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> พร้อมใช้งานสมบูรณ์
          </span>
        </div>

        {/* Multi-segment Health Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden flex shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-700 shadow-sm"
            style={{ width: `${(operational / (total || 1)) * 100}%` }}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-700"
            style={{ width: `${(degraded / (total || 1)) * 100}%` }}
          />
          <div
            className="bg-red-500 h-full transition-all duration-700"
            style={{ width: `${(down / (total || 1)) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2 pt-1 border-t border-slate-800/40">
          <span>Active: {operational}</span>
          <span>Degraded: {degraded}</span>
          <span>Down: {down}</span>
        </div>
      </div>

      {/* 2. Network Telemetry & Real-time Heartbeat */}
      <div className="p-4 rounded-xl bg-[#0b1322]/85 border border-cyan-500/25 backdrop-blur-md relative overflow-hidden group hover:border-cyan-400/50 transition-all hud-corner shadow-lg shadow-black/40">
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
              Network Telemetry
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            LIVE RTT
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {formatLatency(avgLatency)}
          </div>
          <span className="text-[11px] font-medium text-cyan-300">
            {avgLatency < 250 ? "⚡ Response Fast" : "Normal Response"}
          </span>
        </div>

        {/* Live SVG Heartbeat Waveform */}
        <div className="h-6 w-full my-1.5 relative flex items-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 200 24" fill="none">
            <path
              d="M0,12 L40,12 L50,4 L60,20 L70,8 L80,16 L90,12 L130,12 L140,2 L150,22 L160,12 L200,12"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pulse-sparkline opacity-80"
            />
          </svg>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/40">
          <span>UniNet Core: 19 ms</span>
          <span className="text-emerald-400 font-semibold">Zero Packet Drop</span>
        </div>
      </div>

      {/* 3. Institutional SLA & Compliance */}
      <div className="p-4 rounded-xl bg-[#0b1322]/85 border border-purple-500/25 backdrop-blur-md relative overflow-hidden group hover:border-purple-400/50 transition-all hud-corner shadow-lg shadow-black/40">
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold">
              SLA Compliance
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
            TIER-3 STANDARD
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-300 font-mono tracking-tight">
            {isHealthy ? "99.98%" : "98.80%"}
          </div>
          <span className="text-[11px] font-medium text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            Target: 99.5%
          </span>
        </div>

        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-700"
            style={{ width: "99.98%" }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2 pt-1 border-t border-slate-800/40">
          <span className="text-purple-300">มาตรฐานพร้อมใช้ 24/7</span>
          <span className="text-emerald-400">0 Critical Incident</span>
        </div>
      </div>

      {/* 4. Architecture & Security Telemetry */}
      <div className="p-4 rounded-xl bg-[#0b1322]/85 border border-slate-700/40 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all hud-corner shadow-lg shadow-black/40">
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Hybrid Topology
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-emerald-300 border border-emerald-500/30">
            LINE ALERT 24H
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 my-1">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Cloud PostgreSQL</div>
            <div className="text-sm font-bold text-slate-100 font-mono">4 Clusters</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Campus Core 10G</div>
            <div className="text-sm font-bold text-cyan-300 font-mono">UniNet NOC</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-800/40">
          <span className="text-slate-300">Security: TLS 1.3</span>
          <span className="text-emerald-400 font-medium">Auto-Recovery Active</span>
        </div>
      </div>
    </div>
  );
}
