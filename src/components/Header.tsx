"use client";

import React, { useEffect, useState } from "react";
import { SystemOverview } from "@/lib/types";
import {
  Activity,
  BarChart3,
  Server,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Sparkles,
  Tv,
} from "lucide-react";

interface HeaderProps {
  overview: SystemOverview | null;
  activeTab: "analytics" | "noc";
  onChangeTab: (tab: "analytics" | "noc") => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isKiosk: boolean;
  onToggleKiosk: () => void;
  isTvMode?: boolean;
  onToggleTvMode?: () => void;
  onOpenSettings: () => void;
  onRefreshAll: () => void;
  isRefreshing: boolean;
  countdown: number;
}

export function Header({
  overview,
  activeTab,
  onChangeTab,
  soundEnabled,
  onToggleSound,
  isKiosk,
  onToggleKiosk,
  isTvMode = false,
  onToggleTvMode,
  onOpenSettings,
  onRefreshAll,
  isRefreshing,
  countdown,
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const overall = overview?.overallStatus || "all_operational";

  return (
    <header className="border-b border-border/80 bg-[#0a0f1d]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3 transition-all shadow-xl">
      <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left: Official College Logo & Branding */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.04] border border-amber-500/30 p-1.5 shadow-lg shadow-black/50 group shrink-0">
            <img
              src="/logo-smkcc.png"
              alt="ตราสัญลักษณ์ วิทยาลัยชุมชนสมุทรสาคร"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform"
            />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="ping-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-sm"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                SMKCC Unified Dashboard
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE COMMAND
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              วิทยาลัยชุมชนสมุทรสาคร • ศูนย์ข้อมูลสถิติและการมอนิเตอร์ระบบสารสนเทศ ({overview?.totalServices || 8} ระบบออนไลน์)
            </p>
          </div>
        </div>

        {/* Center: Dual Tab Switcher */}
        <div className="flex items-center self-start xl:self-center bg-[#131b2e] p-1.5 rounded-2xl border border-border/80 shadow-inner">
          <button
            onClick={() => onChangeTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>ข้อมูลสถิติเชิงบริหาร (Analytics)</span>
          </button>

          <button
            onClick={() => onChangeTab("noc")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === "noc"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Server className="w-4 h-4" />
            <span>สถานะระบบ & Uptime (Central NOC)</span>
          </button>
        </div>

        {/* Right: Operational Pill, Clock, and Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status Badge Pill */}
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shadow-md ${
              overall === "all_operational"
                ? "bg-emerald-950/70 text-emerald-300 border-emerald-600/50 glow-green"
                : overall === "degraded"
                ? "bg-amber-950/70 text-amber-300 border-amber-600/50 glow-yellow"
                : "bg-red-950/80 text-red-300 border-red-600/60 glow-red animate-pulse"
            }`}
          >
            {overall === "all_operational" && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            {overall === "degraded" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {overall === "critical_outage" && <AlertOctagon className="w-4 h-4 text-red-400" />}
            <span>
              {overall === "all_operational"
                ? "ทุกระบบออนไลน์ 100%"
                : overall === "degraded"
                ? "บางบริการช้าลง"
                : "มีระบบขัดข้อง"}
            </span>
          </div>

          {/* Clock */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131b2e] border border-border text-xs text-slate-300 font-mono shadow-sm">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{timeStr || "กำลังโหลด..."}</span>
          </div>

          {/* Sound Alert Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "ปิดเสียงเตือน" : "เปิดเสียงเตือนเมื่อระบบมีปัญหา"}
            className={`p-2.5 rounded-xl border transition-all ${
              soundEnabled
                ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30"
                : "bg-[#131b2e] border-border text-slate-400 hover:text-white"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Refresh Button with Countdown */}
          <button
            onClick={onRefreshAll}
            disabled={isRefreshing}
            title="กดเพื่อตรวจเช็คและดึงข้อมูลสดทันที"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131b2e] border border-border hover:bg-secondary text-xs font-semibold text-white transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : "text-slate-400"}`} />
            <span className="hidden sm:inline">รีเฟรช</span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">({countdown}s)</span>
          </button>

          {/* TV 75" Mode Toggle */}
          {onToggleTvMode && (
            <button
              onClick={onToggleTvMode}
              title={isTvMode ? "ปิดโหมดจอทีวี (กลับสู่มุมมองปกติ)" : "เปิดโหมดจอทีวี 75 นิ้ว (ปรับขนาดพอดีจอ ไม่ต้องเลื่อนเมาส์ ตัวเลขเด่นชัด)"}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                isTvMode
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-emerald-950/60 ring-2 ring-emerald-500/50"
                  : "bg-[#131b2e] border-border text-slate-300 hover:text-white hover:border-slate-500"
              }`}
            >
              <Tv className={`w-4 h-4 ${isTvMode ? "text-white" : "text-emerald-400"}`} />
              <span className="hidden sm:inline">โหมดจอทีวี 75"</span>
              {isTvMode && (
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse ml-0.5" />
              )}
            </button>
          )}

          {/* Kiosk Mode Toggle */}
          <button
            onClick={onToggleKiosk}
            title={isKiosk ? "ออกจากโหมดเต็มจอ" : "โหมดเต็มจอ NOC Kiosk"}
            className="p-2.5 rounded-xl bg-[#131b2e] border border-border text-slate-400 hover:text-white transition-all shadow-sm"
          >
            {isKiosk ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            title="ตั้งค่าระบบและรายการบริการ"
            className="p-2.5 rounded-xl bg-[#131b2e] border border-border text-slate-400 hover:text-white transition-all shadow-sm"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
