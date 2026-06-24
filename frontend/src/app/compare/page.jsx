"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { saveEntry } from "@/lib/history";
import AiOutput from "@/components/AiOutput";
import toast from "react-hot-toast";

export default function ComparePage() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [context, setContext] = useState("ecological impact and implementation feasibility");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!a.trim() || !b.trim()) { toast.error("Enter both strategies to compare"); return; }
    setLoading(true); setResult("");
    try {
      const d = await api.compare({ strategy_a:a, strategy_b:b, context });
      setResult(d.result);
      saveEntry("compare", `A: ${a.slice(0,60)} vs B: ${b.slice(0,60)}`, d.result);
      toast.success("Comparison complete!");
    } catch(e) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="animate-fadeUp">
      <div className="eyebrow">Tool 7 of 8</div>
      <h1 className="page-title">⚖️ Strategy Comparison Engine</h1>
      <p className="page-desc">Compare two ecological strategies side by side. AI scores each on 6 criteria — scientific rigor, feasibility, cost-effectiveness, speed, community benefit, and AI integration — and declares a winner.</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="card">
          <div className="label mb-3">Strategy A</div>
          <textarea className="textarea" rows={8} value={a} onChange={e=>setA(e.target.value)}
            placeholder="Paste or describe Strategy A here...&#10;&#10;e.g. Community-based afforestation using native species with participatory monitoring and local employment..." />
        </div>
        <div className="card">
          <div className="label mb-3">Strategy B</div>
          <textarea className="textarea" rows={8} value={b} onChange={e=>setB(e.target.value)}
            placeholder="Paste or describe Strategy B here...&#10;&#10;e.g. Tech-driven AI reforestation using drone seeding, satellite monitoring and carbon credit financing..." />
        </div>
      </div>

      <div className="card mb-4">
        <div className="label mb-2">Comparison Context</div>
        <input className="input" value={context} onChange={e=>setContext(e.target.value)} placeholder="e.g. ecological impact, community benefit, long-term sustainability" />
      </div>

      <button className="btn-primary w-full mb-5" onClick={run} disabled={loading}>{loading?"⏳ Analysing both strategies...":"⚖️ Compare Strategies"}</button>

      <AiOutput result={result} loading={loading}
        hint="Scoring both strategies → Building comparison matrix → Declaring winner..."
        idleIcon="⚖️" idleMessage="Enter both strategies above and click Compare to get an AI-powered scoring analysis." />
    </div>
  );
}
