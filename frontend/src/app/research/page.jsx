"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { saveEntry } from "@/lib/history";
import AiOutput from "@/components/AiOutput";
import { SegGroup, FormGroup, ScenarioSelect } from "@/components/FormPanel";
import toast from "react-hot-toast";

const SCENARIOS = [
  { label:"AI in Deforestation Monitoring NE India", value:"Role of AI and satellite remote sensing in monitoring deforestation rates and forest degradation in India's northeastern states, with focus on actionable intervention triggers." },
  { label:"ML for AQI Prediction Indo-Gangetic Plain", value:"Machine learning approaches for predicting Air Quality Index in Indo-Gangetic Plain cities including Delhi, Lucknow, Patna and Muzaffarpur — with real-time alert systems." },
  { label:"Indian Wetland Biodiversity Loss", value:"Biodiversity loss in Indian wetlands: drivers, ecological consequences, and potential for AI-assisted conservation monitoring across Ramsar sites." },
  { label:"Climate-Agriculture Nexus Bihar/UP", value:"Climate change impacts on monsoon variability, agricultural ecology, and food security in Bihar and Eastern Uttar Pradesh — adaptation strategies using precision agriculture AI." },
  { label:"Microplastics in Indian Rivers", value:"Effect of microplastics on freshwater macroinvertebrates in Indian rivers — current evidence, AI monitoring approaches, and intervention strategies." },
];

const EXTRA = [
  { key:"kpi", label:"📈 KPI Generator", desc:"Generate comprehensive KPI framework for ecological projects", fields:[{k:"project",ph:"e.g. Community watershed management program"},{k:"goals",ph:"e.g. Restore 500 ha watershed, improve water quality, create 200 livelihoods"}], run:(f)=>api.kpi({project:f.project,goals:f.goals,timeframe:"3 years"}) },
  { key:"innovation", label:"💡 Eco-Innovator", desc:"Generate innovative AI-powered solutions for ecological problems", fields:[{k:"problem",ph:"e.g. Monitoring illegal wildlife poaching in real-time across 1000 sq km"},{k:"constraints",ph:"e.g. Low budget, remote areas, limited connectivity"}], run:(f)=>api.innovation({problem:f.problem,constraints:f.constraints||"Low budget, rural context"}) },
  { key:"summary", label:"📋 Exec Summary", desc:"Generate a compelling executive summary from your content", fields:[{k:"content",ph:"Paste your strategy, report, or research content here..."},{k:"audience",ph:"e.g. Government officials, NGO funders, Media"}], run:(f)=>api.summary({content:f.content,audience:f.audience||"Government officials"}) },
];

export default function ResearchPage() {
  const [form, setForm] = useState({ topic:"", goal:"Full Synthesis", context:"India / South Asia" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("research");
  const [subForms, setSubForms] = useState({});
  const [subResults, setSubResults] = useState({});
  const [subLoadings, setSubLoadings] = useState({});
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const setSF = (key,k,v) => setSubForms(p=>({...p,[key]:{...(p[key]||{}),[k]:v}}));
  const sf = (key,k) => (subForms[key]||{})[k]||"";

  const run = async () => {
    if (!form.topic.trim()) { toast.error("Enter a research topic"); return; }
    setLoading(true); setResult("");
    try {
      const d = await api.research(form);
      setResult(d.result);
      saveEntry("research", form.topic, d.result);
      toast.success("Research synthesised!");
    } catch(e) { toast.error(e.message); } finally { setLoading(false); }
  };

  const runExtra = async (tool) => {
    setSubLoadings(p=>({...p,[tool.key]:true}));
    try {
      const d = await tool.run(subForms[tool.key]||{});
      setSubResults(p=>({...p,[tool.key]:d.result}));
      saveEntry(tool.key, sf(tool.key,"problem")||sf(tool.key,"project")||sf(tool.key,"content"), d.result);
      toast.success("Done!");
    } catch(e) { toast.error(e.message); } finally { setSubLoadings(p=>({...p,[tool.key]:false})); }
  };

  return (
    <div className="animate-fadeUp">
      <div className="eyebrow">Tool 4 of 8</div>
      <h1 className="page-title">🔬 Research, Innovation & KPIs</h1>
      <p className="page-desc">Research Literature Synthesizer, KPI Generator, Eco-Innovation Ideator, and Executive Summary builder — all AI-powered.</p>

      <div className="flex gap-2 mb-5 flex-wrap">
        <button className={`seg-btn ${activeTab==="research"?"active":""}`} onClick={()=>setActiveTab("research")}>🔬 Research Synthesizer</button>
        {EXTRA.map(e=><button key={e.key} className={`seg-btn ${activeTab===e.key?"active":""}`} onClick={()=>setActiveTab(e.key)}>{e.label}</button>)}
      </div>

      {activeTab==="research" ? (
        <div className="tool-layout">
          <div className="card">
            <FormGroup label="Research Topic"><textarea className="textarea" rows={3} value={form.topic} onChange={e=>set("topic",e.target.value)} placeholder="e.g. Effect of climate change on tiger habitat corridors in Central India..." /></FormGroup>
            <FormGroup label="Load Example Topic"><ScenarioSelect scenarios={SCENARIOS} onSelect={v=>set("topic",v)} /></FormGroup>
            <FormGroup label="Research Goal"><SegGroup options={["Full Synthesis","Gap Analysis","AI Methods","Literature Review","Research Priorities"]} value={form.goal} onChange={v=>set("goal",v)} /></FormGroup>
            <FormGroup label="Geographic Focus"><input className="input" value={form.context} onChange={e=>set("context",e.target.value)} placeholder="e.g. India, Bihar, South Asia" /></FormGroup>
            <button className="btn-primary w-full" onClick={run} disabled={loading}>{loading?"⏳ Synthesising...":"🔬 Synthesise Research"}</button>
          </div>
          <AiOutput result={result} loading={loading} hint="Mining ecology literature → Synthesising insights → Identifying AI approaches..." idleIcon="🔬" idleMessage="Enter a research topic to get a structured knowledge synthesis with AI method recommendations." onSave={()=>{saveEntry("research",form.topic,result);toast.success("Saved!");}} />
        </div>
      ) : EXTRA.map(tool => activeTab===tool.key && (
        <div key={tool.key} className="tool-layout">
          <div className="card">
            <div className="mb-3 text-[13px]" style={{color:"var(--muted)"}}>{tool.desc}</div>
            {tool.fields.map(f=>(
              <FormGroup key={f.k} label={f.k.charAt(0).toUpperCase()+f.k.slice(1)}>
                <textarea className="textarea" rows={3} value={sf(tool.key,f.k)} onChange={e=>setSF(tool.key,f.k,e.target.value)} placeholder={f.ph} />
              </FormGroup>
            ))}
            <button className="btn-primary w-full" onClick={()=>runExtra(tool)} disabled={subLoadings[tool.key]}>{subLoadings[tool.key]?"⏳ Processing...":"▶ Run "+tool.label.split(" ").slice(1).join(" ")}</button>
          </div>
          <AiOutput result={subResults[tool.key]} loading={subLoadings[tool.key]} hint="Analysing..." idleIcon={tool.label.split(" ")[0]} idleMessage={`Fill in the details to run ${tool.label}.`} />
        </div>
      ))}
    </div>
  );
}
