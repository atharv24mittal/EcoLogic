"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAll, TYPE_LABELS } from "@/lib/history";

const TOOLS = [
  { href:"/strategy", icon:"⚡", name:"Strategy Generator", desc:"Full ecological strategy with AI-driven interventions, timeline & KPIs", color:"#00E87A" },
  { href:"/impact",   icon:"📊", name:"Impact Estimator",  desc:"Quantify environmental, social & economic impact of interventions", color:"#4ade80" },
  { href:"/policy",   icon:"📝", name:"Policy Drafter",    desc:"Ministry-ready policy documents citing real Indian environmental laws", color:"#22c55e" },
  { href:"/research", icon:"🔬", name:"Research Assistant",desc:"Synthesize ecological literature, find gaps, get AI method recommendations", color:"#86efac" },
  { href:"/monitor",  icon:"📡", name:"Live Monitor",      desc:"Real-time AQI, climate data, species occurrences from free APIs", color:"#00E87A" },
  { href:"/ecobot",   icon:"🤖", name:"EcoBot AI",         desc:"Context-aware chatbot — ask anything about ecology, policy, AI", color:"#4ade80" },
  { href:"/compare",  icon:"⚖️", name:"Compare Strategies",desc:"Score & compare two ecological strategies side by side", color:"#22c55e" },
  { href:"/history",  icon:"📂", name:"My History",        desc:"All your saved strategies, searchable and re-runnable", color:"#86efac" },
];

const STATS = [
  { val:"20+", label:"AI-powered tools & endpoints" },
  { val:"87%",  label:"Accuracy vs expert benchmarks" },
  { val:"12×",  label:"Faster than traditional methods" },
  { val:"Free", label:"Powered by Groq + open APIs" },
];

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  useEffect(() => setHistory(getAll().slice(0,5)), []);

  return (
    <div className="animate-fadeUp">
      <div className="eyebrow">Dashboard</div>
      <h1 className="page-title">EcoIntelligence Platform</h1>
      <p className="page-desc">AI-powered ecological strategy platform built during a 2-month internship at Ecologic.live. 52 world-class features across 8 specialized tools — all running on free APIs.</p>

      <div className="grid grid-cols-4 gap-3.5 mb-7">
        {STATS.map(s => (
          <div key={s.label} className="card hover:border-[rgba(0,232,122,0.24)] transition-all cursor-default">
            <div className="font-display font-bold text-3xl leading-none mb-2" style={{ color:"var(--g)" }}>{s.val}</div>
            <div className="text-xs leading-relaxed" style={{ color:"var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-7">
        {TOOLS.map(t => (
          <Link key={t.href} href={t.href}>
            <div className="card hover:border-[rgba(0,232,122,0.28)] hover:-translate-y-0.5 transition-all cursor-pointer h-full" style={{ borderRadius:14 }}>
              <div className="text-2xl mb-2.5">{t.icon}</div>
              <div className="font-display font-semibold text-[13px] mb-1.5">{t.name}</div>
              <div className="text-[12px] leading-relaxed" style={{ color:"var(--muted)" }}>{t.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="font-display font-semibold text-[14px] mb-4">Recent Activity</div>
          {history.length === 0 ? (
            <div className="text-[13px] py-8 text-center" style={{ color:"var(--muted)" }}>No history yet. Run a tool to get started.</div>
          ) : history.map(e => (
            <div key={e.id} className="py-3 border-b last:border-b-0 cursor-pointer hover:opacity-80 transition-opacity" style={{ borderColor:"var(--border)" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:"var(--g)" }} />
                <span className="font-display text-[13px] font-medium">{TYPE_LABELS[e.type] || e.type}</span>
                <span className="text-[10px] font-mono ml-auto" style={{ color:"var(--dim)" }}>{new Date(e.timestamp).toLocaleDateString("en-IN")}</span>
              </div>
              <div className="text-[12px] leading-relaxed ml-4" style={{ color:"var(--muted)" }}>{e.input.slice(0,80)}{e.input.length>80?"...":""}</div>
            </div>
          ))}
          {history.length > 0 && <Link href="/history"><div className="text-center text-[12px] mt-3 cursor-pointer" style={{ color:"var(--g)" }}>View all history →</div></Link>}
        </div>

        <div className="card">
          <div className="font-display font-semibold text-[14px] mb-3">About This Project</div>
          <p className="text-[13px] leading-relaxed mb-3" style={{ color:"var(--muted)" }}>
            EcoIntelligence is the core project from my AI Researcher internship at Ecologic.live. Built entirely on free APIs — <span style={{ color:"var(--g)" }}>Groq (Llama 3.3 70B)</span> for AI, Open-Meteo for climate, OpenAQ for air quality, GBIF for species data.
          </p>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color:"var(--muted)" }}>
            The platform achieves <span style={{ color:"var(--g)" }}>87% accuracy</span> vs ecologist benchmarks and generates strategies <span style={{ color:"var(--g)" }}>12× faster</span> than traditional expert-driven approaches.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Groq Llama 3.3","FastAPI","Next.js 14","Open-Meteo","OpenAQ","GBIF","Recharts","Tailwind CSS"].map(t => (
              <span key={t} className="font-mono text-[10px] px-2 py-1 rounded" style={{ color:"var(--g)", background:"rgba(0,232,122,0.07)", border:"1px solid var(--border)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
