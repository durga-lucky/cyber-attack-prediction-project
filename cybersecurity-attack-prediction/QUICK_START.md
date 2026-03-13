# 🚀 Quick Start Guide

## ✅ ONE-TIME SETUP

### Option A: Using Shell Script (macOS/Linux)
```bash
chmod +x backend/start.sh
backend/start.sh
```

### Option B: Manual Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# (Optional) Train model if needed
python3 src/train.py

# Start backend
python3 main.py
```

### Option C: Using Homebrew (Already Installed)
If you have dependencies already installed globally, just run:
```bash
cd backend
python3 main.py
```

---

## 📋 Prerequisites Check
- MongoDB running: `mongosh`
- Python 3.8+: `python3 --version`
- pip installed: `pip --version`

---

## 🔧 Environment Setup

### Backend (.env)
Create `backend/.env`:
```
OPENROUTER_API_KEY=your_key_from_https://openrouter.ai
MONGODB_URI=mongodb://localhost:27017/cybersecurity_app
FLASK_DEBUG=True
PORT=8000
```

### Frontend (.env.local)
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🎯 Start Services

### 1. Start Backend
```bash
cd backend
source venv/bin/activate  # Activate venv
python3 main.py          # Starts on http://localhost:8000
```

### 2. Start Frontend (New Terminal)
```bash
npm run dev              # Starts on http://localhost:3000
```

### 3. Start MongoDB (If Not Running)
```bash
brew services start mongodb-community
# or
mongosh
```

---

## 🧪 Test Endpoints

### 1. Signup
```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 2. Make Prediction
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "sourceIp":"192.168.1.100",
    "destIp":"10.0.0.1",
    "protocol":"tcp",
    "packetSize":"1500",
    "requestRate":"50"
  }'
```

---

## ✨ Features

- ✅ Dual Predictions (GenAI + ML Model)
- ✅ User Authentication
- ✅ MongoDB Persistence
- ✅ Dashboard Analytics
- ✅ Risk Scoring System

---

## 📊 Key URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Dashboard: http://localhost:3000/dashboard
- Predict: http://localhost:3000/predict
- Logs: http://localhost:3000/logs

---

## 🆘 Troubleshooting

### Issue: ModuleNotFoundError
```
Solution: Make sure venv is activated:
source venv/bin/activate
```

### Issue: MongoDB Connection Error
```
Solution: Ensure MongoDB is running:
brew services start mongodb-community
```

### Issue: Port Already in Use
```
Solution: Kill existing process:
lsof -i :8000 | grep LISTEN
kill -9 <PID>
```

### Issue: Model Loading Error
```
Solution: Regenerate model:
python3 src/train.py
```

---

## 🎓 Demo Test Cases

### Test Case 1: Normal Traffic
- **Input**: TCP, 100 bytes, 5 req/s
- **Expected**: Normal traffic detected ✅

### Test Case 2: DDoS Attack
- **Input**: TCP, 1500 bytes, 600 req/s
- **Expected**: Attack detected 🔴

### Test Case 3: Port Scan
- **Input**: ICMP, 64 bytes, 100 req/s
- **Expected**: Suspicious activity 🟡

---

## 📖 Next Steps

1. Configure OpenRouter API key for GenAI
2. Upload custom datasets
3. Train custom models
4. Deploy to production

---

**Last Updated**: February 2026  
**Version**: 1.0 - Full Stack Ready
