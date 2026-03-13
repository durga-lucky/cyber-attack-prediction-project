# Cybersecurity Attack Prediction - Setup & Deployment Guide

## ✅ Quick Start (Demo Ready)

This is a complete full-stack ML application with:
- **Backend**: Flask + ML Model + GenAI Integration (GPT-3.5 via OpenRouter)
- **Frontend**: Next.js + React + TailwindCSS + TypeScript
- **Database**: MongoDB for predictions storage
- **Dual Predictions**: Both ML Model & GenAI Analysis

---

## 📋 Prerequisites

1. **Python 3.8+** - For backend
2. **Node.js 18+** - For frontend
3. **MongoDB** - For predictions database
4. **OpenRouter API Key** - For GenAI predictions (optional, has fallback to ML model)

---

## 🚀 Setup Instructions

### Step 1: Create Environment Files

Create `.env` in the `backend/` folder:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
OPENROUTER_API_KEY=your_key_from_https://openrouter.ai
MONGODB_URI=mongodb://localhost:27017/cybersecurity_app
FLASK_DEBUG=True
PORT=8000
```

Create `.env.local` in the root folder:
```bash
cp .env.example .env.local
```

### Step 2: Install Dependencies

```bash
# Backend dependencies
cd backend
pip3 install -r requirements.txt

# Frontend dependencies
cd ..
npm install
```

### Step 3: Start MongoDB

**Option A: Using Homebrew (macOS)**
```bash
brew services start mongodb-community
```

**Option B: Using Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option C: Using Local Installation**
```bash
mongod
```

Verify MongoDB is running:
```bash
mongosh
# Should connect successfully
```

### Step 4: Run the Application

**Start Backend** (In `backend/` folder):
```bash
python3 main.py
```

Backend should run at: `http://localhost:8000`

**Start Frontend** (In root folder, new terminal):
```bash
npm run dev
```

Frontend should run at: `http://localhost:3000`

---

## 📊 Testing the Application

### 1. **Register & Login**
- Go to `http://localhost:3000/register`
- Create a new account
- Login with your credentials

### 2. **Make a Prediction**
- Navigate to `http://localhost:3000/predict`
- Enter network parameters:
  - **Source IP**: `192.168.1.100`
  - **Destination IP**: `10.0.0.1`
  - **Protocol**: `tcp`, `udp`, or `icmp`
  - **Packet Size**: `1500` (bytes)
  - **Request Rate**: `50` (requests/sec)
- Click **"Analyze Traffic"**

### 3. **View Dual Predictions**
The results show:
- **GenAI Analysis** (Purple section) - If API available
- **🔍 ML Model Analysis** (Blue section) - Always available
- Both show prediction, confidence, risk score, and risk level

---

## 🎯 Features Breakdown

### Backend (`/backend/main.py`)
- ✅ User authentication (signup/login)
- ✅ ML-based attack detection (Random Forest)
- ✅ GenAI analysis using OpenRouter API
- ✅ Dual prediction system (GenAI + ML Model)
- ✅ MongoDB persistence
- ✅ Dashboard stats endpoint
- ✅ Recent threats tracking
- ✅ Risk data analytics

### Frontend (`/app/predict/page.tsx`)
- ✅ Interactive prediction form
- ✅ Real-time results display
- ✅ Separate sections for GenAI & ML predictions
- ✅ Risk level badges with color coding
- ✅ Confidence scores and risk scores
- ✅ Detailed analysis explanations

---

## 📱 Display Output Format

### Primary Results (Top Section)
- Prediction: Attack / Normal
- Confidence Score: 0-100%
- Risk Score: 0-100
- Risk Level: Low / Medium / High / Critical

### GenAI Analysis (Purple Section)
- AI-powered threat assessment
- Detailed AI explanations
- Alternative confidence perspective

