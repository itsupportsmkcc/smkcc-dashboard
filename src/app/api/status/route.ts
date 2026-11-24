import { NextResponse } from "next/server";
import { getServices, getAllLiveSnapshots, getIncidents } from "@/lib/store";
import { autoDiscoverServices } from "@/lib/discovery";
import { checkAllServices, checkSingleService } from "@/lib/checker";
import { SystemOverview } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  let services = getServices();
  if (services.length === 0) {
    // Auto-discover initial set of services
    services = autoDiscoverServices();
  }

  let snapshots = getAllLiveSnapshots();
  // If snapshots are empty, run an initial check
  if (Object.keys(snapshots).length === 0 && services.length > 0) {
    snapshots = await checkAllServices();
  }

  const incidents = getIncidents();
  const activeIncidents = incidents.filter(i => !i.isResolved);

  // Compute overview
  let operationalCount = 0;
  let degradedCount = 0;
  let downCount = 0;
  let totalLatency = 0;
  let latencySampleCount = 0;

  for (const s of services) {
    const snap = snapshots[s.id];
    if (snap) {
      if (snap.status === "operational") operationalCount++;
      else if (snap.status === "degraded") degradedCount++;
      else if (snap.status === "down") downCount++;

      if (snap.latencyMs > 0) {
        totalLatency += snap.latencyMs;
        latencySampleCount++;
      }
    }
  }

  const avgLatency = latencySampleCount > 0 ? Math.round(totalLatency / latencySampleCount) : 0;

  let overallStatus: SystemOverview["overallStatus"] = "all_operational";
  if (downCount > 0) {
    overallStatus = "critical_outage";
  } else if (degradedCount > 0) {
    overallStatus = "degraded";
  }

  const overview: SystemOverview = {
    overallStatus,
    totalServices: services.length,
    operationalCount,
    degradedCount,
    downCount,
    avgResponseTimeMs: avgLatency,
    lastUpdated: new Date().toISOString(),
    activeIncidents,
  };

  return NextResponse.json({
    services,
    snapshots,
    overview,
    incidents,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let services = getServices();
    if (services.length === 0) {
      services = autoDiscoverServices();
    }

    if (body.serviceId) {
      const target = services.find(s => s.id === body.serviceId);
      if (!target) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
      }
      const snap = await checkSingleService(target);
      return NextResponse.json({ snapshot: snap });
    }

    const snapshots = await checkAllServices();
    return NextResponse.json({ snapshots });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
