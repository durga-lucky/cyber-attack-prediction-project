# Cybersecurity Attack Prediction System

A full-stack web application that uses Machine Learning to predict and classify cybersecurity attacks in real-time.

## Features

- **Real-time Threat Detection**: Analyzes network traffic patterns to detect anomalies.
- **Machine Learning**: Uses a Random Forest Classifier trained on synthetic network traffic data (simulating NSL-KDD patterns).
- **Interactive Dashboard**: Visualizes threat levels, risk scores, and recent anomalies.
- **Attack Classification**: Identifies DDoS, Port Scanning, Data Exfiltration, and Normal traffic.
- **User Management**: Secure authentication system.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS, Recharts, Radix UI.
- **Backend**: Python, Flask, Scikit-learn, Pandas, NumPy, MongoDB.
- **Database**: MongoDB (Local).

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.8+
- MongoDB (running locally on port 27017)

### Quick Start (Mac/Linux)

Run the automated setup script to start both backend and frontend:

```bash
./run_project.sh
```

### Manual Setup

1. **Start the Backend**:
   ```bash
   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate
   
   # Install dependencies
   pip install -r backend/requirements.txt
   
   # Run server
   python backend/main.py
   ```
   The backend runs on `http://localhost:8000`.

2. **Start the Frontend**:
   ```bash
   npm install
   npm run dev
   ```
   The frontend runs on `http://localhost:3000`.

## ML Model Details

The system generates synthetic network traffic data on startup to train a Random Forest model.
Features used:
- **Protocol** (TCP, UDP, ICMP)
- **Packet Size**
- **Request Rate**

The model classifies traffic into:
- **Normal**: Standard web traffic.
- **DDoS**: High request rate, random packet sizes.
- **Port Scan**: Low packet size, systematic requests.
- **Data Exfiltration**: Abnormally large packet sizes.

## API Endpoints

- `POST /predict`: Analyze traffic data.
- `GET /dashboard/stats`: Get dashboard metrics.
- `GET /dashboard/threats`: Get recent alerts.
- `GET /dashboard/risk-data`: Get historical risk data.

