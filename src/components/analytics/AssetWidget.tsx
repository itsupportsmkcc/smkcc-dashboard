"use client";

import React from "react";
import { AssetMetrics } from "@/lib/analytics";
import {
  Monitor,
  Laptop,
  Printer,
  ExternalLink,
  FolderLock,
  Building2,
} from "lucide-react";

interface AssetWidgetProps {
  asset?: AssetMetrics;
}

export function AssetWidget({ asset }: AssetWidgetProps) {
  const categories = asset?.byCategory || [];
  const totalValueFormatted = asset?.totalValueBaht
    ? new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(
        asset.totalValueBaht
      )
    : "฿1,293,991";
  const targetUrl = "https://smkcc-asset-x.vercel.app/admin";

  const availableBorrowCount = asset?.availableBorrowCount ?? 5;
  const currentlyBorrowedCount = asset?.currentlyBorrowedCount ?? 1;
  const activeInUseCount = asset?.activeInUseCount ?? 100;
  const brokenCount = asset?.brokenCount ?? 2;
  const availableList = asset?.availableComputers && asset.availableComputers.length > 0
    ? asset.availableComputers
    : [
        { id: 128, asset_code: "7440-001-0003-1-64", brand: "Acer", model: "TravelMate P214", location: "ตู้เก็บของพัสดุ", status: "ว่าง" },
        { id: 130, asset_code: "7440-001-0003-3-64", brand: "Acer", model: "TravelMate P214", location: "ตู้เก็บของพัสดุ", status: "ว่าง" },
        { id: 136, asset_code: "7440-001-0003-9-64", brand: "Acer", model: "TravelMate P214", location: "ตู้เก็บของพัสดุ", status: "ว่าง" },
        { id: 139, asset_code: "7440-001-0003-12-64", brand: "Acer", model: "TravelMate P214", location: "ตู้เก็บของพัสดุ", status: "ว่าง" },
        { id: 140, asset_code: "7440-001-0003-13-64", brand: "Acer", model: "TravelMate P214", location: "ตู้เก็บของพัสดุ", status: "ว่าง" },
      ];

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-[#101826]/95 backdrop-blur-md p-5 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Clean Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/60 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-300">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-slate-100 tracking-tight">smkccAssetX ทะเบียนครุภัณฑ์</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/25">
                  สนับสนุนการปฏิบัติงาน
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
                  ความพร้อมด้านอุปกรณ์สำหรับการเรียน
                </span>
              </div>
              <p className="text-xs text-slate-400">
                บริหารจัดการครุภัณฑ์ {asset?.totalEquipments ?? 108} รายการ 17 ห้อง
              </p>
            </div>
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดเข้าสู่ระบบ smkccAssetX ทะเบียนครุภัณฑ์"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors shrink-0"
          >
            <span>เข้าสู่ระบบ</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* HIGHLIGHT: เครื่องที่พร้อมให้นักศึกษายืม (Ready to Borrow) */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                เครื่องที่พร้อมให้นักศึกษายืม
              </span>
            </div>
            <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              สถานะ: ว่าง พร้อมยืม
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-3xl font-black text-slate-100 font-mono tracking-tight flex items-baseline gap-2">
                <span>{availableBorrowCount}</span>
                <span className="text-sm font-normal text-emerald-300">เครื่อง (Notebook)</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <FolderLock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>รุ่น Acer TravelMate P214 • ประจำตู้เก็บของพัสดุ</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">ถูกยืมขณะนี้</span>
              <span className="text-sm font-bold font-mono text-amber-300">{currentlyBorrowedCount} เครื่อง</span>
            </div>
          </div>

          {/* Available machines list (Asset Codes) */}
          <div className="pt-2.5 border-t border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center justify-between">
              <span>รหัสครุภัณฑ์ 5 เครื่องที่พร้อมให้นักศึกษายืมทันที:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableList.slice(0, 5).map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/30 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-slate-200 tracking-tight" title={m.asset_code}>
                    {m.asset_code}
                  </span>
                  <span className="text-[10px] text-emerald-300 ml-1.5 shrink-0 font-medium">
                    ว่าง
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Status Numbers */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-lg font-bold text-emerald-300 font-mono">{availableBorrowCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">พร้อมยืม (ว่าง)</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-lg font-bold text-amber-300 font-mono">{currentlyBorrowedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ถูกยืม</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-lg font-bold text-slate-200 font-mono">{activeInUseCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ใช้งานประจำ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <div className="text-lg font-bold text-rose-300 font-mono">{brokenCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ชำรุด/ส่งซ่อม</div>
          </div>
        </div>

        {/* Categories Hardware Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span>หมวดหมู่อุปกรณ์หลักในระบบ</span>
            <span className="font-mono text-slate-300">{asset?.totalComputers ?? 96} คอมพิวเตอร์</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {categories.slice(0, 6).map((c, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-slate-800/30 border border-slate-800/40 flex items-center justify-between text-xs"
              >
                <div className="text-slate-300 truncate flex items-center gap-1.5 pr-1">
                  {c.category.toLowerCase().includes("notebook") ? (
                    <Laptop className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  ) : c.category.toLowerCase().includes("printer") ? (
                    <Printer className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  ) : (
                    <Monitor className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                  )}
                  <span className="truncate">{c.category}</span>
                </div>
                <span className="font-bold text-slate-100 font-mono shrink-0">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>ครอบคลุม 17 ห้องเรียนและสำนักงาน</span>
        </span>
        <span className="font-mono text-slate-300 font-medium">
          มูลค่ารวม {totalValueFormatted}
        </span>
      </div>
    </div>
  );
}
