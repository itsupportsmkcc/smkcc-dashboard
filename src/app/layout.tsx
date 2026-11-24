import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMKCC Unified Dashboard • วิทยาลัยชุมชนสมุทรสาคร",
  description: "ศูนย์มอนิเตอร์ความพร้อมใช้งานระบบสารสนเทศ ฐานข้อมูล และโครงข่าย วิทยาลัยชุมชนสมุทรสาคร",
  icons: {
    icon: "/logo-smkcc.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700;800&family=Prompt:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200 font-sans">
        {children}
      </body>
    </html>
  );
}
