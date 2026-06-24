const KEY = "eco_history";

export function saveEntry(type, input, output) {
  if (typeof window === "undefined") return;
  const entries = getAll();
  const entry = {
    id: Date.now().toString(),
    type,
    input,
    output,
    timestamp: new Date().toISOString(),
    preview: output.slice(0, 120) + "...",
  };
  entries.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, 100)));
  return entry;
}

export function getAll() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch { return []; }
}

export function getByType(type) {
  return getAll().filter((e) => e.type === type);
}

export function deleteEntry(id) {
  const entries = getAll().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function clearAll() {
  localStorage.removeItem(KEY);
}

export function searchEntries(query) {
  const q = query.toLowerCase();
  return getAll().filter(
    (e) => e.input.toLowerCase().includes(q) || e.output.toLowerCase().includes(q) || e.type.toLowerCase().includes(q)
  );
}

export const TYPE_LABELS = {
  strategy: "⚡ Strategy",
  multiagent: "🤖 Multi-Agent",
  impact: "📊 Impact",
  policy: "📝 Policy",
  research: "🔬 Research",
  carbon: "🌡️ Carbon",
  biodiversity: "🌿 Biodiversity",
  stakeholders: "👥 Stakeholders",
  risk: "⚠️ Risk",
  grant: "💰 Grant",
  compliance: "✅ Compliance",
  crisis: "🚨 Crisis",
  roadmap: "🗺️ Roadmap",
  innovation: "💡 Innovation",
  budget: "💵 Budget",
  kpi: "📈 KPIs",
};
