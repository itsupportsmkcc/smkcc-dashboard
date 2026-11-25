import { NextResponse } from "next/server";
import { sendLinePushMessage } from "@/lib/lineAlert";

export const dynamic = "force-dynamic";

export async function POST() {
  const timeStr = new Date().toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const message = [
    `🔔 [ทดสอบการแจ้งเตือน LINE] - SMKCC Dashboard`,
    `--------------------------------`,
    `• สถานะการเชื่อมต่อ: พร้อมใช้งานสมบูรณ์ (Active)`,
    `• ระบบมอนิเตอร์: 8 ระบบ (Central NOC)`,
    `• เวลาทดสอบ: ${timeStr}`,
    `--------------------------------`,
    `🔗 เข้าสู่แดชบอร์ด: https://smkcc-dashboard.vercel.app`,
  ].join("\n");

  const res = await sendLinePushMessage(message);

  if (res.success) {
    return NextResponse.json({ ok: true, message: "ส่งข้อความทดสอบเข้า LINE สำเร็จแล้ว" });
  } else {
    return NextResponse.json(
      { ok: false, error: res.error || "ไม่สามารถส่งข้อความได้ กรุณาตรวจสอบการเชื่อมต่อ" },
      { status: 500 }
    );
  }
}
