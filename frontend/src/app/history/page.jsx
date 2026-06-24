"use client";
import { useState, useEffect } from "react";
import { getAll, deleteEntry, clearAll, searchEntries, TYPE_LABELS } from "@/lib/history";
import AiOutput from "@/components/AiOutput";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const load = () => setEntries(query ? searchEntries(query) : getAll());
  useEffect(load, [query]);

  const del = (id) => { deleteEntry(id); load(); if(selected?.id===id) setSelected(null); toast.success("Deleted"); };
  const clearHistory = () => { clearAll(); setEntries([]); setSelected(null); toast.success("History cleared"); };

  const exportAll = () => {
    const txt = entries.map(e=>`=== ${TYPE_LABELS[e.type]||e.type} ===\nDate: ${new Date(e.timestamp).toLocaleString("en-IN")}\nInput: ${e.input}\n\nOutput:\n${e.output}`).join("\n\n" + "=".repeat(60) + "\n\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt],{type:"text/plain"}));
    a.download = `EcoIntelligence_History_${Date.now()}.txt`;
    a.click();
    toast.success("History exported!");
  };

  return (
    <div className="animate-fadeUp">
      <div className="eyebrow">Platform</div>
      <h1 className="page-title">📂 My Strategy History</h1>
      <p className="page-desc">All your saved strategies, analyses, and documents — searchable, exportable, and re-usable.</p>

      <div className="flex gap-3 mb-5">
        <input className="input flex-1" value={query} onChange={e=>setQuery(e.target.value)} placeholder="🔍 Search across all history..." />
        <button className="btn-ghost" onClick={exportAll}>📥 Export All</button>
        <button className="btn-ghost" onClick={clearHistory} style={{color:"#ef4444",borderColor:"rgba(239,68,68,0.3)"}}>🗑️ Clear All</button>
      </div>

      {entries.length === 0 ? (
        <div className="card py-16 text-center">
          <div className="text-5xl mb-4 opacity-20">📂</div>
          <div className="text-[14px]" style={{color:"var(--muted)"}}>{query ? "No results match your search." : "No history yet. Run any tool to start building your library."}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="font-mono text-[10px] mb-1" style={{color:"var(--dim)"}}>{entries.length} ENTRIES {query?`— FILTERED BY "${query}"`:""}</div>
            {entries.map(e=>(
              <div key={e.id} onClick={()=>setSelected(e)}
                className="card cursor-pointer transition-all"
                style={{borderColor:selected?.id===e.id?"var(--border2)":"var(--border)"}}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px]" style={{color:"var(--g)"}}>{TYPE_LABELS[e.type]||e.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px]" style={{color:"var(--dim)"}}>{new Date(e.timestamp).toLocaleDateString("en-IN")}</span>
                    <button onClick={(ev)=>{ev.stopPropagation();del(e.id);}} className="text-[11px] px-2 py-0.5 rounded hover:bg-red-900/30" style={{color:"#ef4444"}}>✕</button>
                  </div>
                </div>
                <div className="font-display text-[13px] font-medium mb-1 line-clamp-2">{e.input.slice(0,100)}{e.input.length>100?"...":""}</div>
                <div className="text-[12px] leading-relaxed" style={{color:"var(--muted)"}}>{e.preview}</div>
              </div>
            ))}
          </div>
          <div>
            {selected ? (
              <div className="card sticky top-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px]" style={{color:"var(--g)"}}>{TYPE_LABELS[selected.type]||selected.type}</span>
                  <span className="font-mono text-[10px]" style={{color:"var(--dim)"}}>{new Date(selected.timestamp).toLocaleString("en-IN")}</span>
                </div>
                <div className="mb-3 text-[13px] p-3 rounded-lg" style={{background:"rgba(0,232,122,0.05)",border:"1px solid var(--border)"}}>
                  <div className="font-mono text-[10px] mb-1" style={{color:"var(--g)"}}>INPUT</div>
                  <div style={{color:"var(--muted)"}}>{selected.input}</div>
                </div>
                <div className="overflow-y-auto" style={{maxHeight:"420px"}}>
                  <AiOutput result={selected.output} loading={false} idleIcon="" idleMessage="" />
                </div>
              </div>
            ) : (
              <div className="card py-16 text-center">
                <div className="text-3xl mb-3 opacity-20">👆</div>
                <div className="text-[13px]" style={{color:"var(--muted)"}}>Click an entry to view the full output</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
