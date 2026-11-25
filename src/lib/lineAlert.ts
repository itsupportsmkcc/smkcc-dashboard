/**
 * LINE Messaging API Alert Service for SMKCC Unified Dashboard
 * Sends instant notifications when systems go down or recover.
 */

const DASHBOARD_URL = "https://smkcc-dashboard.vercel.app";

// Anti-spam cooldown cache: maps serviceId to timestamp of last sent alert
const lastAlertTimeMap = new Map<string, number>();
const COOLDOWN_MS = 3 * 60 * 1000; // 3 minutes cooldown between repeated alerts for the same service

function formatThaiDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export async function sendLinePushMessage(text: string): Promise<boolean> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const targetId = process.env.LINE_USER_OR_GROUP_ID;

  if (!token || !targetId) {
    console.warn("[LINE Alert] Missing LINE_CHANNEL_ACCESS_TOKEN or LINE_USER_OR_GROUP_ID in environment.");
    return false;
  }

  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: targetId,
        messages: [{ type: "text", text }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[LINE Alert] API returned ${res.status}: ${errText}`);
      return false;
    }

    console.log("[LINE Alert] Successfully delivered push message to LINE.");
    return true;
  } catch (err: any) {
    console.error("[LINE Alert] Failed to dispatch LINE notification:", err?.message || err);
    return false;
  }
}

/**
 * Send an Outage Alert when a service goes down
 */
export async function sendLineOutageAlert(
  serviceName: string,
  serviceId: string,
  details: string,
  startedAtIso: string
): Promise<void> {
  const now = Date.now();
  const lastTime = lastAlertTimeMap.get(`${serviceId}_down`) || 0;
  if (now - lastTime < COOLDOWN_MS) {
    console.log(`[LINE Alert] Skipping duplicate outage alert for ${serviceId} (cooldown active).`);
    return;
  }
  lastAlertTimeMap.set(`${serviceId}_down`, now);

  const timeStr = formatThaiDateTime(startedAtIso);
  const message = [
    `🚨 [แจ้งเตือนระบบขัดข้อง] - SMKCC Dashboard`,
    `--------------------------------`,
    `• ระบบที่พบปัญหา: ${serviceName}`,
    `• สถานะ: หยุดทำงาน (Offline / Outage)`,
    `• รายละเอียด: ${details}`,
    `• เวลาที่ตรวจพบ: ${timeStr}`,
    `--------------------------------`,
    `🔗 ตรวจสอบสถานะ: ${DASHBOARD_URL}`,
  ].join("\n");

  await sendLinePushMessage(message);
}

/**
 * Send a Recovery Alert when a service recovers back to operational
 */
export async function sendLineRecoveryAlert(
  serviceName: string,
  serviceId: string,
  startedAtIso?: string,
  resolvedAtIso: string = new Date().toISOString()
): Promise<void> {
  const resolvedTimeStr = formatThaiDateTime(resolvedAtIso);

  let durationText = "ไม่ระบุ";
  if (startedAtIso) {
    try {
      const diffSec = Math.max(1, Math.round((new Date(resolvedAtIso).getTime() - new Date(startedAtIso).getTime()) / 1000));
      if (diffSec < 60) {
        durationText = `${diffSec} วินาที`;
      } else {
        const mins = Math.floor(diffSec / 60);
        const secs = diffSec % 60;
        durationText = `${mins} นาที ${secs} วินาที`;
      }
    } catch {}
  }

  const message = [
    `✅ [ระบบกลับมาใช้งานได้ปกติ] - SMKCC Dashboard`,
    `--------------------------------`,
    `• ระบบ: ${serviceName}`,
    `• สถานะ: เปิดให้บริการปกติ (Operational)`,
    `• ระยะเวลาที่ขัดข้อง: ${durationText}`,
    `• เวลาที่กู้คืนสำเร็จ: ${resolvedTimeStr}`,
    `--------------------------------`,
    `🔗 ตรวจสอบสถานะ: ${DASHBOARD_URL}`,
  ].join("\n");

  await sendLinePushMessage(message);
}