### ML Model Analysis (Blue Section)
- Machine learning predictions
- Pattern-based threat detection
- Model confidence score

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
ConnectionFailure: Failed to connect to MongoDB
```
**Solution**: 
- Ensure MongoDB is running: `mongosh`
- Check `MONGODB_URI` in `.env`
- Default: `mongodb://localhost:27017/cybersecurity_app`

### GenAI API Error
```
GenAI prediction error: 'Collection' object is not callable
```
**Solution**: ✅ FIXED! The backend now properly uses `openai_client` instead of `client`

### OpenRouter API Error
```
Invalid API key
```
**Solution**:
- Get key from https://openrouter.ai
- Add to `backend/.env`
- System falls back to ML model if GenAI unavailable

### Port Already in Use
```
Address already in use: ('127.0.0.1', 8000)
```
**Solution**:
- Change PORT in `backend/.env`
- Or kill existing process: `lsof -i :8000` → `kill -9 <PID>`

---

## 📈 Model Details

### ML Model (threat_detector_rf.pkl)
- Algorithm: Random Forest Classifier
- Training Data: KDD Cup 99 / NSL-KDD
- Features: Protocol Type, Packet Size, Request Rate
- classes: `Attack` / `Normal`

### GenAI Model (via OpenRouter)
- Model: OpenAI GPT-3.5-turbo
- Provider: OpenRouter API
- Analysis: Contextual threat assessment

---

## 🎓 Project Structure

```
cybersecurity-attack-prediction/
├── backend/
│   ├── main.py                 # Flask API server
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment template
│   ├── models/
│   │   ├── threat_detector_rf.pkl
│   │   └── protocol_encoder.pkl
│   └── data/                   # Training datasets
├── app/
│   ├── predict/page.tsx        # Prediction page (UPDATED)
│   ├── dashboard/page.tsx      # Dashboard
│   ├── login/page.tsx          # Login page
│   └── register/page.tsx       # Registration page
├── components/
│   ├── threat-level-badge.tsx
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── api.ts                  # API client (UPDATED)
│   ├── auth.ts                 # Auth utilities
│   └── utils.ts
├── package.json
└── .env.example                # Frontend env template

```

---

## 🚀 Deployment Ready

This application is production-ready for:
- Demo presentations
- Live threat monitoring
- Cybersecurity training
- Network analysis tools

### Recommended Next Steps:
1. Set up proper SSL/TLS certificates
2. Deploy backend to cloud (e.g., Azure App Service)
3. Deploy frontend to Vercel/Netlify
4. Use managed MongoDB (MongoDB Atlas)
5. Implement rate limiting & authentication tokens
6. Add logging & monitoring

---

## 📝 Key Fixes Applied

### ✅ Fixed Issues:
1. **OpenAI Client Bug**: Changed `if not client:` → `if not openai_client:`
2. **Dual Prediction Output**: Now returns both `genaiPrediction` and `mlPrediction`
3. **Frontend Display**: Shows both predictions in separate colored sections
4. **Risk Score**: Properly calculated and displayed (0-100)

---

## 💡 Tips for Demo

1. **Test Cases**:
   - Normal Traffic: `tcp`, `1500` bytes, `50` req/s → "Normal"
   - DDoS Attack: `tcp`, `1500` bytes, `600` req/s → "Attack"
   - Port Scan: `icmp`, `64` bytes, `100` req/s → "Attack"

2. **Show Both Models**: Highlight how GenAI and ML provide complementary insights

3. **Explain Risk Levels**:
   - Green (Low): Routine network traffic
   - Yellow (Medium): Suspicious patterns
   - Orange (High): Likely attack
   - Red (Critical): Immediate threat

---

## 📞 Support

For issues or questions:
1. Check logs: `backend/` terminal output
2. Verify MongoDB: `mongosh` connection
3. Check API responses: Browser DevTools Network tab
4. Ensure env files are configured correctly

---

**Version**: 1.0 - Full Stack Ready  
**Last Updated**: February 2026  
**Status**: ✅ Production Ready
