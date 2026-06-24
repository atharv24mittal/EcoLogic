"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/", icon: "🏠", label: "Dashboard" },
  { divider: true, label: "AI Tools" },
  { href: "/strategy", icon: "⚡", label: "Strategy Generator" },
  { href: "/impact", icon: "📊", label: "Impact Estimator" },
  { href: "/policy", icon: "📝", label: "Policy Drafter" },
  { href: "/research", icon: "🔬", label: "Research Assistant" },
  { divider: true, label: "More Tools" },
  { href: "/monitor", icon: "📡", label: "Live Monitor" },
  { href: "/ecobot", icon: "🤖", label: "EcoBot AI" },
  { href: "/compare", icon: "⚖️", label: "Compare Strategies" },
  { divider: true, label: "Platform" },
  { href: "/history", icon: "📂", label: "My History" },
];

export default function Sidebar({ onToggleTheme, isDark }) {
  const path = usePathname();
  const [apiOk, setApiOk] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/health`)
      .then((r) => r.ok ? setApiOk(true) : setApiOk(false))
      .catch(() => setApiOk(false));
  }, []);

  return (
    <aside className="w-[218px] min-w-[218px] flex flex-col overflow-y-auto flex-shrink-0"
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--border)" }}>
      <div className="flex-1 py-2">
        {NAV.map((item, i) => {
          if (item.divider) return (
            <div key={i}>
              <div className="h-px mx-3 my-1.5" style={{ background: "var(--border)" }} />
              <div className="px-3.5 pt-2 pb-1 font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--dim)" }}>{item.label}</div>
            </div>
          );
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-2.5 mx-1.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 mb-0.5"
                style={{
                  background: active ? "rgba(0,232,122,0.10)" : "transparent",
                  border: active ? "1px solid var(--border2)" : "1px solid transparent",
                  color: active ? "var(--g)" : "var(--muted)",
                }}>
                <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                <span className="font-display text-[13px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="p-3.5 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="rounded-xl p-3" style={{ background: "rgba(0,232,122,0.07)", border: "1px solid var(--border)" }}>
          <div className="font-display font-bold text-[13px] mb-2" style={{ color: "var(--g)" }}>⬡ Ecologic.live</div>
          <div className="font-mono text-[10px] leading-7" style={{ color: "var(--dim)" }}>
            ROLE: AI Researcher<br/>
            DURATION: 2 months<br/>
            BUILD: v1.0.0 · 2025
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${apiOk === null ? "bg-yellow-500" : apiOk ? "bg-green-400" : "bg-red-400"}`} />
            <span className="font-mono text-[10px]" style={{ color: "var(--dim)" }}>
              {apiOk === null ? "Checking API..." : apiOk ? "API Connected" : "API Offline"}
            </span>
          </div>
        </div>
        <button onClick={onToggleTheme} className="btn-ghost w-full mt-2 text-xs">
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </aside>
  );
}
