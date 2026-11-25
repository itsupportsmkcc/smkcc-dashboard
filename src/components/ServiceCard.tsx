"use client";

import React, { useState } from "react";
import { ServiceDefinition, ServiceHealthSnapshot } from "@/lib/types";
import {
  ExternalLink,
  RefreshCw,
  Database,
  Globe,
  Radio,
  Cpu,
} from "lucide-react";
import { formatLatency, formatUptimePercent, timeAgo } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceDefinition;
  snapshot?: ServiceHealthSnapshot;
  onRefresh: (serviceId: string) => void;
  isRefreshing: boolean;
}

export function ServiceCard({
  service,
  snapshot,
  onRefresh,
  isRefreshing,
}: ServiceCardProps) {
  const [hoveredBar, setHoveredBar] = useState<{
    date: string;
    uptime: number;
    status: string;
  } | null>(null);

  const status = snapshot?.status || "operational";
  const latency = snapshot?.latencyMs ?? null;
  const lastChecked = snapshot?.lastChecked ? timeAgo(snapshot.lastChecked) : "เพิ่งเริ่มระบบ";
  const uptime30d = snapshot?.uptimePercent30d ?? 100;
  const history30d = snapshot?.history30d || [];

  return (
    <div
      className={`rounded-xl border bg-[#0b1322]/80 backdrop-blur-md p-4 sm:p-5 transition-all duration-300 hover:border-cyan-500/50 hover:bg-[#0e172a]/90 relative overflow-hidden group flex flex-col justify-between h-full hud-corner shadow-md shadow-black/30 ${
        status === "down"
          ? "border-red-800/60 glow-red"
          : status === "degraded"
          ? "border-amber-800/60 glow-yellow"
          : "border-slate-800/80"
      }`}
    >
      {/* Top Section: Title, Category, Topology, Tags & Description */}
      <div className="flex-1 flex flex-col justify-start min-h-[96px]">
        {/* Top Row: Service Name, Category & Actions */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 min-w-0">
              <h3 className="font-semibold text-base text-white tracking-tight truncate" title={service.name}>
                {service.name}
              </h3>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground shrink-0">
                {service.category}
              </span>
            </div>

            {/* Topology & Strategic Tags */}
            <div className="flex items-center gap-1.5 mb-1.5 h-[24px] overflow-hidden flex-nowrap">
              {service.infra && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 flex items-center gap-1 shrink-0">
                  <Cpu className="w-2.5 h-2.5 text-cyan-400" />
                  {service.infra}
                </span>
              )}
              {service.tags &&
                service.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50 shrink-0 truncate max-w-[140px]"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 line-clamp-1" title={service.description}>
              {service.description}
            </p>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
            {/* Refresh single service */}
            <button
              onClick={() => onRefresh(service.id)}
              disabled={isRefreshing}
              title="ทดสอบสถานะระบบนี้ใหม่"
              className="p-1.5 rounded-lg bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
            </button>

            {/* External App Link */}
            {service.appUrl && (
              <a
                href={service.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`เปิดหน้าระบบ: ${service.appUrl}`}
                className="p-1.5 rounded-lg bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-white transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Status Pill & 30-Day Uptime Bar (Anchored in the exact same horizontal plane) */}
      <div className="mt-auto pt-2">
        {/* Middle Row: Status Badge, Latency & Check Details */}
        <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-slate-900/80 border border-slate-800 mb-3 min-h-[42px] h-[42px]">
          {/* Status indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              {status === "operational" && (
                <>
                  <span className="ping-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              )}
              {status === "degraded" && (
                <>
                  <span className="ping-beacon absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </>
              )}
              {status === "down" && (
                <>
                  <span className="ping-beacon absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </>
              )}
            </span>

            <span
              className={`text-xs font-semibold ${
                status === "operational"
                  ? "text-emerald-400"
                  : status === "degraded"
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
            >
              {status === "operational"
                ? "เปิดให้บริการปกติ"
                : status === "degraded"
                ? "ความเร็วช้ากว่าปกติ"
                : "ระบบขัดข้อง (Offline)"}
            </span>
          </div>

          {/* Latency & Badges */}
          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            {/* Latency Sparkline */}
            <div className="flex items-center gap-1.5 text-muted-foreground bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              <Radio className="w-3 h-3 text-cyan-400" />
              <svg className="w-6 h-2.5 text-cyan-400/80 hidden sm:block" viewBox="0 0 24 10" fill="none">
                <path
                  d="M0,5 L5,5 L8,1 L11,9 L14,2 L17,7 L20,5 L24,5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <strong className="text-foreground">{formatLatency(latency)}</strong>
            </div>

            {/* Database indicator */}
            {snapshot?.dbStatus && snapshot.dbStatus !== "skipped" && (
              <span
                title={snapshot.dbStatus === "connected" ? "ฐานข้อมูลเชื่อมต่อสมบูรณ์ (Connected)" : "ฐานข้อมูลขัดข้อง (Disconnected)"}
                className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 shrink-0 ${
                  snapshot.dbStatus === "connected"
                    ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/40"
                    : "bg-red-950/40 text-red-300 border-red-800/40"
                }`}
              >
                <Database className="w-2.5 h-2.5 text-emerald-400" />
                {snapshot.dbStatus === "connected" ? "DB OK" : "DB FAIL"}
              </span>
            )}

            {/* HTTP indicator */}
            {snapshot?.httpStatus && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border flex items-center gap-1">
                <Globe className="w-2.5 h-2.5" />
                {snapshot.httpStatus}
              </span>
            )}
          </div>
        </div>

        {/* 30-Day Uptime History Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
            <span className="font-mono text-slate-400 text-[10px] uppercase tracking-wider">
              Uptime 30D Heatmap
            </span>
            <div className="flex items-center gap-2">
              {hoveredBar ? (
                <span className="font-mono text-foreground font-semibold">
                  {hoveredBar.date}: {hoveredBar.uptime}%
                </span>
              ) : (
                <span className="font-mono text-foreground font-semibold">
                  {formatUptimePercent(uptime30d)}
                </span>
              )}
            </div>
          </div>

          {/* 30 Bar Segments */}
          <div className="flex items-center gap-[3px] h-6 bg-slate-950/60 p-1 rounded-md border border-slate-800/60">
            {history30d.map((bar, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredBar(bar)}
                onMouseLeave={() => setHoveredBar(null)}
                className={`flex-1 h-full rounded-[2px] transition-all cursor-pointer hover:scale-y-125 ${
                  bar.status === "operational"
                    ? "bg-emerald-500/80 hover:bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.3)]"
                    : bar.status === "degraded"
                    ? "bg-amber-500 hover:bg-amber-400"
                    : "bg-red-500 hover:bg-red-400"
                }`}
                title={`${bar.date}: ${bar.uptime}% (${bar.status})`}
              />
            ))}
          </div>

          {/* Bottom row: 30 days ago vs today */}
          <div className="flex justify-between items-center text-[10px] text-muted-foreground/60 mt-1 font-mono">
            <span>30D AGO</span>
            <span className="text-muted-foreground">POLL {lastChecked}</span>
            <span>TODAY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
