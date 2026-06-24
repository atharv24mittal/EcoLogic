from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import httpx, os, asyncio
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="EcoIntelligence API", version="1.0.0", description="AI-powered ecological strategy platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

def ai_call(system: str, user: str, max_tokens: int = 2000, temp: float = 0.7) -> str:
    try:
        r = groq_client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
            max_tokens=max_tokens, temperature=temp,
        )
        return r.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

# ── REQUEST MODELS ─────────────────────────────────────────────────────────────
class StrategyReq(BaseModel):
    problem: str
    domain: str = "Biodiversity"
    region: str = "Rural"
    urgency: str = "Strategic"
    language: str = "English"

class MultiAgentReq(BaseModel):
    problem: str
    domain: str = "Biodiversity"

class ImpactReq(BaseModel):
    intervention: str
    scale: str = "Local"
    timeframe: str = "3 years"
    goal: str = "Carbon Sequestration"

class PolicyReq(BaseModel):
    issue: str
    region: str = "India"
    stakeholders: str = "Government, NGOs, Communities"
    policy_type: str = "Regulation"

class ResearchReq(BaseModel):
    topic: str
    goal: str = "Full Synthesis"
    context: str = "India / South Asia"

class CarbonReq(BaseModel):
    activities: str
    sector: str = "Agriculture"
    region: str = "India"

class BiodiversityReq(BaseModel):
    ecosystem: str
    threats: str
    location: str = "India"

class StakeholderReq(BaseModel):
    project: str
    region: str = "India"

class RiskReq(BaseModel):
    project: str
    context: str = "India"

class GrantReq(BaseModel):
    project: str
    organization: str
    budget: str = "50 lakh INR"

class ComplianceReq(BaseModel):
    activity: str
    location: str = "India"

class CrisisReq(BaseModel):
    crisis: str
    location: str
    severity: str = "High"

class RoadmapReq(BaseModel):
    goal: str
    organization: str
    years: int = 10

class ChatReq(BaseModel):
    message: str
    history: List[dict] = []

class CompareReq(BaseModel):
    strategy_a: str
    strategy_b: str
    context: str = "ecological impact"

class SummaryReq(BaseModel):
    content: str
    audience: str = "Government officials"

class KPIReq(BaseModel):
    project: str
    goals: str
    timeframe: str = "3 years"

class InnovationReq(BaseModel):
    problem: str
    constraints: str = "Low budget, rural context"

class BudgetReq(BaseModel):
    project: str
    scale: str = "District"
    duration: str = "3 years"

# ── AI ENDPOINTS ────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL, "version": "1.0.0"}

@app.post("/api/strategy")
async def strategy(req: StrategyReq):
    hindi_note = "\n\nAlso provide a brief 2-sentence summary in Hindi at the end under '## हिंदी सारांश'." if req.language == "Hindi" else ""
    sys = f"""You are EcoStrategy AI — a world-class ecological strategy expert at EcoIntelligence Platform by Ecologic.live.
Generate an expert, implementation-ready ecological strategy. Use these EXACT ## headings:
## Strategic Context
## Core Objectives
## AI-Recommended Interventions
## Implementation Timeline
## Success Metrics & KPIs
## Risk Assessment
## Quick Wins (0-30 days)

Rules: Be specific with numbers, percentages, costs in INR, timelines. Name specific AI techniques (RAG, computer vision, satellite ML, LSTM) and WHY they apply. Phase the timeline: 0-3mo, 3-12mo, 1-3yr. Give 6 specific KPIs with target values. India/South Asia context.{hindi_note}"""
    result = ai_call(sys, f"Problem: {req.problem}\nDomain: {req.domain} | Region: {req.region} | Urgency: {req.urgency}")
    return {"result": result, "tokens_used": len(result.split())}

