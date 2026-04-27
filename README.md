# 🇮🇳 TaxBot India — AI-Powered Indian Tax Assistant

A full-stack chatbot web app that answers Indian tax questions, calculates income tax, and provides a deductions guide. Built with React, Node.js/Express, and powered by Groq AI.

---

## 📁 Project Structure

```
taxbot-india/
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json
│   └── .env.example       # Environment variables template
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.jsx                        # Root component
    │   ├── App.css
    │   ├── index.js                       # React entry
    │   ├── index.css                      # Global styles + CSS variables
    │   ├── components/
    │   │   ├── Sidebar.jsx / .css         # Left navigation panel
    │   │   ├── Header.jsx / .css          # Top bar with tabs
    │   │   ├── ChatPanel.jsx / .css       # Main chat interface
    │   │   ├── TaxCalculator.jsx / .css   # Income tax calculator
    │   │   ├── DeductionsGuide.jsx / .css # Deductions reference
    │   │   └── MobileNav.jsx / .css       # Bottom nav (mobile)
    │   └── hooks/
    │       ├── useChat.js                 # Chat state + API calls
    │       └── useTaxCalculator.js        # Tax calculation logic
    └── package.json
```

---

## ✨ Features

- **AI Tax Chatbot** — Answers only tax-related questions (rejects unrelated queries)
- **Indian Tax Context** — FY 2024-25, both New and Old regime support
- **Income Tax Calculator** — Full slab calculation, surcharge, cess, rebates
- **Deductions Guide** — Interactive expandable cards for all major deductions
- **Dark Glassmorphism UI** — Premium dark theme with smooth animations
- **Chat History** — Maintained during session, clearable
- **Typing Indicator** — Animated typing dots while AI responds
- **Responsive Design** — Works on desktop and mobile
- **Rate Limiting** — 30 requests/minute per IP
- **Security** — Helmet, CORS, input validation

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ (check: `node --version`)
- **npm** v9+ (check: `npm --version`)
- **Groq API Key** — Get one at [console.groq.com](https://console.groq.com)

---

### Step 1: Clone / Download

```bash
# If using git
git clone <your-repo-url>
cd taxbot-india

# Or just navigate to your downloaded folder
cd taxbot-india
```

---

### Step 2: Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your API key
# On Linux/Mac:
nano .env
# On Windows:
notepad .env
```

Your `.env` file should look like:
```env
GROQ_API_KEY=gsk-your-key-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
# Start the backend server
npm run dev
# You should see: 🚀 TaxBot India Backend running on http://localhost:5000
```

---

### Step 3: Set Up Frontend

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the React dev server
npm start
# Browser opens automatically at http://localhost:3000
```

---

### Step 4: Use the App

1. Open **http://localhost:3000** in your browser
2. The frontend connects to the backend via the `proxy` setting in `package.json`
3. Ask any Indian tax question in the chat!

---

## 🔧 Configuration

### Backend Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | — | Your Groq API key |
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `FRONTEND_URL` | No | `http://localhost:3000` | Allowed CORS origin |

### Frontend API URL

The frontend uses the React `proxy` setting in `package.json` for development:
```json
"proxy": "http://localhost:5000"
```

For production, set the environment variable:
```bash
REACT_APP_API_URL=https://your-backend-url.com
```

---

## 🏗️ Building for Production

### Backend
```bash
cd backend
NODE_ENV=production node server.js
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/build/ — deploy to any static host (Vercel, Netlify, S3)
```

---

## 📦 Deployment Options

### Option 1: Vercel + Railway

**Frontend → Vercel:**
```bash
cd frontend
npm install -g vercel
vercel
# Set REACT_APP_API_URL to your Railway backend URL
```

**Backend → Railway:**
- Push backend folder to GitHub
- Connect to Railway, add env variables
- Railway auto-detects Node.js

### Option 2: Single Server (VPS)

```bash
# Build frontend
cd frontend && npm run build

# Serve static files from backend
# Add to server.js:
# app.use(express.static(path.join(__dirname, '../frontend/build')));
```

---

## 🧠 AI System Prompt

The chatbot uses this strict system prompt:

```
You are a professional Tax Assistant chatbot specializing in the Indian tax system.
- ONLY answer: TAX, INCOME TAX, FINANCE, ITR, GST, TDS, deductions, tax planning
- Reject unrelated questions: "I only assist with tax-related queries."
- Reference: Income Tax Act 1961, FY 2024-25 (AY 2025-26)
- Use ₹ symbol, proper section references, form names
```

---

## 🧮 Tax Calculator Features

- **New Regime slabs** (FY 2024-25): 0/5/10/15/20/30%
- **Old Regime slabs** with age-based exemptions
- **Rebate u/s 87A**: ₹7L (new), ₹5L (old)
- **Standard deduction**: ₹75,000 (new), ₹50,000 (old)
- **Surcharge calculation** for income above ₹50L
- **4% Health & Education Cess**
- **Full deduction breakdown** (80C, 80D, HRA, NPS, 80E, 80G)

---

## 🔐 Security Features

- **Helmet.js** — Security headers
- **CORS** — Restricted to frontend origin
- **Rate limiting** — 30 req/min per IP
- **Input validation** — Message length, format checks
- **No API key exposure** — Key stays server-side only

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `Cannot connect to API` | Make sure backend is running on port 5000 |
| `API key invalid` | Check `.env` file has correct `GROQ_API_KEY` |
| `CORS error` | Ensure `FRONTEND_URL` in `.env` matches your frontend URL |
| `Module not found` | Run `npm install` in both `backend/` and `frontend/` |
| Chat shows error message | Check backend terminal for detailed error logs |

---

## 📄 License

MIT License — Free to use and modify.

---

## ⚠️ Disclaimer

This chatbot provides general tax guidance based on publicly available information. It is NOT a substitute for professional CA/tax advisor advice. Always consult a qualified Chartered Accountant for actual tax filing.
