"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Play, Pause, Trash2, Shield, Radio, ChevronDown, ChevronUp } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "HEALTH" | "PING" | "LINE" | "AUDIT" | "SECURITY";
  target: string;
  latency?: string;
  status: "OK" | "NOMINAL" | "ACTIVE" | "VERIFIED";
  message: string;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: "log-1",
    timestamp: "09:58:02.104",
    type: "HEALTH",
    target: "smkcc-netmonitor",
    latency: "19ms",
    status: "OK",
    message: "UniNet Dedicated Fiber 10G link nominal (RTT: 19ms, 0 loss)",
  },
  {
    id: "log-2",
    timestamp: "09:58:05.421",
    type: "PING",
    target: "smcc-admission",
    latency: "84ms",
    status: "OK",
    message: "Neon Cloud SG query health check verified (HTTP 200)",
  },
  {
    id: "log-3",
    timestamp: "09:58:09.832",
    type: "LINE",
    target: "LINE Messaging API",
    status: "ACTIVE",
    message: "LINE Webhook dispatch daemon ready (Push channel verified)",
  },
  {
    id: "log-4",
    timestamp: "09:58:14.210",
    type: "AUDIT",
    target: "smkcc-student-care",
    latency: "28ms",
    status: "NOMINAL",
    message: "R&D Pilot cohort session listener active (PostgreSQL 5434 connected)",
  },
  {
    id: "log-5",
    timestamp: "09:58:18.640",
    type: "SECURITY",
    target: "smkcc-assetx",
    latency: "185ms",
    status: "VERIFIED",
    message: "Supabase AU connection pooler encrypted TLS 1.3 handshaked",
  },
];

const ROTATING_TARGETS = [
  { target: "attendance-system", type: "PING" as const, latency: "78ms", msg: "Neon PostgreSQL check: 24h attendance logs sync verified" },
  { target: "smkcc-kumwatsadu", type: "HEALTH" as const, latency: "92ms", msg: "Inventory DB replica healthy (Neon Serverless cluster)" },
  { target: "new-smkcc-web", type: "PING" as const, latency: "22ms", msg: "Directus CMS API ping responded (HTTP 200 OK)" },
  { target: "smkcc-it-helpdesk", type: "HEALTH" as const, latency: "115ms", msg: "Helpdesk portal & LINE Notify bridge synced" },
  { target: "central-noc-daemon", type: "SECURITY" as const, latency: "14ms", msg: "Cyber telemetry heartbeat: All 8 nodes within SLA thresholds" },
];

export function NocLiveTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Append simulated real-time telemetry log every 5 seconds if not paused
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const randomItem = ROTATING_TARGETS[Math.floor(Math.random() * ROTATING_TARGETS.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;

      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        type: randomItem.type,
        target: randomItem.target,
        latency: randomItem.latency,
        status: "OK",
        message: randomItem.msg,
      };

      setLogs(prev => [...prev.slice(-25), newLog]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto scroll to bottom
  useEffect(() => {
    if (logContainerRef.current && isExpanded) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  return (
    <div className="mt-8 rounded-xl border border-cyan-500/25 bg-[#060b14] overflow-hidden shadow-2xl backdrop-blur-md hud-corner">
      {/* Terminal Top Window Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a1120] border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Mac/Linux style window dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-cyan-300">SMKCC-NOC-DAEMON</span>
            <span className="text-slate-500">//</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">LIVE TELEMETRY & AUDIT STREAM</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-[10px] font-mono text-cyan-300 mr-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
            <span>{isPaused ? "STREAM PAUSED" : "MONITORING ACTIVE"}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume Live Stream" : "Pause Live Stream"}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setLogs([])}
            title="Clear Stream"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Log Console */}
      {isExpanded && (
        <div
          ref={logContainerRef}
          className="p-3.5 font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto bg-[#040810]/95 select-text"
        >
          {logs.length === 0 ? (
            <div className="text-slate-500 py-3 text-center italic">Waiting for incoming telemetry packets...</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="flex items-start gap-2.5 hover:bg-cyan-950/20 px-1.5 py-0.5 rounded transition-colors leading-relaxed">
                <span className="text-slate-500 shrink-0 text-[11px]">[{log.timestamp}]</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                    log.type === "SECURITY"
                      ? "bg-purple-950/80 text-purple-300 border border-purple-800/40"
                      : log.type === "LINE"
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/40"
                      : log.type === "PING"
                      ? "bg-cyan-950/80 text-cyan-300 border border-cyan-800/40"
                      : "bg-slate-800 text-slate-300 border border-slate-700/50"
                  }`}
                >
                  {log.type}
                </span>
                <span className="text-cyan-400 font-semibold shrink-0">{log.target}</span>
                {log.latency && (
                  <span className="text-emerald-400/90 shrink-0 text-[11px]">({log.latency})</span>
                )}
                <span className="text-slate-300 text-[11px] truncate">{log.message}</span>
                <span className="ml-auto text-[10px] text-emerald-400 font-bold shrink-0">{log.status}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Terminal Footer info */}
      <div className="px-4 py-1.5 bg-[#080d1a] border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-3">
          <span>HOST: SMKCC-CENTRAL-NODE</span>
          <span className="hidden sm:inline">PROTOCOL: TCP/REST/WS</span>
          <span className="text-emerald-400">ENCRYPTION: AES-256-GCM</span>
        </div>
        <div>BUFFER: {logs.length}/25 RECORDS</div>
      </div>
    </div>
  );
}
