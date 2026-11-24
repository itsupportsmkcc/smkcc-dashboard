import fs from "fs";
import path from "path";
import { ServiceDefinition } from "./types";
import { getServices, saveServices } from "./store";

interface CandidateConfig {
  id: string;
  name: string;
  category: ServiceDefinition["category"];
  description: string;
  defaultAppUrl: string;
  defaultEndpointUrl: string;
  projectPaths: string[];
  checkType: ServiceDefinition["checkType"];
}

const CANDIDATES: CandidateConfig[] = [
  {
    id: "smkcc-it-helpdesk",
    name: "SMKCC IT Helpdesk",
    category: "IT Support",
    description: "ระบบแจ้งซ่อมและบริการงานเทคโนโลยีสารสนเทศ รองรับ LINE Notify",
    defaultAppUrl: "https://smkcc-it-helpdesk.vercel.app",
    defaultEndpointUrl: "https://smkcc-it-helpdesk.vercel.app",
    projectPaths: ["D:\\SMKCC IT Helpdesk", "D:\\it-helpdesk"],
    checkType: "mixed",
  },
  {
    id: "smkcc-assetx",
    name: "smkccAssetX",
    category: "Asset Management",
    description: "ระบบบริหารจัดการครุภัณฑ์และสินทรัพย์ดิจิทัล (PostgreSQL Supabase)",
    defaultAppUrl: "http://localhost:3000",
    defaultEndpointUrl: "http://localhost:3000/api/health",
    projectPaths: ["D:\\smkccAssetX"],
    checkType: "postgres",
  },
  {
    id: "smkcc-kumwatsadu",
    name: "ระบบบริหารจัดการและควบคุมวัสดุ (Material Control)",
    category: "Asset Management",
    description: "ระบบบริหารจัดการคลังวัสดุ รับเข้า เบิกจ่าย บัญชีคุมวัสดุ (Neon PostgreSQL)",
    defaultAppUrl: "http://localhost:3000",
    defaultEndpointUrl: "http://localhost:3000",
    projectPaths: ["D:\\ระบบคุมวัสดุ"],
    checkType: "postgres",
  },
  {
    id: "new-smkcc-web",
    name: "New SMKCC Web & CMS",
    category: "Institutional Web",
    description: "เว็บไซต์ทางการสถาบัน SMKCC ขับเคลื่อนด้วย Directus Headless CMS",
    defaultAppUrl: "http://localhost:3001",
    defaultEndpointUrl: "http://127.0.0.1:8055/server/ping",
    projectPaths: ["D:\\NewSmkccWeb"],
    checkType: "http",
  },
  {
    id: "smkcc-netmonitor",
    name: "SMKCC Network NOC",
    category: "Network NOC",
    description: "ศูนย์มอนิเตอร์โครงข่าย UniNet 10G, FortiGate 120G และ Ruijie Wi-Fi",
    defaultAppUrl: "https://triumph-grants-dir-tabs.trycloudflare.com/d/smkcc-master-overview",
    defaultEndpointUrl: "http://192.168.100.172:3000/api/health",
    projectPaths: ["D:\\smkcc netmonitor"],
    checkType: "http",
  },
  {
    id: "smcc-admission",
    name: "ระบบรับสมัครเรียน (Admission)",
    category: "Academic",
    description: "ระบบรับสมัครนักศึกษาใหม่ออนไลน์ บันทึกข้อมูลเข้า Neon PostgreSQL",
    defaultAppUrl: "http://localhost:3000",
    defaultEndpointUrl: "http://localhost:3000",
    projectPaths: ["D:\\ระบบรับสมัครเรียนv.2\\smcc-admission", "D:\\ระบบรับสมัคร"],
    checkType: "postgres",
  },
  {
    id: "attendance-system",
    name: "ระบบเช็คชื่อเข้าเรียน (Attendance)",
    category: "Academic",
    description: "ระบบเช็คชื่อเข้าเรียนและประมวลผลการเข้าชั้นเรียนของนักศึกษา",
    defaultAppUrl: "http://localhost:3000",
    defaultEndpointUrl: "http://localhost:3000",
    projectPaths: ["D:\\ระบบเช็คชื่อเข้าเรียน\\attendance-system"],
    checkType: "postgres",
  },
];

function extractEnvValue(content: string, key: string): string | undefined {
  const regex = new RegExp(`^${key}\\s*=\\s*["']?([^"'\r\n]+)["']?`, "m");
  const match = content.match(regex);
  return match ? match[1].trim() : undefined;
}

export function autoDiscoverServices(): ServiceDefinition[] {
  const existingServices = getServices();
  const existingMap = new Map(existingServices.map(s => [s.id, s]));
  const updatedList: ServiceDefinition[] = [...existingServices];

  for (const candidate of CANDIDATES) {
    let matchedPath = "";
    let envContent = "";
    let dbUrl: string | undefined = undefined;
    let appUrl = candidate.defaultAppUrl;
    let endpointUrl = candidate.defaultEndpointUrl;

    for (const p of candidate.projectPaths) {
      if (fs.existsSync(p)) {
        matchedPath = p;
        const envCandidates = [".env.local", ".env", ".env.production", ".env.example"];
        for (const e of envCandidates) {
          const envPath = path.join(p, e);
          if (fs.existsSync(envPath)) {
            const raw = fs.readFileSync(envPath, "utf-8");
            envContent += "\n" + raw;
          }
        }
        break;
      }
    }

    if (envContent) {
      const extractedDb = extractEnvValue(envContent, "DATABASE_URL") ||
        extractEnvValue(envContent, "DIRECTUS_DATABASE_URL") ||
        extractEnvValue(envContent, "SUPABASE_DB_URL");
      if (extractedDb) {
        dbUrl = extractedDb;
      }

      const extractedApp = extractEnvValue(envContent, "NEXT_PUBLIC_APP_URL") ||
        extractEnvValue(envContent, "PUBLIC_URL") ||
        extractEnvValue(envContent, "NEXTAUTH_URL");
      if (extractedApp) {
        appUrl = extractedApp;
        endpointUrl = extractedApp;
      }

      const supabaseUrl = extractEnvValue(envContent, "NEXT_PUBLIC_SUPABASE_URL");
      if (supabaseUrl && !endpointUrl.startsWith("http")) {
        endpointUrl = `${supabaseUrl}/rest/v1/`;
      }
    }

    if (candidate.id === "new-smkcc-web") {
      endpointUrl = "http://127.0.0.1:8055/server/ping";
      appUrl = "http://localhost:3001";
    }

    if (candidate.id === "smkcc-netmonitor") {
      endpointUrl = "http://192.168.100.172:3000/api/health";
    }

    if (existingMap.has(candidate.id)) {
      const current = existingMap.get(candidate.id)!;
      if (!current.dbConnectionString && dbUrl) {
        current.dbConnectionString = dbUrl;
      }
      if (matchedPath && !current.sourceDirectory) {
        current.sourceDirectory = matchedPath;
      }
    } else {
      const newService: ServiceDefinition = {
        id: candidate.id,
        name: candidate.name,
        category: candidate.category,
        description: candidate.description,
        appUrl,
        endpointUrl,
        dbConnectionString: dbUrl,
        checkType: candidate.checkType,
        enabled: true,
        checkIntervalSec: 30,
        timeoutMs: 5000,
        sourceDirectory: matchedPath || undefined,
      };
      updatedList.push(newService);
    }
  }

  saveServices(updatedList);
  return updatedList;
}
