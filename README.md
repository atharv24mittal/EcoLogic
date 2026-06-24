# 🌿 EcoIntelligence Platform

> An AI-powered ecological strategy platform built during a 2-month internship at [Ecologic.live](https://ecologic.live) as an AI Researcher.

## 🚀 Live Demo
- **Frontend (Vercel):** `https://ecologic-chi.vercel.app`
- **Backend (Render):** `https://ecologic-re5g.onrender.com/docs`

## 🔥 52 Features

### AI-Powered Tools (20)
1. Ecological Strategy Generator (domain/region/urgency)
2. Multi-Agent Strategy — 3 AI agents debate & synthesize
3. Ecological Impact Estimator (env/social/economic)
4. Policy Document Drafter (regulation/incentive/framework)
5. Research Literature Synthesizer
6. Carbon Footprint Calculator + AI action plan
7. Biodiversity Risk Assessor with scores
8. Climate Vulnerability Analyzer
9. Stakeholder Mapper with influence matrix
10. Risk Matrix Generator
11. Grant Writing Assistant for eco projects
12. Environmental Compliance Checker (India laws)
13. Crisis Response Planner
14. 10-Year Ecological Roadmap Builder
15. EcoBot — context-aware AI chatbot
16. Strategy Comparison Engine (A vs B)
17. Executive Summary Generator
18. KPI & Metrics Dashboard Generator
19. Eco-Innovation Ideator
20. Budget Estimator for ecological projects

### Real-Time Environmental Data (10)
21. Live Air Quality Index — 15 Indian cities (OpenAQ)
22. Real-Time Climate Data — temperature, humidity, wind (Open-Meteo)
23. Species Occurrence Tracker (GBIF API)
24. CO2 Concentration Levels
25. Pollution Trend Charts (7-day/30-day)
26. Extreme Weather Alerts
27. Biodiversity Hotspot Data
28. Forest Cover Statistics
29. Ecosystem Health Scores
30. Water Stress Indicators (World Bank)

### Planning & Strategy Tools (10)
31. Project Timeline Generator
32. KPI Tracker with progress visualization
33. Intervention Template Library (20+ templates)
34. Policy Gap Analysis Tool
35. NGO Resource Directory
36. Implementation Checklist Generator
37. Stakeholder Engagement Planner
38. Monitoring & Evaluation Framework Builder
39. Environmental Impact Assessment (EIA) Guide
40. Ecosystem Services Valuation Tool

### Platform & UX Features (12)
41. Dark/Light Mode Toggle
42. Fully Mobile Responsive
43. Strategy History (localStorage, persistent)
44. Full-text Search Across History
45. Print & PDF Export
46. Copy to Clipboard (one-click)
47. Share Strategy via URL
48. Language Toggle (English / Hindi)
49. Keyboard Shortcuts
50. Toast Notification System
51. API Health Status Monitor
52. Onboarding Walkthrough

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | FastAPI (Python) |
| AI Engine | Groq API — Llama 3.3 70B (Free) |
| Air Quality | OpenAQ API (Free, no key) |
| Climate Data | Open-Meteo API (Free, no key) |
| Biodiversity | GBIF API (Free, no key) |
| Deployment (FE) | Vercel |
| Deployment (BE) | Render |

## ⚡ Quick Start

### 1. Get a Free Groq API Key
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free, no credit card)
3. Create API key

### 2. Backend Setup (Render)
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add GROQ_API_KEY to .env
uvicorn main:app --reload
```

### 3. Frontend Setup (Vercel)
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL
npm run dev
```

### 4. Deploy
1. Push to GitHub
2. Connect `frontend/` to Vercel → auto-deploys
3. Connect `backend/` to Render → set env vars → deploys

## 📁 Project Structure
```
EcoIntelligence/
├── backend/          → FastAPI on Render
│   ├── main.py       → All 23 API endpoints
│   └── requirements.txt
└── frontend/         → Next.js on Vercel
    └── src/
        ├── app/      → 10 pages
        ├── components/
        └── lib/
```

## 🔑 Environment Variables

**Backend (.env)**
```
GROQ_API_KEY=your_groq_key_here
CORS_ORIGINS=https://your-app.vercel.app
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

---
Built with ❤️ during AI Researcher Internship @ Ecologic.live
