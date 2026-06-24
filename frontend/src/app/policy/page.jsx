"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { saveEntry } from "@/lib/history";
import AiOutput from "@/components/AiOutput";
import { SegGroup, FormGroup, ScenarioSelect } from "@/components/FormPanel";
import toast from "react-hot-toast";

const SCENARIOS = [
  { label:"Sand Mining in Bihar Rivers", value:"Unregulated sand mining in riverbeds across Bihar is destroying aquatic habitats, causing riverbank erosion, and depleting groundwater recharge zones." },
  { label:"Industrial Water Pollution UP/Bihar", value:"Industrial effluent discharge from textile and tannery industries is severely polluting the Ganga and tributaries in Uttar Pradesh and Bihar, affecting millions who depend on the river." },
  { label:"Urban Green Cover Loss", value:"Rapid urbanisation in Tier-2 cities is destroying urban green cover, increasing heat island effect, and reducing groundwater infiltration capacity." },
  { label:"Coastal Zone Degradation", value:"Unregulated construction in Coastal Regulation Zone areas is destroying mangroves, beaches and coastal ecosystems essential for storm protection and fishery habitat." },
];

const TABS = ["📝 Policy Drafter","👥 Stakeholders","⚠️ Risk Matrix","✅ Compliance","💰 Grant Writing","🚨 Crisis Response","🗺️ Roadmap"];

