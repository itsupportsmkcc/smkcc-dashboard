"use client";

import React, { useEffect, useState } from "react";
import { SystemOverview } from "@/lib/types";
import {
  BarChart2,
  Server,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
  AlertTriangle,
  Clock,
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
  isSimulatingAlert?: boolean;
  onToggleSimulateAlert?: () => void;
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
  isSimulatingAlert,
  onToggleSimulateAlert,
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("th-TH", {
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
    <header className="border-b border-slate-800/80 bg-[#070b14]/95 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 py-2.5 transition-all shadow-md">
      <div className="w-full max-w-[2160px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Official College Logo & Clean Branding */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-amber-500/25 p-1 shadow-sm shrink-0">
            <img
              src="/logo-smkcc.png"
              alt="ตราสัญลักษณ์ วิทยาลัยชุมชนสมุทรสาคร"
              className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(245,158,11,0.2)]"
            />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="ping-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap flex items-center gap-2">
              <span>SMKCC Nexus</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
                v2.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
              วิทยาลัยชุมชนสมุทรสาคร
            </p>
          </div>
        </div>

        {/* Center: Sleek Segmented Switch */}
        <div className="flex items-center bg-[#0d1424] p-1 rounded-xl border border-slate-800 shadow-inner shrink-0 self-center">
          <button
            onClick={() => onChangeTab("analytics")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeTab === "analytics"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>สถิติบริหาร</span>
          </button>

          <button
            onClick={() => onChangeTab("noc")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeTab === "noc"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>สถานะระบบ NOC</span>
          </button>
        </div>

        {/* Right: Operational Status Pill, Clock & Compact Toolbar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 self-end md:self-center">
          {/* Status Badge Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              overall === "all_operational"
                ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30"
                : overall === "degraded"
                ? "bg-amber-950/60 text-amber-300 border-amber-500/30"
                : "bg-red-950/70 text-red-300 border-red-500/40 animate-pulse"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                overall === "all_operational"
                  ? "bg-emerald-400"
                  : overall === "degraded"
                  ? "bg-amber-400"
                  : "bg-red-500 animate-ping"
              }`}
            />
            <span className="font-semibold text-[11px] whitespace-nowrap">
              {overall === "all_operational"
                ? "ทุกระบบปกติ"
                : overall === "degraded"
                ? "บางบริการช้าลง"
                : "มีระบบขัดข้อง"}
            </span>
          </div>

          {/* Clean Digital Time */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0d1424] border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeStr || "กำลังโหลด..."}</span>
          </div>

          {/* Unified Action Toolbar */}
          <div className="flex items-center bg-[#0d1424] p-0.5 rounded-xl border border-slate-800">
            {/* Refresh Button */}
            <button
              onClick={onRefreshAll}
              disabled={isRefreshing}
              title="รีเฟรชข้อมูลสด"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : "text-slate-400"}`}
              />
              <span className="text-[11px] font-mono text-emerald-400 font-bold hidden sm:inline">
                ({countdown}s)
              </span>
            </button>

            {/* TV 75" Mode Toggle */}
            {onToggleTvMode && (
              <button
                onClick={onToggleTvMode}
                title={isTvMode ? "ปิดโหมดจอทีวี" : "เปิดโหมดจอทีวี 75 นิ้ว"}
                className={`p-1.5 rounded-lg transition-all ${
                  isTvMode
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Kiosk Fullscreen */}
            <button
              onClick={onToggleKiosk}
              title={isKiosk ? "ออกจากโหมดเต็มจอ" : "โหมดเต็มจอ"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              {isKiosk ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Sound Alert Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? "ปิดเสียงเตือน" : "เปิดเสียงเตือนระบบ"}
              className={`p-1.5 rounded-lg transition-all ${
                soundEnabled
                  ? "text-emerald-400 bg-emerald-950/60"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Red Alert / Emergency Simulation Toggle */}
            {onToggleSimulateAlert && (
              <button
                onClick={onToggleSimulateAlert}
                title={isSimulatingAlert ? "ปิดโหมดจำลองเตือนภัย" : "ทดสอบสัญญาณเตือนฉุกเฉิน"}
                className={`p-1.5 rounded-lg transition-all ${
                  isSimulatingAlert
                    ? "bg-red-600 text-white animate-pulse"
                    : "text-slate-400 hover:text-red-400 hover:bg-slate-800"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Settings Modal Button */}
            <button
              onClick={onOpenSettings}
              title="ตั้งค่าระบบ"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
