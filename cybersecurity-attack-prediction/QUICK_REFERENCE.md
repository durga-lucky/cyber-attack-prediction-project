# 🚀 QUICK REFERENCE - Get Running in 5 Minutes

## Copy-Paste Commands

### Step 1: Initial Setup (One-Time Only)
```bash
# Navigate to project
cd /Users/pranav/Desktop/Pranav/abc/full-stack-ml-projects/cybersecurity-attack-prediction

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Back to root
cd ..

# Setup frontend
npm install
```

### Step 2: Start Services (Every Time)

**TERMINAL 1 - Backend**
```bash
cd backend
source venv/bin/activate
python3 main.py
# Should show: "Server running on http://localhost:8000"
```

**TERMINAL 2 - Frontend**
```bash
npm run dev
# Should show: "✓ Ready in XXXms"
```

**TERMINAL 3 - MongoDB** (If needed)
```bash
brew services start mongodb-community
# Or: docker run -d -p 27017:27017 mongo
# Or just: mongosh
```

---

## Access URLs

| What | URL | Notes |
|------|-----|-------|
| Frontend | http://localhost:3000 | Register first, then login |
| Prediction Page | http://localhost:3000/predict | Main feature |
| Dashboard | http://localhost:3000/dashboard | View analytics |
| Backend API | http://localhost:8000 | For API testing |

---

## Test the System

### 1. Register
```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@test.com","password":"demo123"}'
```

### 2. Make Prediction
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "email":"demo@test.com",
    "sourceIp":"192.168.1.100",
    "destIp":"10.0.0.1",
    "protocol":"tcp",
    "packetSize":"1500",
    "requestRate":"50"
  }'
```

### Expected Output
```json
{
  "prediction": "Attack",
  "confidence": 85,
  "riskLevel": "High",
  "genaiPrediction": {...},
  "mlPrediction": {...}
}
```

---

## Troubleshooting Quick Fixes

| Error | Fix |
|-------|-----|
| `ModuleNotFoundError` | `source venv/bin/activate` |
| Port 8000 in use | `lsof -i :8000` then `kill -9 <PID>` |
| MongoDB error | `brew services start mongodb-community` |
| Dependencies error | `pip install -r requirements.txt` |

---

## File Structure Quick Look

```
📁 cybersecurity-attack-prediction/
├── 📱 app/
│   ├── page.tsx (Home)
│   ├── predict/page.tsx ⭐ (Main Feature)
│   ├── dashboard/page.tsx
│   └── login/page.tsx
├── 🔧 backend/
│   ├── main.py ⭐ (Flask API)
│   ├── requirements.txt ✅ (Fixed)
│   ├── venv/ (Virtual Environment)
│   ├── models/ (ML Models)
│   └── src/ (Training Scripts)
├── 📚 README.md (Full Docs)
├── ⚡ QUICK_START.md (Setup Guide)
└── 📋 FIX_SUMMARY.md (What Was Fixed)
```

---

## What Each Service Does

### Frontend (Next.js on Port 3000)
- User interface
- Login/Register pages
- Prediction form input
- Results display (ML + GenAI)
- Dashboard analytics

### Backend (Flask on Port 8000)
- API endpoints
- User authentication
- ML model predictions
- GenAI API integration
- MongoDB database connection

### MongoDB (Port 27017)
- Stores user accounts
- Stores prediction history
- Stores analytics data

---

## Demo Test Cases

### Test 1: Safe Traffic
```bash
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","sourceIp":"192.168.1.1","destIp":"8.8.8.8","protocol":"tcp","packetSize":"100","requestRate":"5"}'
```
**Result**: 🟢 Normal

### Test 2: DDoS Attack  
```bash
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","sourceIp":"10.0.0.1","destIp":"172.16.0.1","protocol":"tcp","packetSize":"1500","requestRate":"800"}'
```
**Result**: 🔴 Attack

### Test 3: Port Scan
```bash
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","sourceIp":"192.168.1.200","destIp":"10.0.0.50","protocol":"icmp","packetSize":"64","requestRate":"100"}'
```
**Result**: 🟡 Suspicious

---

## Key Features

✅ **Dual AI Models**
- ML: Random Forest (traditional ML)
- GenAI: GPT-3.5 via OpenRouter (contextual analysis)

✅ **Risk Scoring**
- 0-25: 🟢 Low
- 26-50: 🟡 Medium  
- 51-75: 🟠 High
- 76-100: 🔴 Critical

✅ **Fallback System**
- Works without GenAI API
- Uses ML as backup
- No single point of failure

✅ **Full Persistence**
- Saves all predictions
- Tracks user history
- Analytics dashboard

---

## Important Environment Variables

### Backend (`backend/.env`)
```
OPENROUTER_API_KEY=your_key  # Optional, GenAI works without it
MONGODB_URI=mongodb://localhost:27017/cybersecurity_app
FLASK_DEBUG=True
PORT=8000
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Verify Everything Works

```bash
# Check backend is up
curl http://localhost:8000/dashboard/stats

# Check frontend is up  
curl http://localhost:3000 | grep -q "html" && echo "✅ Frontend OK"

# Check MongoDB
mongosh --eval "db.adminCommand('ping')"
```

---

## That's It! 🎉

You now have a fully functional cybersecurity attack prediction system with:
- ✅ Dual AI/ML predictions
- ✅ Real-time threat detection
- ✅ User authentication
- ✅ Persistent storage
- ✅ Analytics dashboard
- ✅ Production-ready code

**Status**: ✅ Ready for Demo

Questions? See:
- [README.md](./README.md)
- [QUICK_START.md](./QUICK_START.md)
- [FIX_SUMMARY.md](./FIX_SUMMARY.md)