export default function PolicyPage() {
  const [tab, setTab] = useState(0);
  const [forms, setForms] = useState({});
  const [results, setResults] = useState({});
  const [loadings, setLoadings] = useState({});
  const setF = (t,k,v) => setForms(p=>({...p,[t]:{...(p[t]||{}), [k]:v}}));
  const f = (t,k,def="") => (forms[t]||{})[k] || def;
  const setL = (t,v) => setLoadings(p=>({...p,[t]:v}));
  const setR = (t,v) => setResults(p=>({...p,[t]:v}));

  const runs = {
    0: async() => { const d=await api.policy({issue:f(0,"issue"),region:f(0,"region","India"),stakeholders:f(0,"stake","Government, NGOs, Communities"),policy_type:f(0,"type","Regulation")}); setR(0,d.result); saveEntry("policy",f(0,"issue"),d.result); },
    1: async() => { const d=await api.stakeholders({project:f(1,"project"),region:f(1,"region","India")}); setR(1,d.result); saveEntry("stakeholders",f(1,"project"),d.result); },
    2: async() => { const d=await api.risk({project:f(2,"project"),context:f(2,"context","India")}); setR(2,d.result); saveEntry("risk",f(2,"project"),d.result); },
    3: async() => { const d=await api.compliance({activity:f(3,"activity"),location:f(3,"location","India")}); setR(3,d.result); saveEntry("compliance",f(3,"activity"),d.result); },
    4: async() => { const d=await api.grant({project:f(4,"project"),organization:f(4,"org"),budget:f(4,"budget","50 lakh INR")}); setR(4,d.result); saveEntry("grant",f(4,"project"),d.result); },
    5: async() => { const d=await api.crisis({crisis:f(5,"crisis"),location:f(5,"loc","India"),severity:f(5,"severity","High")}); setR(5,d.result); saveEntry("crisis",f(5,"crisis"),d.result); },
    6: async() => { const d=await api.roadmap({goal:f(6,"goal"),organization:f(6,"org"),years:parseInt(f(6,"years","10"))}); setR(6,d.result); saveEntry("roadmap",f(6,"goal"),d.result); },
  };

  const handle = async(i) => {
    setL(i,true);
    try { await runs[i](); toast.success("Done!"); } catch(e) { toast.error(e.message); } finally { setL(i,false); }
  };

  const FORMS = [
    <div key={0}>
      <FormGroup label="Environmental Issue"><textarea className="textarea" rows={3} value={f(0,"issue")} onChange={e=>setF(0,"issue",e.target.value)} placeholder="e.g. Groundwater depletion in Punjab due to over-irrigation..." /></FormGroup>
      <FormGroup label="Load Scenario"><ScenarioSelect scenarios={SCENARIOS} onSelect={v=>setF(0,"issue",v)} /></FormGroup>
      <FormGroup label="Target Region"><input className="input" value={f(0,"region")} onChange={e=>setF(0,"region",e.target.value)} placeholder="e.g. Bihar, India" /></FormGroup>
      <FormGroup label="Key Stakeholders"><input className="input" value={f(0,"stake")} onChange={e=>setF(0,"stake",e.target.value)} placeholder="e.g. State government, farmers, NGOs" /></FormGroup>
      <FormGroup label="Policy Type"><SegGroup options={["Regulation","Incentive","Framework","Action Plan"]} value={f(0,"type","Regulation")} onChange={v=>setF(0,"type",v)} /></FormGroup>
    </div>,
    <div key={1}>
      <FormGroup label="Project Description"><textarea className="textarea" rows={3} value={f(1,"project")} onChange={e=>setF(1,"project",e.target.value)} placeholder="e.g. Community-based mangrove restoration in Sundarbans..." /></FormGroup>
      <FormGroup label="Region"><input className="input" value={f(1,"region")} onChange={e=>setF(1,"region",e.target.value)} placeholder="e.g. West Bengal, India" /></FormGroup>
    </div>,
    <div key={2}>
      <FormGroup label="Project Description"><textarea className="textarea" rows={3} value={f(2,"project")} onChange={e=>setF(2,"project",e.target.value)} placeholder="e.g. Large-scale afforestation in Central India..." /></FormGroup>
      <FormGroup label="Context"><input className="input" value={f(2,"context")} onChange={e=>setF(2,"context",e.target.value)} placeholder="e.g. Government-funded, tribal region, monsoon-dependent" /></FormGroup>
    </div>,
    <div key={3}>
      <FormGroup label="Activity to Check"><textarea className="textarea" rows={3} value={f(3,"activity")} onChange={e=>setF(3,"activity",e.target.value)} placeholder="e.g. Setting up a 50 MW solar plant near a wildlife sanctuary in Rajasthan..." /></FormGroup>
      <FormGroup label="Location"><input className="input" value={f(3,"location")} onChange={e=>setF(3,"location",e.target.value)} placeholder="e.g. Rajasthan, India" /></FormGroup>
    </div>,
    <div key={4}>
      <FormGroup label="Project Description"><textarea className="textarea" rows={3} value={f(4,"project")} onChange={e=>setF(4,"project",e.target.value)} placeholder="e.g. Restoring degraded grassland ecosystems in Banni, Gujarat..." /></FormGroup>
      <FormGroup label="Organization"><input className="input" value={f(4,"org")} onChange={e=>setF(4,"org",e.target.value)} placeholder="e.g. Wildlife Conservation Trust India" /></FormGroup>
      <FormGroup label="Budget (INR)"><input className="input" value={f(4,"budget")} onChange={e=>setF(4,"budget",e.target.value)} placeholder="e.g. 1.5 crore" /></FormGroup>
    </div>,
    <div key={5}>
      <FormGroup label="Crisis Description"><textarea className="textarea" rows={3} value={f(5,"crisis")} onChange={e=>setF(5,"crisis",e.target.value)} placeholder="e.g. Massive oil spill in the Gulf of Mannar coral reef area..." /></FormGroup>
      <FormGroup label="Location"><input className="input" value={f(5,"loc")} onChange={e=>setF(5,"loc",e.target.value)} placeholder="e.g. Tamil Nadu coast" /></FormGroup>
      <FormGroup label="Severity"><SegGroup options={["Moderate","High","Critical"]} value={f(5,"severity","High")} onChange={v=>setF(5,"severity",v)} /></FormGroup>
    </div>,
    <div key={6}>
      <FormGroup label="Long-term Goal"><textarea className="textarea" rows={3} value={f(6,"goal")} onChange={e=>setF(6,"goal",e.target.value)} placeholder="e.g. Restore 50,000 ha of degraded forests and improve biodiversity by 40%..." /></FormGroup>
      <FormGroup label="Organization"><input className="input" value={f(6,"org")} onChange={e=>setF(6,"org",e.target.value)} placeholder="e.g. State Forest Department, Odisha" /></FormGroup>
      <FormGroup label="Roadmap Duration"><SegGroup options={["5 years","10 years","15 years","20 years"]} value={f(6,"years","10")} onChange={v=>setF(6,"years",v.split(" ")[0])} /></FormGroup>
    </div>,
  ];

  const HINTS = ["Reviewing laws → Drafting policy document...","Mapping stakeholders → Analysing power dynamics...","Identifying risks → Building mitigation matrix...","Checking regulations → Reviewing compliance...","Researching funders → Writing proposal...","Assessing crisis → Building response plan...","Modelling future → Building roadmap..."];
  const IDLES = [["📝","Fill in the issue details to generate a policy document."],["👥","Describe your project to map stakeholders."],["⚠️","Describe your project to generate a risk matrix."],["✅","Describe the activity to check environmental compliance."],["💰","Describe your project to generate a grant proposal."],["🚨","Describe the ecological crisis to get an emergency response plan."],["🗺️","Define your long-term goal to build a roadmap."]];

  return (
    <div className="animate-fadeUp">
      <div className="eyebrow">Tool 3 & more</div>
      <h1 className="page-title">📝 Policy, Planning & Governance</h1>
      <p className="page-desc">7 AI-powered planning tools: Policy Drafter, Stakeholder Analysis, Risk Matrix, Compliance Checker, Grant Writing, Crisis Response, and Long-term Roadmap.</p>
      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map((t,i)=><button key={i} className={`seg-btn ${tab===i?"active":""}`} onClick={()=>setTab(i)}>{t}</button>)}
      </div>
      <div className="tool-layout">
        <div className="card">
          {FORMS[tab]}
          <button className="btn-primary w-full mt-2" onClick={()=>handle(tab)} disabled={loadings[tab]}>{loadings[tab]?"⏳ Processing...":TABS[tab].split(" ").slice(1).join(" ")}</button>
        </div>
        <AiOutput result={results[tab]} loading={loadings[tab]} hint={HINTS[tab]} idleIcon={IDLES[tab][0]} idleMessage={IDLES[tab][1]} />
      </div>
    </div>
  );
}
