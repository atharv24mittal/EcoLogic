"use client";
export default function Topbar() {
  return (
    <header className="h-[54px] min-h-[54px] flex items-center justify-between px-6 flex-shrink-0"
      style={{ background: "var(--sidebar)", borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 flex items-center justify-center font-display font-bold text-xs text-[#040C08]"
          style={{ background: "var(--g)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}>
          E
        </div>
        <span className="font-display font-bold text-[15px]">EcoIntelligence</span>
        <span style={{ color: "var(--dim)" }}>/</span>
        <span className="text-[13px]" style={{ color: "var(--muted)" }}>Platform v1.0</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px]" style={{ color: "var(--muted)" }}>
          Built at <strong style={{ color: "var(--g)", fontWeight: 500 }}>Ecologic.live</strong> &nbsp;·&nbsp;
          Role: <strong style={{ color: "var(--g)", fontWeight: 500 }}>AI Researcher</strong> &nbsp;·&nbsp;
          <strong style={{ color: "var(--g)", fontWeight: 500 }}>2-month internship</strong>
        </span>
        <span className="font-mono text-[10px] px-2.5 py-1 rounded"
          style={{ color: "var(--g)", background: "rgba(0,232,122,0.08)", border: "1px solid var(--border)", letterSpacing: ".8px" }}>
          AI_RESEARCHER
        </span>
      </div>
    </header>
  );
}