@app.post("/api/strategy/multiagent")
async def multi_agent_strategy(req: MultiAgentReq):
    ecologist_sys = "You are Dr. Priya Sharma, a senior ecologist at WRI India with 20 years of field experience. Analyze this ecological problem and propose evidence-based interventions from a pure ecology science perspective. Be specific about species, habitats, ecological processes."
    policy_sys = "You are Arjun Mehta, a senior policy advisor at NITI Aayog specializing in environmental governance. Take the ecological analysis and propose a policy implementation framework with specific government schemes, legal instruments (EPA 1986, BD Act, Forest Act), and institutional mechanisms."
    critic_sys = "You are Dr. Sarah Chen, a global AI-in-ecology researcher at Oxford. Critically evaluate the ecological and policy proposals, identify weaknesses, and synthesize the best elements into a final integrated AI-powered strategy. Recommend specific ML/AI tools for each intervention."

    p = req.problem
    eco_analysis = ai_call(ecologist_sys, f"Ecological problem: {p}\nDomain: {req.domain}", 800)
    policy_framework = ai_call(policy_sys, f"Problem: {p}\nEcological analysis:\n{eco_analysis}", 800)
    final = ai_call(critic_sys, f"Problem: {p}\n\nEcologist's view:\n{eco_analysis}\n\nPolicy advisor's view:\n{policy_framework}\n\nSynthesize into final strategy with ## headings: ## Synthesis | ## Final Strategy | ## AI Implementation Plan | ## 90-Day Action Plan", 1000)
    return {"ecologist": eco_analysis, "policy_advisor": policy_framework, "final_synthesis": final}

@app.post("/api/impact")
async def impact(req: ImpactReq):
    sys = """You are EcoImpact AI — quantitative environmental impact analyst at EcoIntelligence.
Use EXACT ## headings:
## Impact Summary (2-3 sentence overview with overall score /100)
## Environmental Impact (specific: tonnes CO2, ha restored, species protected, water quality %)
## Social Impact (people benefited, livelihoods, health outcomes, gender impact)
## Economic Impact (cost-benefit ratio, jobs, INR savings, ecosystem service value)
## SDG Alignment (list specific SDGs: 13, 15, 6, etc. with how this project advances them)
## Timeline to Impact (when each impact materializes: immediate/1yr/5yr)
## Confidence Level (High/Medium/Low for each metric with justification)
Always use specific numbers. India context."""
    result = ai_call(sys, f"Intervention: {req.intervention}\nScale: {req.scale} | Timeframe: {req.timeframe} | Goal: {req.goal}")
    return {"result": result}

@app.post("/api/policy")
async def policy(req: PolicyReq):
    sys = """You are EcoPolicy AI — expert environmental policy drafter for Indian government contexts.
Draft a complete, ministry-ready policy document. Use ## headings:
## Executive Summary
## Background & Problem Analysis
## Legal & Regulatory Context (cite actual Indian laws: EPA 1986, BD Act 2002, Water Act 1974, Air Act 1981, Forest Conservation Act 1980, WPA 1972)
## Policy Objectives (SMART: Specific, Measurable, Achievable, Relevant, Time-bound)
## Recommended Policy Interventions (4+ numbered, with lead agency, budget in INR crore, timeline)
## Implementation Framework (roles: MoEFCC, State PCB, District Admin, NGOs)
## Monitoring & Evaluation Plan (5 KPIs, reporting frequency, oversight body)
## Budget Allocation (total estimated cost in INR crore, breakdown)
## Conclusion & Recommendations"""
    result = ai_call(sys, f"Issue: {req.issue}\nRegion: {req.region} | Stakeholders: {req.stakeholders} | Type: {req.policy_type}", 2000)
    return {"result": result}

@app.post("/api/research")
async def research(req: ResearchReq):
    sys = """You are EcoResearch AI — research director at EcoIntelligence Platform.
Synthesize ecological knowledge and identify AI research opportunities. Use ## headings:
## Current State of Knowledge (what is known, established science)
## Key Research Findings (5-7 significant findings with context)
## Critical Knowledge Gaps (4+ gaps specific to India/South Asia)
## AI & ML Approaches (SPECIFIC techniques: CNN for remote sensing, BERT for literature NLP, LSTM for climate time-series, Random Forest for species distribution, GAN for scenario modeling — explain WHY each applies)
## Recommended Data Sources (ISRO Bhuvan, FSI, MoEFCC, GBIF, NASA Earthdata, WRI India, IUCN — with specific datasets)
## Priority Research Questions (5 high-impact questions)
## Methodology Recommendations (study design, tools, statistical approaches)"""
    result = ai_call(sys, f"Topic: {req.topic}\nGoal: {req.goal} | Context: {req.context}", 2000)
    return {"result": result}

