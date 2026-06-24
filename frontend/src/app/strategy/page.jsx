"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { saveEntry } from "@/lib/history";
import AiOutput from "@/components/AiOutput";
import { SegGroup, FormGroup, ScenarioSelect } from "@/components/FormPanel";
import toast from "react-hot-toast";

const SCENARIOS = [
  { label:"Western Ghats Deforestation", value:"Deforestation in the Western Ghats is accelerating due to illegal logging and agricultural encroachment, threatening endemic species and water catchment areas that supply drinking water to millions." },
  { label:"Muzaffarpur Air Pollution (Bihar)", value:"Air quality in Muzaffarpur, Bihar has reached hazardous levels due to brick kilns, vehicular emissions and crop residue burning — causing severe respiratory disease in 40% of the local population." },
  { label:"Lakshadweep Coral Bleaching", value:"Coral bleaching in the Lakshadweep archipelago threatens 20% of India's marine biodiversity and the livelihoods of 70,000 islanders dependent on fishing and tourism." },
  { label:"Chilika Lake Eutrophication", value:"Agricultural runoff rich in nitrogen and phosphorus is creating algal blooms in Chilika Lake, India's largest coastal lagoon, destroying fish habitat and endangering 160 species of migratory birds." },
  { label:"Ganga River Plastic Pollution", value:"Plastic pollution in the Ganga River Basin is causing microplastic contamination of drinking water sources affecting 500 million people and severely degrading aquatic biodiversity." },
];

export default function StrategyPage() {
  const [form, setForm] = useState({ problem:"", domain:"🌱 Biodiversity", region:"Rural", urgency:"Strategic", language:"English" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("standard");
  const [multiResult, setMultiResult] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const run = async () => {
    if (!form.problem.trim()) { toast.error("Please describe the ecological problem"); return; }
    setLoading(true); setResult(""); setMultiResult(null);
    try {
      if (mode === "multiagent") {
        const d = await api.multiAgent({ problem: form.problem, domain: form.domain });
        setMultiResult(d);
        saveEntry("multiagent", form.problem, d.final_synthesis);
        toast.success("Multi-agent synthesis complete!");
      } else {
        const d = await api.strategy(form);
        setResult(d.result);
        saveEntry("strategy", form.problem, d.result);
        toast.success("Strategy generated!");
      }
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fadeUp">
      <div className="eyebrow">Tool 1 of 8</div>
      <h1 className="page-title">⚡ Ecological Strategy Generator</h1>
      <p className="page-desc">Describe any environmental challenge. The AI generates a complete, implementation-ready strategy with objectives, AI-driven interventions, phased timeline, and measurable KPIs.</p>

      <div className="flex gap-2 mb-5">
        <button className={`seg-btn ${mode==="standard"?"active":""}`} onClick={() => setMode("standard")}>⚡ Standard Mode</button>
        <button className={`seg-btn ${mode==="multiagent"?"active":""}`} onClick={() => setMode("multiagent")}>🤖 Multi-Agent Mode (3 AI experts)</button>
      </div>
      {mode==="multiagent" && <div className="mb-4 px-4 py-3 rounded-lg text-[13px]" style={{ background:"rgba(0,232,122,0.06)", border:"1px solid var(--border)", color:"var(--muted)" }}>Three AI agents (Ecologist · Policy Advisor · AI Researcher) debate and synthesize a superior strategy. Takes ~15 seconds.</div>}

      <div className="tool-layout">
        <div className="card">
          <FormGroup label="Ecological Problem">
            <textarea className="textarea" rows={4} value={form.problem} onChange={e => set("problem",e.target.value)}
              placeholder="e.g. Riverine plastic pollution in Bihar is degrading aquatic biodiversity and affecting downstream communities..." />
          </FormGroup>
          <FormGroup label="Domain">
            <SegGroup options={["🌱 Biodiversity","🌡️ Climate","💧 Water","🌾 Soil","🏙️ Urban","🌊 Marine","🌳 Forests","♻️ Circular Economy"]} value={form.domain} onChange={v => set("domain",v)} />
          </FormGroup>
          <FormGroup label="Region Type">
            <SegGroup options={["Rural","Urban","Coastal","Forest","River","Agricultural"]} value={form.region} onChange={v => set("region",v)} />
          </FormGroup>
          <FormGroup label="Urgency">
            <SegGroup options={["Strategic","Urgent","Emergency"]} value={form.urgency} onChange={v => set("urgency",v)} />
          </FormGroup>
          <FormGroup label="Language">
            <SegGroup options={["English","Hindi"]} value={form.language} onChange={v => set("language",v)} />
          </FormGroup>
          <FormGroup label="Load Scenario">
            <ScenarioSelect scenarios={SCENARIOS} onSelect={v => set("problem",v)} />
          </FormGroup>
          <button className="btn-primary w-full" onClick={run} disabled={loading}>
            {loading ? "⏳ Generating..." : mode==="multiagent" ? "🤖 Run Multi-Agent Strategy" : "⚡ Generate Strategy"}
          </button>
        </div>

        {mode==="multiagent" && multiResult ? (
          <div className="flex flex-col gap-4">
            {[["🌿 Ecologist's Analysis", multiResult.ecologist], ["🏛️ Policy Advisor's View", multiResult.policy_advisor], ["🤖 Final AI Synthesis", multiResult.final_synthesis]].map(([title, content]) => (
              <div key={title} className="out-panel">
                <div className="out-topbar"><span className="font-display font-semibold text-[13px]">{title}</span></div>
                <div className="out-body"><AiOutput result={content} loading={false} idleIcon="🤖" idleMessage="" /></div>
              </div>
            ))}
          </div>
        ) : (
          <AiOutput result={result} loading={loading}
            hint="Analysing ecological context → Synthesising AI strategy → Building implementation plan..."
            idleIcon="⚡" idleMessage="Configure the problem parameters and click Generate Strategy."
            onSave={() => { saveEntry("strategy", form.problem, result); toast.success("Saved to history!"); }} />
        )}
      </div>
    </div>
  );
}
