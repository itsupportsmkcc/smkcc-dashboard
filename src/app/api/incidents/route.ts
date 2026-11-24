import { NextResponse } from "next/server";
import { getIncidents, saveIncidents } from "@/lib/store";

export async function GET() {
  const incidents = getIncidents();
  return NextResponse.json({ incidents });
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Incident ID is required" }, { status: 400 });
    }

    const incidents = getIncidents();
    const target = incidents.find(i => i.id === id);
    if (!target) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    target.isResolved = true;
    target.resolvedAt = new Date().toISOString();
    saveIncidents(incidents);

    return NextResponse.json({ incident: target });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