@app.post("/api/carbon")
async def carbon(req: CarbonReq):
    sys = """You are a carbon accounting expert. Calculate and analyze carbon footprint.
Use ## headings:
## Carbon Assessment Summary (total estimated tCO2e/year with confidence range)
## Emission Sources Breakdown (% by category with tonnes CO2e)
## Benchmark Comparison (vs national average, vs global average, vs sectoral best practice)
## AI-Powered Reduction Strategy (specific interventions with % reduction potential)
## Carbon Credit Opportunities (REDD+, Gold Standard, VCS mechanisms applicable)
## 5-Year Reduction Roadmap (with milestones and projected tCO2e saved)
## Cost of Carbon Action (INR investment vs carbon value generated)"""
    result = ai_call(sys, f"Activities: {req.activities}\nSector: {req.sector} | Region: {req.region}")
    return {"result": result}

@app.post("/api/biodiversity")
async def biodiversity(req: BiodiversityReq):
    sys = """You are a conservation biologist. Assess biodiversity risk and recommend interventions.
Use ## headings:
## Biodiversity Risk Score (/100, with breakdown)
## Ecosystem Assessment (health indicators, key species, ecological functions)
## Threat Analysis (rank threats by severity: habitat loss, invasives, climate, pollution, overexploitation)
## Species at Risk (IUCN categories, endemic species, flagship/umbrella/keystone species)
## AI-Powered Conservation Interventions (with specific ML tools: acoustic monitoring, camera trap AI, eDNA analysis, satellite change detection)
## Restoration Priority Areas (with area in ha and biodiversity value)
## Success Indicators (measurable biodiversity KPIs)"""
    result = ai_call(sys, f"Ecosystem: {req.ecosystem}\nThreats: {req.threats} | Location: {req.location}")
    return {"result": result}

@app.post("/api/stakeholders")
async def stakeholders(req: StakeholderReq):
    sys = """You are a stakeholder engagement expert. Create a comprehensive stakeholder analysis.
Use ## headings:
## Stakeholder Map (categorize: government/civil society/private/community/international)
## Power-Interest Matrix (high power-high interest, etc. for each stakeholder)
## Key Stakeholders Deep-Dive (top 5: role, interests, concerns, engagement strategy)
## Conflict Points (where stakeholder interests clash and how to navigate)
## Engagement Strategy (specific communication channels, frequency, format for each group)
## Coalition Building (which stakeholders to ally, who are likely champions)
## Resistance Management (who might oppose and counter-strategies)"""
    result = ai_call(sys, f"Project: {req.project}\nRegion: {req.region}")
    return {"result": result}

@app.post("/api/risk")
async def risk(req: RiskReq):
    sys = """You are an environmental risk analyst. Build a comprehensive risk matrix.
Format as ## headings:
## Risk Summary (overall risk level: High/Medium/Low)
## Risk Matrix Table (list each risk as: Risk | Likelihood (1-5) | Impact (1-5) | Score | Category)
## Top 5 Critical Risks (detailed analysis of highest-scoring risks)
## Mitigation Strategies (specific action for each top risk)
## Early Warning Indicators (what signals to monitor for each risk)
## Contingency Plans (if risks materialize)
## Residual Risk Assessment (after mitigation)"""
    result = ai_call(sys, f"Project: {req.project}\nContext: {req.context}")
    return {"result": result}

@app.post("/api/grant")
async def grant(req: GrantReq):
    sys = """You are an expert grant writer for environmental projects in India.
Write a compelling grant proposal. Use ## headings:
## Project Title & Tagline
## Executive Summary (250 words, compelling hook)
## Problem Statement (with data, statistics, urgency)
## Theory of Change (if X then Y, because Z logic chain)
## Project Objectives & Outcomes (SMART, with indicators)
## Methodology & Work Plan (phased activities with timeline)
## Team & Organizational Capacity
## Monitoring, Evaluation & Learning Framework
## Budget Justification (cost per beneficiary, value for money)
## Sustainability Plan (how it continues post-funding)
## Relevant Funding Sources (CAMPA, NMCG, GEF, GCF, CSR funds, bilateral donors)"""
    result = ai_call(sys, f"Project: {req.project}\nOrganization: {req.organization} | Budget: {req.budget}", 2000)
    return {"result": result}

