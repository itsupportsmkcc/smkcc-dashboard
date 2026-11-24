"use client";

import React from "react";
import { IncidentRecord } from "@/lib/types";
import { AlertOctagon, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { timeAgo } from "@/lib/utils";

interface IncidentBannerProps {
  incidents: IncidentRecord[];
  onAcknowledge: (id: string) => void;
}

export function IncidentBanner({ incidents, onAcknowledge }: IncidentBannerProps) {
  const active = incidents.filter(i => !i.isResolved);
  if (active.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {active.map(incident => (
        <div
          key={incident.id}
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md transition-all ${
            incident.severity === "critical"
              ? "bg-red-950/40 border-red-800/60 text-red-200 glow-red"
              : "bg-amber-950/40 border-amber-800/60 text-amber-200 glow-yellow"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg shrink-0 ${
                incident.severity === "critical"
                  ? "bg-red-900/60 text-red-400"
                  : "bg-amber-900/60 text-amber-400"
              }`}
            >
              {incident.severity === "critical" ? (
                <AlertOctagon className="w-5 h-5 animate-bounce" />
              ) : (
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-white">{incident.title}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 font-mono text-muted-foreground">
                  เริ่มพบปัญหา {timeAgo(incident.startedAt)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{incident.details}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => onAcknowledge(incident.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all border border-white/10"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>รับทราบแล้ว / ปิดแจ้งเตือน</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
