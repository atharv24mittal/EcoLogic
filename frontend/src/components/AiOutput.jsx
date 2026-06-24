"use client";
import { useState } from "react";
import toast from "react-hot-toast";

function md2html(text) {
  if (!text) return "";
  const lines = text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").split("\n");
  let html = "", inUl = false, inOl = false;
  for (let l of lines) {
    l = l.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`(.+?)`/g, '<code style="background:rgba(0,232,122,0.1);padding:1px 5px;border-radius:3px;font-family:JetBrains Mono,monospace;font-size:12px;color:#00E87A">$1</code>');
    if (/^## /.test(l)) { if(inUl){html+="</ul>";inUl=false} if(inOl){html+="</ol>";inOl=false} html+=`<h2>${l.slice(3).trim()}</h2>`; }
    else if (/^### /.test(l)) { html+=`<p><strong>${l.slice(4).trim()}</strong></p>`; }
    else if (/^\|/.test(l) && l.includes("|")) {
      if(inUl){html+="</ul>";inUl=false} if(inOl){html+="</ol>";inOl=false}
      if (/^[|\s\-:]+$/.test(l)) continue;
      const cells = l.split("|").filter((c,i,a) => i>0 && i<a.length-1).map(c=>c.trim());
      const isHeader = lines.indexOf(l) < lines.findIndex(ll => /^[|\s\-:]+$/.test(ll));
      if (isHeader || l.includes("**")) html += `<tr>${cells.map(c=>`<th>${c}</th>`).join("")}</tr>`;
      else html += `<tr>${cells.map(c=>`<td>${c}</td>`).join("")}</tr>`;
    }
    else if (/^[*\-] /.test(l)) { if(!inUl){if(inOl){html+="</ol>";inOl=false}html+="<ul>";inUl=true} html+=`<li>${l.slice(2).trim()}</li>`; }
    else if (/^\d+\. /.test(l)) { if(!inOl){if(inUl){html+="</ul>";inUl=false}html+="<ol>";inOl=true} html+=`<li>${l.replace(/^\d+\. /,"").trim()}</li>`; }
    else if (l.trim()==="") { if(inUl){html+="</ul>";inUl=false} if(inOl){html+="</ol>";inOl=false} }
    else { if(inUl){html+="</ul>";inUl=false} if(inOl){html+="</ol>";inOl=false} html+=`<p>${l.trim()}</p>`; }
  }
  if(inUl) html+="</ul>"; if(inOl) html+="</ol>";
  // wrap table rows
  html = html.replace(/(<tr>.*?<\/tr>\n*)+/gs, m => `<table>${m}</table>`);
  return html;
}

export function LoadingOutput({ hint }) {
  return (
    <div className="p-4">
      <div className="font-mono text-[10px] mb-3" style={{ color: "var(--g)", letterSpacing: "1px" }}>▶ ECOINTELLIGENCE ENGINE · PROCESSING</div>
      <div className="flex gap-1.5 py-2">
        {[0,1,2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full" style={{ background:"var(--g)", animation:`tdot 1.4s ${i*0.22}s infinite` }} />
        ))}
      </div>
      <div className="font-mono text-[11px] mt-2 leading-7" style={{ color: "var(--dim)" }}>{hint}</div>
      <style>{`@keyframes tdot{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-8px);opacity:1}}`}</style>
    </div>
  );
}

export function IdleOutput({ icon, message }) {
  return (
    <div className="idle-state">
      <div className="text-5xl opacity-20">{icon}</div>
      <div className="text-[14px] max-w-[240px] leading-relaxed" style={{ color: "var(--muted)" }}>{message}</div>
      <div className="font-mono text-[10px] mt-1" style={{ color: "var(--dim)" }}>ECOINTELLIGENCE ENGINE · READY</div>
    </div>
  );
}

export default function AiOutput({ result, loading, hint, idleIcon, idleMessage, onSave }) {
  const [copied, setCopied] = useState(false);
  const ts = new Date().toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" });

  const copy = () => {
    navigator.clipboard.writeText(result || "");
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const print = () => window.print();

  const share = () => {
    const url = `${window.location.origin}${window.location.pathname}?output=${encodeURIComponent((result||"").slice(0,500))}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied!");
  };

  return (
    <div className="out-panel">
      <div className="out-topbar">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="live-dot" />
          <span>&nbsp;AI Engine</span>
        </div>
        {result && (
          <div className="flex items-center gap-2">
            <button onClick={copy} className="btn-ghost text-[11px] px-2 py-1">{copied ? "✓ Copied" : "📋 Copy"}</button>
            <button onClick={share} className="btn-ghost text-[11px] px-2 py-1">🔗 Share</button>
            <button onClick={print} className="btn-ghost text-[11px] px-2 py-1">🖨️ Print</button>
            {onSave && <button onClick={onSave} className="btn-ghost text-[11px] px-2 py-1">💾 Save</button>}
          </div>
        )}
      </div>
      <div className="out-body">
        {loading ? <LoadingOutput hint={hint} />
          : result ? <div className="ai-prose" dangerouslySetInnerHTML={{ __html: md2html(result) }} />
          : <IdleOutput icon={idleIcon} message={idleMessage} />}
      </div>
      {result && (
        <div className="out-foot">
          <span>✅ Generated · EcoIntelligence v1.0</span>
          <span>{ts}</span>
        </div>
      )}
    </div>
  );
}