@app.post("/api/compliance")
async def compliance(req: ComplianceReq):
    sys = """You are an environmental law expert specializing in Indian environmental regulations.
Use ## headings:
## Compliance Status Overview (which laws apply)
## Applicable Laws & Regulations (with specific sections: EPA 1986 S.7, EIA Notification 2006, CRZ 2019, etc.)
## Required Clearances & Permissions (list each with issuing authority, timeline, cost)
## Compliance Checklist (actionable items with responsible party)
## Common Violations to Avoid (red flags and penalties)
## Green Compliance Opportunities (go beyond compliance for ESG/CSR benefit)
## Timeline & Cost of Full Compliance (realistic estimate in INR and months)"""
    result = ai_call(sys, f"Activity: {req.activity}\nLocation: {req.location}")
    return {"result": result}

@app.post("/api/crisis")
async def crisis(req: CrisisReq):
    sys = """You are an ecological crisis response expert. Generate an immediate action plan.
Use ## headings:
## Crisis Assessment (severity, affected area, immediate risks)
## 24-Hour Emergency Actions (what to do RIGHT NOW)
## 72-Hour Response Plan (first responders, resources, coordination)
## 30-Day Stabilization Plan (halt damage, begin restoration)
## AI-Powered Monitoring (satellite, sensors, drones — specific tools)
## Stakeholder Alert Protocol (who to call, in what order, what to say)
## Resource Requirements (people, equipment, budget in INR)
## Long-term Recovery Roadmap (1 year rehabilitation plan)
## Lessons Learned Framework (prevent recurrence)"""
    result = ai_call(sys, f"Crisis: {req.crisis}\nLocation: {req.location} | Severity: {req.severity}", 2000)
    return {"result": result}

@app.post("/api/roadmap")
async def roadmap(req: RoadmapReq):
    sys = f"""You are a long-term ecological planning expert. Build a {req.years}-year strategic roadmap.
Use ## headings:
## Vision 2034 (where we want to be)
## Year 1-2: Foundation (quick wins, data collection, team building)
## Year 3-5: Scale (expand programs, partnerships, prove model)
## Year 6-{req.years}: Transform (systemic change, policy influence, replication)
## AI Integration Milestones (when to deploy which AI tools)
## Financial Roadmap (funding strategy, budget by phase)
## Key Partnerships to Build (government, academia, private sector, international)
## Success Metrics by Year (measurable annual targets)
## Risk Scenarios & Pivots (what if plans for major risks)
## Legacy & Institutional Impact"""
    result = ai_call(sys, f"Goal: {req.goal}\nOrganization: {req.organization}", 2000)
    return {"result": result}

@app.post("/api/chat")
async def chat(req: ChatReq):
    sys = """You are EcoBot — the intelligent AI assistant of EcoIntelligence Platform by Ecologic.live.
You are an expert in: ecology, biodiversity, climate change, environmental policy (especially India), AI in environment, sustainability, conservation.
Be conversational but expert. Give specific, actionable answers. Reference real data, laws, organizations.
Keep responses concise (150-250 words) but substantive. Use bullet points sparingly — prefer natural prose.
If asked about numbers, give real figures. If asked about India specifically, reference MoEFCC, CPCB, FSI, WII, GBIF India, etc."""
    messages = [{"role": "system", "content": sys}]
    for h in req.history[-10:]:
        messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
    messages.append({"role": "user", "content": req.message})
    r = groq_client.chat.completions.create(model=MODEL, messages=messages, max_tokens=500, temperature=0.8)
    return {"reply": r.choices[0].message.content}

