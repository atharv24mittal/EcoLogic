"use client";
import "./globals.css";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  const [isDark, setIsDark] = useState(true);
  return (
    <html lang="en" className={isDark ? "dark" : ""}>
      <head>
        <title>EcoIntelligence Platform | Ecologic</title>
        <meta name="description" content="AI-powered ecological strategy platform — built at Ecologic.live" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ background: isDark ? "var(--bg)" : "#f0fdf4", color: isDark ? "white" : "#052e16" }}>
        <Toaster position="top-right" toastOptions={{ style: { background: "#0B1C12", color: "#D8EEDE", border: "1px solid rgba(0,232,122,0.2)" } }} />
        <div className="flex flex-col h-screen overflow-hidden">
          <Topbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar onToggleTheme={() => setIsDark(p => !p)} isDark={isDark} />
            <main className="flex-1 overflow-y-auto p-7">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
