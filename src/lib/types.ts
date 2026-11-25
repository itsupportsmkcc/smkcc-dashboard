export type ServiceCheckType = "http" | "postgres" | "supabase" | "mixed";
export type ServiceStatus = "operational" | "degraded" | "down" | "checking" | "paused";

export interface ServiceDefinition {
  id: string;
  name: string;
  category: "IT Support" | "Asset Management" | "Institutional Web" | "Network NOC" | "Academic" | "General";
  description: string;
  appUrl: string;
  enabled: boolean;
  checkType: ServiceCheckType;
  endpointUrl?: string;
  dbConnectionString?: string;
  checkIntervalSec: number;
  timeoutMs: number;
  sourceDirectory?: string;
  tags?: string[];
  infra?: string;
  region?: string;
}

export interface ServiceHealthSnapshot {
  serviceId: string;
  status: ServiceStatus;
  latencyMs: number;
  lastChecked: string;
  httpStatus?: number;
  dbStatus?: "connected" | "error" | "skipped";
  message?: string;
  uptimePercent24h: number;
  uptimePercent30d: number;
  // 30 days history bar: array of 30 items (oldest to newest)
  history30d: Array<{
    date: string;
    uptime: number; // 0 - 100
    status: "operational" | "degraded" | "down" | "no_data";
    totalChecks: number;
  }>;
}

export interface IncidentRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  title: string;
  details: string;
  severity: "critical" | "warning" | "info";
  startedAt: string;
  resolvedAt?: string;
  isResolved: boolean;
}

export interface SystemOverview {
  overallStatus: "all_operational" | "degraded" | "critical_outage";
  totalServices: number;
  operationalCount: number;
  degradedCount: number;
  downCount: number;
  avgResponseTimeMs: number;
  lastUpdated: string;
  activeIncidents: IncidentRecord[];
}
