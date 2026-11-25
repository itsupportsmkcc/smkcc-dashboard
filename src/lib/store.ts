import fs from "fs";
import path from "path";
import { ServiceDefinition, ServiceHealthSnapshot, IncidentRecord, ServiceStatus } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");
const HISTORY_FILE = path.join(DATA_DIR, "history.json");
const INCIDENTS_FILE = path.join(DATA_DIR, "incidents.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// In-memory cache for live snapshots
let liveSnapshots: Record<string, ServiceHealthSnapshot> = {};

export interface HistoryEntry {
  timestamp: string; // ISO
  serviceId: string;
  status: ServiceStatus;
  latencyMs: number;
  httpStatus?: number;
  dbStatus?: "connected" | "error" | "skipped";
  message?: string;
}

const SERVICE_ENV_MAPPING: Record<string, string> = {
  "smkcc-assetx": "DB_SMKCC_ASSETX",
  "smkcc-kumwatsadu": "DB_SMKCC_KUMWATSADU",
  "smcc-admission": "DB_SMCC_ADMISSION",
  "attendance-system": "DB_ATTENDANCE_SYSTEM",
  "smkcc-student-care": "DB_SMKCC_STUDENT_CARE",
};

export function getServices(): ServiceDefinition[] {
  ensureDataDir();
  if (!fs.existsSync(SERVICES_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(SERVICES_FILE, "utf-8").replace(/^\uFEFF/, "");
    const list: ServiceDefinition[] = JSON.parse(raw);
    return list.map(svc => {
      const envKey = SERVICE_ENV_MAPPING[svc.id];
      const envConn = envKey ? process.env[envKey] : undefined;
      return {
        ...svc,
        dbConnectionString: envConn || svc.dbConnectionString,
      };
    });
  } catch (err) {
    console.error("Error reading services.json:", err);
    return [];
  }
}

export function saveServices(services: ServiceDefinition[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write services.json (read-only environment like Vercel):", err);
  }
}

export function getIncidents(): IncidentRecord[] {
  ensureDataDir();
  if (!fs.existsSync(INCIDENTS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(INCIDENTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading incidents.json:", err);
    return [];
  }
}

export function saveIncidents(incidents: IncidentRecord[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(INCIDENTS_FILE, JSON.stringify(incidents, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write incidents.json (read-only environment like Vercel):", err);
  }
}

export function getHistory(): HistoryEntry[] {
  ensureDataDir();
  if (!fs.existsSync(HISTORY_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading history.json:", err);
    return [];
  }
}

export function appendHistory(entries: HistoryEntry[]): void {
  try {
    ensureDataDir();
    const current = getHistory();
    // Keep up to 30 days of data (approx 10,000 max entries)
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const pruned = current.filter(e => new Date(e.timestamp).getTime() > cutoff);
    const updated = [...pruned, ...entries];
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(updated), "utf-8");
  } catch (err) {
    console.warn("Could not write history.json (read-only environment like Vercel):", err);
  }
}

export function setLiveSnapshot(serviceId: string, snapshot: ServiceHealthSnapshot): void {
  liveSnapshots[serviceId] = snapshot;
}

export function getLiveSnapshot(serviceId: string): ServiceHealthSnapshot | undefined {
  return liveSnapshots[serviceId];
}

export function getAllLiveSnapshots(): Record<string, ServiceHealthSnapshot> {
  return liveSnapshots;
}