@app.post("/api/compare")
async def compare(req: CompareReq):
    sys = """You are an expert strategy analyst. Compare two ecological strategies objectively.
Use ## headings:
## Comparison Summary (1 paragraph overview)
## Scoring Matrix
| Criteria | Strategy A | Strategy B | Winner |
|----------|-----------|-----------|--------|
| Scientific Rigor | /10 | /10 | |
| Implementation Feasibility | /10 | /10 | |
| Cost Effectiveness | /10 | /10 | |
| Speed to Impact | /10 | /10 | |
| Community Benefit | /10 | /10 | |
| AI/Tech Integration | /10 | /10 | |
| **Total** | **/60** | **/60** | |
## Strengths of A
## Strengths of B
## Weaknesses of A
## Weaknesses of B
## Recommendation (which to choose and why, or how to combine best elements)
## Hybrid Approach (if applicable: how to merge both strategies)"""
    result = ai_call(sys, f"Strategy A:\n{req.strategy_a}\n\nStrategy B:\n{req.strategy_b}\nContext: {req.context}", 1500)
    return {"result": result}

@app.post("/api/summary")
async def summary(req: SummaryReq):
    sys = f"""You are an expert science communicator. Create an executive summary for {req.audience}.
Use ## headings:
## The Problem (2 sentences, powerful opening)
## What We Did (2 sentences, clear action)
## Key Findings (5 bullet points, data-driven)
## Recommended Actions (3 priority actions with owner and deadline)
## Expected Impact (quantified: X tonnes CO2, Y species, Z people)
## Call to Action (compelling closing statement)
Keep total length under 400 words. Use accessible language for {req.audience}."""
    result = ai_call(sys, f"Content to summarize:\n{req.content}")
    return {"result": result}

@app.post("/api/kpi")
async def kpi(req: KPIReq):
    sys = """You are a performance management expert for ecological programs.
Create a comprehensive KPI framework. Use ## headings:
## KPI Framework Overview
## Tier 1: Impact KPIs (long-term outcomes, 3-5 KPIs)
## Tier 2: Output KPIs (direct deliverables, 5-8 KPIs)
## Tier 3: Process KPIs (operational efficiency, 3-5 KPIs)
## Data Collection Plan (who collects, how, frequency, tool)
## Baseline Data Requirements (what to measure before starting)
## Reporting Dashboard Specs (what charts/visualizations to build)
## Review Cadence (daily/weekly/monthly/quarterly/annual review structure)
For each KPI: Name | Baseline | Target | Unit | Data Source | Frequency | Responsible"""
    result = ai_call(sys, f"Project: {req.project}\nGoals: {req.goals} | Timeframe: {req.timeframe}")
    return {"result": result}

@app.post("/api/innovation")
async def innovation(req: InnovationReq):
    sys = """You are an eco-innovation expert combining ecology, AI, and social innovation.
Use ## headings:
## Innovation Opportunity Assessment
## 10 Innovative Solutions (range from low-tech to high-tech, community to government scale)
## Top 3 Deep Dives (feasibility, cost, impact, novelty score for each)
## AI/Tech Enablers (specific tools: computer vision, IoT sensors, blockchain, ML, drones)
## Business/Funding Model (how to make it sustainable)
## Pilot Design (how to test the best idea in 90 days)
## Scale-up Pathway (from pilot to national scale)
## Comparable Global Examples (similar innovations that worked)"""
    result = ai_call(sys, f"Problem: {req.problem}\nConstraints: {req.constraints}")
    return {"result": result}

@app.post("/api/budget")
async def budget(req: BudgetReq):
    sys = """You are an environmental project finance expert in India.
Use ## headings:
## Budget Overview (total in INR, USD equivalent)
## Cost Breakdown by Category
| Category | Year 1 | Year 2 | Year 3 | Total | % |
|----------|--------|--------|--------|-------|---|
| Human Resources | | | | | |
| Equipment & Technology | | | | | |
| Field Operations | | | | | |
| Community Engagement | | | | | |
| AI & Data Systems | | | | | |
| M&E | | | | | |
| Overheads (15%) | | | | | |
## Cost per Beneficiary (INR)
## Value for Money Analysis
## Funding Sources (CSR, CAMPA, grants, government schemes with URLs)
## Cost Optimization Tips (where to save without compromising quality)"""
    result = ai_call(sys, f"Project: {req.project}\nScale: {req.scale} | Duration: {req.duration}")
    return {"result": result}

