"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { saveEntry } from "@/lib/history";
import AiOutput from "@/components/AiOutput";
import { SegGroup, FormGroup } from "@/components/FormPanel";
import toast from "react-hot-toast";

const MORE = [
  { label:"Carbon Calculator", key:"carbon", desc:"Calculate carbon footprint and get AI reduction strategy", fields:[{label:"Activities/Operations",key:"activities",ph:"e.g. 500 acres rice cultivation using flood irrigation, 20 diesel vehicles..."},{label:"Sector",key:"sector",type:"seg",opts:["Agriculture","Transport","Industry","Energy","Urban","Forestry"]},{label:"Region",key:"region",ph:"e.g. Bihar, India"}], run:(f)=>api.carbon({activities:f.activities,sector:f.sector||"Agriculture",region:f.region||"India"}) },
  { label:"Biodiversity Risk", key:"biodiversity", desc:"Assess biodiversity risk and get conservation strategy", fields:[{label:"Ecosystem Type",key:"ecosystem",ph:"e.g. Tropical moist deciduous forest in Eastern Ghats"},{label:"Key Threats",key:"threats",ph:"e.g. Habitat fragmentation, invasive species, poaching"},{label:"Location",key:"location",ph:"e.g. Odisha, India"}], run:(f)=>api.biodiversity({ecosystem:f.ecosystem,threats:f.threats,location:f.location||"India"}) },
  { label:"Budget Estimator", key:"budget", desc:"Estimate project budget with funding recommendations", fields:[{label:"Project Description",key:"project",ph:"e.g. Wetland restoration and community conservation program"},{label:"Scale",key:"scale",type:"seg",opts:["Village","District","State","National"]},{label:"Duration",key:"duration",type:"seg",opts:["1 year","3 years","5 years","10 years"]}], run:(f)=>api.budget({project:f.project,scale:f.scale||"District",duration:f.duration||"3 years"}) },
];

export default function ImpactPage() {
  const [form, setForm] = useState({ intervention:"", scale:"District", timeframe:"3 years", goal:"Carbon Sequestration" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("impact");
  const [subForm, setSubForm] = useState({});
  const [subResult, setSubResult] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const setSub = (k,v) => setSubForm(p=>({...p,[k]:v}));
  const activeTool = MORE.find(m=>m.key===activeTab);

  const run = async () => {
    if (!form.intervention.trim()) { toast.error("Describe the intervention"); return; }
    setLoading(true); setResult("");
    try {
      const d = await api.impact(form);
      setResult(d.result);
      saveEntry("impact", form.intervention, d.result);
      toast.success("Impact estimated!");
    } catch(e) { toast.error(e.message); } finally { setLoading(false); }
  };

  const runSub = async () => {
    setSubLoading(true); setSubResult("");
    try {
      const d = await activeTool.run(subForm);
      setSubResult(d.result);
      saveEntry(activeTab, JSON.stringify(subForm), d.result);
      toast.success("Done!");
    } catch(e) { toast.error(e.message); } finally { setSubLoading(false); }
  };

  return (
    <div className="animate-fadeUp">
      <div className="eyebrow">Tool 2 of 8</div>
      <h1 className="page-title">📊 Impact & Assessment Hub</h1>
      <p className="page-desc">Quantify the environmental, social and economic impact of ecological interventions. Also includes Carbon Calculator, Biodiversity Risk Assessor, and Budget Estimator.</p>

      <div className="flex gap-2 mb-5 flex-wrap">
        {[{key:"impact",label:"📊 Impact Estimator"},...MORE.map(m=>({key:m.key,label:m.label}))].map(t=>(
          <button key={t.key} className={`seg-btn ${activeTab===t.key?"active":""}`} onClick={()=>{setActiveTab(t.key);setSubResult("");}}>{t.label}</button>
        ))}
      </div>

      {activeTab==="impact" ? (
        <div className="tool-layout">
          <div className="card">
            <FormGroup label="Intervention Description">
              <textarea className="textarea" rows={4} value={form.intervention} onChange={e=>set("intervention",e.target.value)} placeholder="e.g. Planting 500,000 native trees across 2,000 ha of degraded forest land in Jharkhand with community management..." />
            </FormGroup>
            <FormGroup label="Scale"><SegGroup options={["Local","District","State","National","International"]} value={form.scale} onChange={v=>set("scale",v)} /></FormGroup>
            <FormGroup label="Timeframe"><SegGroup options={["1 year","3 years","5 years","10 years"]} value={form.timeframe} onChange={v=>set("timeframe",v)} /></FormGroup>
            <FormGroup label="Primary Goal">
              <select className="select" value={form.goal} onChange={e=>set("goal",e.target.value)}>
                {["Carbon Sequestration","Biodiversity Recovery","Water Security","Community Livelihood","Soil Restoration","Air Quality"].map(g=><option key={g}>{g}</option>)}
              </select>
            </FormGroup>
            <button className="btn-primary w-full" onClick={run} disabled={loading}>{loading?"⏳ Estimating...":"📊 Estimate Impact"}</button>
          </div>
          <AiOutput result={result} loading={loading} hint="Modelling environmental variables → Projecting impact outcomes..." idleIcon="📊" idleMessage="Describe your ecological intervention to project its impact." />
        </div>
      ) : activeTool && (
        <div className="tool-layout">
          <div className="card">
            <div className="mb-3 text-[13px]" style={{color:"var(--muted)"}}>{activeTool.desc}</div>
            {activeTool.fields.map(f=>(
              <FormGroup key={f.key} label={f.label}>
                {f.type==="seg" ? <SegGroup options={f.opts} value={subForm[f.key]||f.opts[0]} onChange={v=>setSub(f.key,v)} />
                  : <textarea className="textarea" rows={3} value={subForm[f.key]||""} onChange={e=>setSub(f.key,e.target.value)} placeholder={f.ph} />}
              </FormGroup>
            ))}
            <button className="btn-primary w-full" onClick={runSub} disabled={subLoading}>{subLoading?"⏳ Analysing...":"🔍 Analyse"}</button>
          </div>
          <AiOutput result={subResult} loading={subLoading} hint="Analysing data..." idleIcon="📊" idleMessage={`Fill in the details to run the ${activeTool.label}.`} />
        </div>
      )}
    </div>
  );
}
