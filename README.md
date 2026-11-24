# SMKCC Central NOC & Service Status Dashboard

ระบบแดชบอร์ดศูนย์สั่งการและมอนิเตอร์สถานะความพร้อมใช้งาน (Uptime, Latency, Response Time, Health Status) ของทุกระบบสารสนเทศ ฐานข้อมูล และโครงข่ายที่พัฒนาขึ้น

---

## 🚀 ฟีเจอร์เด่น (Key Features)

1. **Service Status & Monitoring (Status Page / NOC)**
   - ตรวจจับสถานะความพร้อมใช้งานของระบบ (Operational, Degraded, Outage/Down)
   - วัดค่าความหน่วงจริง (Latency ในหน่วยมิลลิวินาที ms)
   - แถบประวัติความพร้อมใช้งาน **30-Day Uptime History Bar** พร้อมแสดงค่าร้อยละ (%)
   - รองรับการเข้าถึงหน้าเว็บแอปของแต่ละระบบด้วยไอคอนทางลัดทันที

2. **Full-Stack Health Check (Database & HTTP API)**
   - ทดสอบการเชื่อมต่อและ Query สดไปยังฐานข้อมูล PostgreSQL (Neon DB, Supabase)
   - ทดสอบ HTTP / HTTPS Health Ping พร้อมระบบจับเวลา Timeout
   - สรุปผลสถานะฐานข้อมูลและเว็บเซิร์ฟเวอร์แบบ Real-time

3. **Audio Beep & On-Screen Incident Alert**
   - แถบแจ้งเตือน Incident Banner สีแดงด้านบนทันทีเมื่อระบบใดระบบหนึ่งล่มหรือหยุดทำงาน
   - ระบบเสียงเตือนภัย (Audio Alert Synthesizer) โดยใช้ Web Audio API โดยตรง (ไม่ต้องโหลดไฟล์เสียงภายนอก)

4. **NOC TV & Kiosk Mode**
   - รองรับปุ่ม Fullscreen / Kiosk Mode สำหรับเปิดฉายเต็มจอบน TV 65" หรือจอมอนิเตอร์ประจำห้อง NOC

5. **Auto-Discovery & Web UI Management**
   - ตรวจจับและดึงค่าคอนฟิก (.env, DATABASE_URL, URLs) จากโปรเจกต์เดิมบนไดรฟ์ `D:\` ให้อัตโนมัติ
   - มีหน้า Settings ปรับแต่ง แก้ไข ลิงก์, Connection String, Timeout และเปิด-ปิดระบบได้โดยตรงจากหน้าเว็บ

---

## 📋 รายการระบบที่มอนิเตอร์ในแดชบอร์ด

1. **SMKCC IT Helpdesk** (`D:\SMKCC IT Helpdesk`) — Next.js + Supabase
2. **smkccAssetX** (`D:\smkccAssetX`) — Next.js + PostgreSQL (Supabase)
3. **New SMKCC Web & CMS** (`D:\NewSmkccWeb`) — Directus CMS & PostgreSQL
4. **SMKCC Network NOC** (`D:\smkcc netmonitor`) — Grafana NOC / Cloudflare
5. **ระบบรับสมัครเรียน (Admission)** (`D:\ระบบรับสมัครเรียนv.2\smcc-admission`) — Next.js + Prisma (Neon PostgreSQL)
6. **ระบบเช็คชื่อเข้าเรียน (Attendance)** (`D:\ระบบเช็คชื่อเข้าเรียน\attendance-system`) — Next.js + Prisma (Neon PostgreSQL)

---

## 🛠️ วิธีการรันระบบ (How to Run)

### 1. โหมดทดสอบการพัฒนา (Development Mode)
```bash
cd d:\DashboardSystem
npm run dev
```
เปิดบราวเซอร์ที่: `http://localhost:3005`

### 2. โหมดใช้งานจริง (Production Build & Start)
```bash
cd d:\DashboardSystem
npm run build
npm run start
```
เปิดบราวเซอร์ที่: `http://localhost:3005`