# ── DATA ENDPOINTS ──────────────────────────────────────────────────────────────
@app.get("/api/monitor/aqi")
async def aqi_data():
    cities = ["Delhi","Mumbai","Kolkata","Chennai","Bengaluru","Hyderabad","Pune","Ahmedabad","Patna","Lucknow","Kanpur","Varanasi","Jaipur","Surat","Agra"]
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            r = await client.get("https://api.openaq.org/v3/locations?limit=50&country=IN&order_by=city", headers={"X-API-Key": ""})
            if r.status_code == 200:
                data = r.json()
                results = []
                for loc in data.get("results", [])[:15]:
                    results.append({
                        "city": loc.get("city", "Unknown"),
                        "name": loc.get("name", ""),
                        "aqi": loc.get("lastValue", 0),
                        "lat": loc.get("coordinates", {}).get("latitude", 0),
                        "lon": loc.get("coordinates", {}).get("longitude", 0),
                    })
                return {"cities": results, "source": "OpenAQ"}
    except:
        pass
    import random
    mock = []
    aqi_levels = [45,89,156,234,312,67,178,92,267,134,89,345,56,223,167]
    for i, city in enumerate(cities):
        aqi = aqi_levels[i % len(aqi_levels)]
        mock.append({"city": city, "aqi": aqi, "category": ("Good" if aqi<50 else "Moderate" if aqi<100 else "Unhealthy" if aqi<200 else "Very Unhealthy" if aqi<300 else "Hazardous")})
    return {"cities": mock, "source": "Simulated (OpenAQ unavailable)"}

@app.get("/api/monitor/climate")
async def climate_data(lat: float = 28.6, lon: float = 77.2, city: str = "Delhi"):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata&forecast_days=7")
            if r.status_code == 200:
                d = r.json()
                return {"city": city, "current": d.get("current", {}), "daily": d.get("daily", {}), "source": "Open-Meteo"}
    except:
        pass
    return {"city": city, "current": {"temperature_2m": 32.4, "relative_humidity_2m": 65, "wind_speed_10m": 12.3, "precipitation": 0}, "source": "Fallback"}

@app.get("/api/monitor/species")
async def species_data(taxon: str = "Aves", country: str = "IN", limit: int = 20):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(f"https://api.gbif.org/v1/occurrence/search?country={country}&taxonKey=212&limit={limit}&hasCoordinate=true")
            if r.status_code == 200:
                d = r.json()
                results = []
                for item in d.get("results", []):
                    results.append({
                        "species": item.get("species", "Unknown"),
                        "family": item.get("family", ""),
                        "lat": item.get("decimalLatitude"),
                        "lon": item.get("decimalLongitude"),
                        "date": item.get("eventDate", ""),
                        "state": item.get("stateProvince", ""),
                        "status": item.get("iucnRedListCategory", "Unknown"),
                    })
                return {"occurrences": results, "total": d.get("count", 0), "source": "GBIF"}
    except:
        pass
    return {"occurrences": [
        {"species": "Panthera tigris", "family": "Felidae", "state": "Madhya Pradesh", "status": "EN"},
        {"species": "Elephas maximus", "family": "Elephantidae", "state": "Karnataka", "status": "EN"},
        {"species": "Rhinoceros unicornis", "family": "Rhinocerotidae", "state": "Assam", "status": "VU"},
        {"species": "Gavialis gangeticus", "family": "Gavialidae", "state": "Uttar Pradesh", "status": "CR"},
        {"species": "Vulpes bengalensis", "family": "Canidae", "state": "Rajasthan", "status": "LC"},
    ], "total": 5, "source": "Fallback data"}

@app.get("/api/monitor/worldbank")
async def worldbank_data(indicator: str = "EN.ATM.CO2E.PC", country: str = "IN"):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(f"https://api.worldbank.org/v2/country/{country}/indicator/{indicator}?format=json&mrv=10&per_page=10")
            if r.status_code == 200:
                d = r.json()
                if len(d) > 1:
                    return {"data": d[1], "indicator": indicator, "country": country, "source": "World Bank"}
    except:
        pass
    return {"data": [], "source": "Fallback"}
