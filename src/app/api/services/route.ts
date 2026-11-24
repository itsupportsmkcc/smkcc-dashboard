import { NextResponse } from "next/server";
import { getServices, saveServices } from "@/lib/store";
import { ServiceDefinition } from "@/lib/types";
import { checkSingleService } from "@/lib/checker";

export async function GET() {
  const services = getServices();
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const services = getServices();

    if (!body.name || !body.appUrl) {
      return NextResponse.json({ error: "Name and App URL are required" }, { status: 400 });
    }

    const id = body.id || `srv-${Date.now()}`;
    const existingIndex = services.findIndex(s => s.id === id);

    const newService: ServiceDefinition = {
      id,
      name: body.name,
      category: body.category || "General",
      description: body.description || "",
      appUrl: body.appUrl,
      endpointUrl: body.endpointUrl || body.appUrl,
      dbConnectionString: body.dbConnectionString || undefined,
      checkType: body.checkType || "http",
      enabled: body.enabled !== false,
      checkIntervalSec: Number(body.checkIntervalSec) || 30,
      timeoutMs: Number(body.timeoutMs) || 5000,
    };

    if (existingIndex >= 0) {
      services[existingIndex] = { ...services[existingIndex], ...newService };
    } else {
      services.push(newService);
    }

    saveServices(services);

    // Run immediate check
    const snapshot = await checkSingleService(newService);

    return NextResponse.json({ service: newService, snapshot });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    let services = getServices();
    services = services.filter(s => s.id !== id);
    saveServices(services);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
