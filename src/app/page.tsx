"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  ServiceDefinition,
  ServiceHealthSnapshot,
  SystemOverview,
  IncidentRecord,
} from "@/lib/types";
import { ExecutiveDashboardData } from "@/lib/analytics";
import { Header } from "@/components/Header";
import { IncidentBanner } from "@/components/IncidentBanner";
import { MetricsCards } from "@/components/MetricsCards";
import { NocMasterTelemetry } from "@/components/NocMasterTelemetry";
import { NocLiveTerminal } from "@/components/NocLiveTerminal";
import { ServiceCard } from "@/components/ServiceCard";
import { SettingsModal } from "@/components/SettingsModal";
import { ExecutiveOverviewCards } from "@/components/analytics/ExecutiveOverviewCards";
import { AdmissionWidget } from "@/components/analytics/AdmissionWidget";
import { AttendanceWidget } from "@/components/analytics/AttendanceWidget";
import { StudentCareWidget } from "@/components/analytics/StudentCareWidget";
import { AssetWidget } from "@/components/analytics/AssetWidget";
import { WatsaduWidget } from "@/components/analytics/WatsaduWidget";
import { HelpdeskAndNetworkWidget } from "@/components/analytics/HelpdeskAndNetworkWidget";
import { playAlertTone, startContinuousSiren, stopContinuousSiren } from "@/lib/audio";
import {
  Activity,
  Server,
  Filter,
  BarChart3,
  Database,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "noc">("analytics");
  const [services, setServices] = useState<ServiceDefinition[]>([]);
  const [snapshots, setSnapshots] = useState<Record<string, ServiceHealthSnapshot>>({});
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [analyticsData, setAnalyticsData] = useState<ExecutiveDashboardData | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isKiosk, setIsKiosk] = useState(false);
  const [isTvMode, setIsTvMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshingServiceId, setRefreshingServiceId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isSimulatingAlert, setIsSimulatingAlert] = useState(false);
  const [isAlertSilenced, setIsAlertSilenced] = useState(false);

  const prevDownCountRef = useRef<number>(0);

  const isEmergencyActive =
    (isSimulatingAlert || ((overview?.downCount || 0) > 0 || overview?.overallStatus === "critical_outage")) &&
    !isAlertSilenced;

  const toggleSimulateAlert = () => {
    if (isEmergencyActive) {
      setIsSimulatingAlert(false);
      setIsAlertSilenced(true);
      stopContinuousSiren();
    } else {
      setIsSimulatingAlert(true);
      setIsAlertSilenced(false);
      startContinuousSiren();
    }
  };

  const handleSilenceAlert = () => {
    setIsSimulatingAlert(false);
    setIsAlertSilenced(true);
    stopContinuousSiren();
  };

  // Cleanup audio loop on unmount
  useEffect(() => {
    return () => {
      stopContinuousSiren();
    };
  }, []);

  // Load sound & TV mode settings from localStorage or URL query (?tv=true)
  useEffect(() => {
    const savedSound = localStorage.getItem("smkcc_noc_sound");
    if (savedSound === "true") setSoundEnabled(true);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tvParam = params.get("tv");
      const savedTv = localStorage.getItem("smkcc_tv_mode");
      if (tvParam === "true" || savedTv === "true") {
        setIsTvMode(true);
      }
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem("smkcc_noc_sound", String(next));
      if (next) {
        playAlertTone("warning");
      }
      return next;
    });
  };

  const toggleKiosk = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsKiosk(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsKiosk(false);
    }
  };

  const toggleTvMode = () => {
    setIsTvMode(prev => {
      const next = !prev;
      localStorage.setItem("smkcc_tv_mode", String(next));
      if (next && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsKiosk(true);
      }
      return next;
    });
  };

  // Fetch all status & analytics
  const fetchAllData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const [statusRes, analyticsRes] = await Promise.all([
        fetch("/api/status", { cache: "no-store" }),
        fetch(isManual ? "/api/analytics?refresh=true" : "/api/analytics", { cache: "no-store" }),
      ]);

      if (statusRes.ok) {
        const data = await statusRes.json();
        setServices(data.services || []);
        setSnapshots(data.snapshots || {});
        setOverview(data.overview || null);
        setIncidents(data.incidents || []);

        const currentDown = data.overview?.downCount || 0;
        if (currentDown > prevDownCountRef.current && soundEnabled) {
          setIsAlertSilenced(false);
          startContinuousSiren();
        } else if (currentDown === 0 && !isSimulatingAlert) {
          stopContinuousSiren();
        }
        prevDownCountRef.current = currentDown;
      }

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setAnalyticsData(aData);
      }
    } catch (err) {
      console.error("Fetch data error:", err);
    } finally {
      if (isManual) setIsRefreshing(false);
      setCountdown(30);
    }
  }, [soundEnabled]);

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Periodic interval countdown & auto-refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchAllData();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchAllData]);

  // Refresh single service
  const handleRefreshSingle = async (serviceId: string) => {
    setRefreshingServiceId(serviceId);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });
      const data = await res.json();
      if (data.snapshot) {
        setSnapshots(prev => ({ ...prev, [serviceId]: data.snapshot }));
      }
    } catch (err) {
      console.error("Refresh single service failed:", err);
    } finally {
      setRefreshingServiceId(null);
    }
  };

  // Acknowledge incident
  const handleAcknowledgeIncident = async (id: string) => {
    try {
      await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchAllData(true);
    } catch (err) {
      console.error("Acknowledge incident error:", err);
    }
  };

  // Save service from Settings
  const handleSaveService = async (service: ServiceDefinition) => {
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "บันทึกข้อมูลไม่สำเร็จ");
    }
    fetchAllData(true);
  };

  // Delete service
  const handleDeleteService = async (id: string) => {
    if (!confirm("ต้องการลบระบบนี้ออกจากการมอนิเตอร์ใช่หรือไม่?")) return;
    await fetch(`/api/services?id=${id}`, { method: "DELETE" });
    fetchAllData(true);
  };

  // Re-run auto discovery
  const handleTriggerAutoDiscovery = async () => {
    await fetch("/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autoDiscover: true }),
    });
    fetchAllData(true);
  };

  // Filtered services for NOC tab
  const categories = ["all", ...Array.from(new Set(services.map(s => s.category)))];
  const allTags = ["all", ...Array.from(new Set(services.flatMap(s => s.tags || [])))];
  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchesTag = selectedTag === "all" || (s.tags && s.tags.includes(selectedTag));
    return matchesCategory && matchesTag;
  });

  return (
    <div className={`min-h-screen flex flex-col bg-[#050811] cyber-grid text-slate-100 ${isTvMode ? "tv-mode" : ""} ${isKiosk ? "p-1 sm:p-2" : ""}`}>
      {/* Header with Dual Tab Switcher */}
      <Header
        overview={overview}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        isKiosk={isKiosk}
        onToggleKiosk={toggleKiosk}
        isTvMode={isTvMode}
        onToggleTvMode={toggleTvMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefreshAll={() => fetchAllData(true)}
        isRefreshing={isRefreshing}
        countdown={countdown}
        isSimulatingAlert={isEmergencyActive}
        onToggleSimulateAlert={toggleSimulateAlert}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Incident Alert Banner */}
        <IncidentBanner
          incidents={incidents}
          onAcknowledge={handleAcknowledgeIncident}
        />

        {/* TAB 1: EXECUTIVE ANALYTICS DASHBOARD (Comfortable Dark Slate Theme) */}
        {activeTab === "analytics" && (
          <div className="space-y-4 animate-in fade-in duration-300 p-2 sm:p-4 rounded-3xl bg-gradient-to-b from-[#0b101d]/80 via-[#0a0e1a]/70 to-[#080c16]/80 border border-slate-800/40 shadow-xl">
            {/* Top Minimal Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
                    <span>แดชบอร์ดสรุปข้อมูลเชิงบริหาร (Executive Analytics)</span>
                    {isTvMode && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-medium">
                        โหมดจอทีวี 75"
                      </span>
                    )}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 border border-slate-700/40 flex items-center gap-1.5 font-mono shadow-sm">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  อัปเดตล่าสุด: {analyticsData?.lastUpdated ? new Date(analyticsData.lastUpdated).toLocaleTimeString("th-TH") : "กำลังโหลด..."}
                </span>
              </div>
            </div>

            {/* Row 1: 5 Big Overview KPI Cards */}
            <ExecutiveOverviewCards data={analyticsData} />

            {/* Main Command Center: 3-Column Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
              {/* Column 1: ด้านการศึกษาและนักศึกษา (Academics & Students) */}
              <div className="flex flex-col gap-4">
                <AdmissionWidget admission={analyticsData?.admission} />
                <AttendanceWidget attendance={analyticsData?.attendance} />
              </div>

              {/* Column 2: การดูแลนักศึกษาเชิงรุก & ทะเบียนครุภัณฑ์ (Student Care & Asset Management) */}
              <div className="flex flex-col gap-4">
                <StudentCareWidget studentCare={analyticsData?.studentCare} />
                <AssetWidget asset={analyticsData?.asset} />
              </div>

              {/* Column 3: ด้านพัสดุ งานสนับสนุน และโครงข่าย (Operations & Infrastructure) */}
              <div className="flex flex-col gap-4">
                <WatsaduWidget watsadu={analyticsData?.watsadu} />
                <HelpdeskAndNetworkWidget
                  helpdesk={analyticsData?.helpdesk}
                  network={analyticsData?.network}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CENTRAL NOC & SYSTEM STATUS */}
        {activeTab === "noc" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Section Sub-header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-950/40">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      ศูนย์มอนิเตอร์สถานะระบบ & โครงข่าย (SMKCC Central NOC)
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      24/7 Monitoring
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ตรวจสอบความพร้อมใช้งาน (Uptime), Latency และโครงสร้างพื้นฐาน 8 ระบบ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto font-mono text-[11px] text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-cyan-300">
                  UniNet Fiber 10G
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-emerald-300">
                  LINE Alert Engine
                </span>
              </div>
            </div>

            {/* Master Telemetry Bar for Enterprise NOC */}
            <NocMasterTelemetry overview={overview} />

            {/* Filters Bar: Category & Strategic Tags */}
            <div className="flex flex-col gap-2.5 border-b border-border/60 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 mr-1 flex items-center gap-1 font-medium">
                    <Filter className="w-3.5 h-3.5" /> แท็กภารกิจ:
                  </span>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        selectedTag === tag
                          ? "bg-cyan-600 text-white font-bold shadow-md shadow-cyan-950/40"
                          : "bg-[#131b2e] text-slate-300 hover:bg-secondary hover:text-white border border-border/50"
                      }`}
                    >
                      {tag === "all" ? "ทุกภารกิจ" : tag}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  แสดง {filteredServices.length} จาก {services.length} ระบบ
                </div>
              </div>

              {/* Secondary category filter */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 mr-1">หมวดหมู่ระบบ:</span>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] transition-all ${
                      selectedCategory === cat
                        ? "bg-slate-700 text-white font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat === "all" ? "ทั้งหมด" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Services Status Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  snapshot={snapshots[service.id]}
                  onRefresh={handleRefreshSingle}
                  isRefreshing={refreshingServiceId === service.id}
                />
              ))}
            </div>

            {/* Live Telemetry & Audit Stream Terminal */}
            <NocLiveTerminal />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 bg-[#0a0f1d]/80 mt-10">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
            <span className="font-medium text-slate-300">
              SMKCC Nexus • วิทยาลัยชุมชนสมุทรสาคร
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Modular Section Grid • Balanced Proportions • 8 Live Systems • Next.js 15
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        services={services}
        onSaveService={handleSaveService}
        onDeleteService={handleDeleteService}
        onTriggerAutoDiscovery={handleTriggerAutoDiscovery}
        isSimulatingAlert={isEmergencyActive}
        onToggleSimulateAlert={toggleSimulateAlert}
      />

      {/* Red Alert Perimeter Vignette Frame */}
      {isEmergencyActive && (
        <div className="fixed inset-0 pointer-events-none z-[9999] emergency-vignette flex flex-col justify-between p-3 sm:p-5">
          {/* Top Floating Alert Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl mx-auto pointer-events-auto gap-3">
            <div className="flex items-center gap-2.5 bg-red-950/95 border border-red-500 px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.7)] backdrop-blur-md">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0" />
              <div className="flex flex-col">
                <span className="font-mono text-xs sm:text-sm font-black text-red-100 tracking-wider">
                  🚨 CRITICAL DEFCON-1 ALERT // ตรวจพบระบบขัดข้องฉุกเฉิน
                </span>
                <span className="text-[10px] text-red-300 font-mono">
                  (เสียงไซเรนและกรอบแดงจะทำงานต่อเนื่อง จนกว่าจะมีผู้กดยืนยันรับทราบ)
                </span>
              </div>
            </div>

            <button
              onClick={handleSilenceAlert}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 border border-white/40 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.85)] hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span>🔕 กดรับทราบและปิดเสียงเตือน (ACKNOWLEDGE & SILENCE)</span>
            </button>
          </div>

          {/* 4 Corner Tech Brackets (Cyber HUD) */}
          <div className="absolute top-2 left-2 w-10 h-10 border-t-[3px] border-l-[3px] border-red-500 pointer-events-none" />
          <div className="absolute top-2 right-2 w-10 h-10 border-t-[3px] border-r-[3px] border-red-500 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-10 h-10 border-b-[3px] border-l-[3px] border-red-500 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-10 h-10 border-b-[3px] border-r-[3px] border-red-500 pointer-events-none" />
        </div>
      )}
    </div>
  );
}
