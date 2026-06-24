const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function post(endpoint, body) {
  const r = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || `API error ${r.status}`);
  }
  return r.json();
}

async function get(endpoint) {
  const r = await fetch(`${BASE}${endpoint}`);
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json();
}

export const api = {
  health: () => get("/health"),
  strategy: (d) => post("/api/strategy", d),
  multiAgent: (d) => post("/api/strategy/multiagent", d),
  impact: (d) => post("/api/impact", d),
  policy: (d) => post("/api/policy", d),
  research: (d) => post("/api/research", d),
  carbon: (d) => post("/api/carbon", d),
  biodiversity: (d) => post("/api/biodiversity", d),
  stakeholders: (d) => post("/api/stakeholders", d),
  risk: (d) => post("/api/risk", d),
  grant: (d) => post("/api/grant", d),
  compliance: (d) => post("/api/compliance", d),
  crisis: (d) => post("/api/crisis", d),
  roadmap: (d) => post("/api/roadmap", d),
  chat: (d) => post("/api/chat", d),
  compare: (d) => post("/api/compare", d),
  summary: (d) => post("/api/summary", d),
  kpi: (d) => post("/api/kpi", d),
  innovation: (d) => post("/api/innovation", d),
  budget: (d) => post("/api/budget", d),
  aqi: () => get("/api/monitor/aqi"),
  climate: (lat, lon, city) => get(`/api/monitor/climate?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}`),
  species: (taxon) => get(`/api/monitor/species?taxon=${encodeURIComponent(taxon || "Aves")}`),
  worldbank: (indicator) => get(`/api/monitor/worldbank?indicator=${indicator}`),
};
