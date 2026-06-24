"use client";
import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const SUGGESTIONS = [
  "What are India's most critically endangered species?",
  "Explain the key provisions of India's Environment Protection Act 1986",
  "How can AI help in biodiversity monitoring?",
  "What is the current status of India's forest cover?",
  "Explain REDD+ and how India can benefit",
  "What are the best AI models for satellite deforestation detection?",
  "How does climate change affect the Indian monsoon?",
  "What is the Biological Diversity Act 2002?",
];

export default function EcoBotPage() {
  const [messages, setMessages] = useState([
    { role:"assistant", content:"👋 Hi! I'm **EcoBot** — your AI ecology expert. I'm trained on environmental science, Indian ecological policy, conservation biology, and AI applications in ecology.\n\nAsk me anything — from species identification to climate policy, from AI monitoring tools to grant strategies. I'm here to help! 🌿" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const newMsgs = [...messages, { role:"user", content:msg }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const d = await api.chat({ message:msg, history:messages.slice(-8).map(m=>({role:m.role,content:m.content})) });
      setMessages(p => [...p, { role:"assistant", content:d.reply }]);
    } catch(e) {
      toast.error(e.message);
      setMessages(p => [...p, { role:"assistant", content:"⚠️ Sorry, I encountered an error. Please check your API connection and try again." }]);
    } finally { setLoading(false); }
  };

  const exportChat = () => {
    const txt = messages.map(m => `${m.role.toUpperCase()}:\n${m.content}`).join("\n\n---\n\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], {type:"text/plain"}));
    a.download = `EcoBot_Chat_${Date.now()}.txt`;
    a.click();
    toast.success("Chat exported!");
  };

  const clear = () => { setMessages([{ role:"assistant", content:"Chat cleared. How can I help you? 🌿" }]); toast.success("Chat cleared"); };

  function renderMsg(content) {
    return content
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  }

  return (
    <div className="animate-fadeUp flex flex-col" style={{height:"calc(100vh - 126px)"}}>
      <div className="flex items-start justify-between mb-4 flex-shrink-0">
        <div>
          <div className="eyebrow">Tool 6 of 8</div>
          <h1 className="page-title mb-1">🤖 EcoBot AI</h1>
          <p className="text-[13px]" style={{color:"var(--muted)"}}>Context-aware AI chatbot. Expert in ecology, Indian environmental law, conservation science, and AI applications.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportChat} className="btn-ghost text-[12px]">📥 Export Chat</button>
          <button onClick={clear} className="btn-ghost text-[12px]">🗑️ Clear</button>
        </div>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap flex-shrink-0">
        {SUGGESTIONS.slice(0,4).map(s=><button key={s} className="seg-btn text-[11px]" onClick={()=>send(s)}>{s.slice(0,40)}...</button>)}
      </div>

      <div className="flex-1 overflow-y-auto card mb-3" style={{minHeight:0}}>
        <div className="flex flex-col gap-4 p-2">
          {messages.map((m,i)=>(
            <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${m.role==="user"?"text-[#040C08] font-medium":""}`}
                style={m.role==="user" ? {background:"var(--g)"} : {background:"var(--card2)",border:"1px solid var(--border)",color:"#D8EEDE"}}>
                {m.role==="assistant" ? <div dangerouslySetInnerHTML={{__html:renderMsg(m.content)}} /> : m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3" style={{background:"var(--card2)",border:"1px solid var(--border)"}}>
                <div className="flex gap-1.5">
                  {[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full" style={{background:"var(--g)",animation:`tdot 1.4s ${i*0.22}s infinite`}} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <style>{`@keyframes tdot{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-8px);opacity:1}}`}</style>

      <div className="flex gap-2 flex-shrink-0">
        <input className="input flex-1" value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder="Ask EcoBot anything about ecology, conservation, AI, or Indian environmental policy..." />
        <button className="btn-primary px-6" onClick={()=>send()} disabled={loading||!input.trim()}>Send</button>
      </div>
    </div>
  );
}
