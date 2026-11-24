"use client";

import React, { useState } from "react";
import { ServiceDefinition } from "@/lib/types";
import {
  X,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Database,
  Globe,
  Radio,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceDefinition[];
  onSaveService: (service: ServiceDefinition) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  onTriggerAutoDiscovery: () => Promise<void>;
}

export function SettingsModal({
  isOpen,
  onClose,
  services,
  onSaveService,
  onDeleteService,
  onTriggerAutoDiscovery,
}: SettingsModalProps) {
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(
    services[0] || null
  );
  const [isEditingNew, setIsEditingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ServiceDefinition["category"]>("IT Support");
  const [description, setDescription] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [dbConnectionString, setDbConnectionString] = useState("");
  const [checkType, setCheckType] = useState<ServiceDefinition["checkType"]>("http");
  const [checkIntervalSec, setCheckIntervalSec] = useState(30);
  const [timeoutMs, setTimeoutMs] = useState(5000);
  const [enabled, setEnabled] = useState(true);

  if (!isOpen) return null;

  const handleSelect = (s: ServiceDefinition) => {
    setSelectedService(s);
    setIsEditingNew(false);
    setName(s.name);
    setCategory(s.category);
    setDescription(s.description);
    setAppUrl(s.appUrl);
    setEndpointUrl(s.endpointUrl || s.appUrl);
    setDbConnectionString(s.dbConnectionString || "");
    setCheckType(s.checkType);
    setCheckIntervalSec(s.checkIntervalSec || 30);
    setTimeoutMs(s.timeoutMs || 5000);
    setEnabled(s.enabled);
    setMessage(null);
  };

  const handleCreateNew = () => {
    setIsEditingNew(true);
    setSelectedService(null);
    setName("");
    setCategory("General");
    setDescription("");
    setAppUrl("http://localhost:3000");
    setEndpointUrl("http://localhost:3000/api/health");
    setDbConnectionString("");
    setCheckType("http");
    setCheckIntervalSec(30);
    setTimeoutMs(5000);
    setEnabled(true);
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const payload: ServiceDefinition = {
        id: isEditingNew ? `srv-${Date.now()}` : selectedService?.id || `srv-${Date.now()}`,
        name,
        category,
        description,
        appUrl,
        endpointUrl,
        dbConnectionString: dbConnectionString ? dbConnectionString : undefined,
        checkType,
        enabled,
        checkIntervalSec,
        timeoutMs,
      };

      await onSaveService(payload);
      setMessage("บันทึกข้อมูลเรียบร้อยแล้ว");
      setIsEditingNew(false);
      setSelectedService(payload);
    } catch (err: any) {
      setMessage(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">จัดการระบบและจุดตรวจสถานะ (Service Settings)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-secondary transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Split Column) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Service List */}
          <div className="w-full md:w-72 border-r border-border p-4 overflow-y-auto space-y-2 bg-secondary/10 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground">รายการระบบ ({services.length})</span>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มระบบ</span>
              </button>
            </div>

            {services.map(s => (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                  selectedService?.id === s.id && !isEditingNew
                    ? "bg-secondary border-emerald-500/50 text-white"
                    : "border-border/60 hover:bg-secondary/40 text-muted-foreground"
                }`}
              >
                <div className="truncate">
                  <div className="font-semibold text-white truncate">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground">{s.category}</div>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${s.enabled ? "bg-emerald-500" : "bg-neutral-600"}`}
                />
              </button>
            ))}

            <div className="pt-4 border-t border-border/50">
              <button
                onClick={onTriggerAutoDiscovery}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-secondary/60 hover:bg-secondary border border-border text-xs text-muted-foreground hover:text-white transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>สแกนค้นหาระบบบนไดรฟ์ D:\ ใหม่</span>
              </button>
            </div>
          </div>

          {/* Right: Form Editor */}
          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  {isEditingNew ? "เพิ่มระบบใหม่" : `แก้ไขระบบ: ${selectedService?.name || ""}`}
                </h3>
                {message && (
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">
                    {message}
                  </span>
                )}
              </div>

              {/* Service Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    ชื่อระบบ (Service Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="เช่น SMKCC IT Helpdesk"
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    หมวดหมู่ (Category)
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="IT Support">IT Support</option>
                    <option value="Asset Management">Asset Management</option>
                    <option value="Institutional Web">Institutional Web</option>
                    <option value="Network NOC">Network NOC</option>
                    <option value="Academic">Academic</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  คำอธิบายระบบ (Description)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="เช่น ระบบแจ้งซ่อมและบริการงานเทคโนโลยีสารสนเทศ"
                  className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* App URL & Check Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    ลิงก์เปิดใช้งานเว็บแอป (App URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={appUrl}
                    onChange={e => setAppUrl(e.target.value)}
                    placeholder="https://... หรือ http://localhost:3000"
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    ประเภทการตรวจเช็ค (Check Type)
                  </label>
                  <select
                    value={checkType}
                    onChange={e => setCheckType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="http">HTTP Ping (ตรวจผ่านเว็บ/API)</option>
                    <option value="postgres">PostgreSQL / Neon DB Connection</option>
                    <option value="supabase">Supabase Database Connection</option>
                    <option value="mixed">Mixed (ตรวจทั้ง HTTP และ Database)</option>
                  </select>
                </div>
              </div>

              {/* Endpoint URL (for HTTP) */}
              {(checkType === "http" || checkType === "mixed") && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    HTTP Health Check Endpoint URL
                  </label>
                  <input
                    type="url"
                    value={endpointUrl}
                    onChange={e => setEndpointUrl(e.target.value)}
                    placeholder="https://.../api/health"
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Database Connection String (for DB checks) */}
              {(checkType === "postgres" || checkType === "supabase" || checkType === "mixed") && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    PostgreSQL / Supabase Database Connection String
                  </label>
                  <input
                    type="text"
                    value={dbConnectionString}
                    onChange={e => setDbConnectionString(e.target.value)}
                    placeholder="postgresql://user:password@host:5432/dbname?sslmode=require"
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Check Interval & Timeout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    ความถี่การตรวจ (Check Interval - วินาที)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={300}
                    value={checkIntervalSec}
                    onChange={e => setCheckIntervalSec(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    ระยะเวลารอคำตอบสูงสุด (Timeout - มิลลิวินาที)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    max={30000}
                    step={500}
                    value={timeoutMs}
                    onChange={e => setTimeoutMs(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="enableCheck"
                  checked={enabled}
                  onChange={e => setEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 bg-secondary border-border focus:ring-emerald-500"
                />
                <label htmlFor="enableCheck" className="text-xs text-white select-none cursor-pointer">
                  เปิดใช้งานการมอนิเตอร์ระบบนี้
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                {!isEditingNew && selectedService && (
                  <button
                    type="button"
                    onClick={() => onDeleteService(selectedService.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-xs font-medium text-red-300 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบระบบนี้</span>
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-medium text-white transition-all"
                  >
                    ปิด
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition-all disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
