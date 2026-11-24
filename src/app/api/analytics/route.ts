import { NextResponse } from "next/server";
import { getExecutiveData } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("refresh") === "true";
    const data = await getExecutiveData(force);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const data = await getExecutiveData(true);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
