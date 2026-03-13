from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
import time
import joblib
import pandas as pd
import numpy as np
import json
from dotenv import load_dotenv
from openai import OpenAI
from model_loader import safe_load_model

# Load environment variables
load_dotenv()

app = Flask(__name__)
@app.route("/")
def home():
    return {
        "status": "running",
        "message": "Cyber Attack Prediction API is working"
    }
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# OpenRouter Client
openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
openai_client = None
client= None
if openrouter_api_key and openrouter_api_key != "your_openrouter_api_key_here":
    openai_client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=openrouter_api_key,
    )

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["cybersecurity_app"]
users_collection = db["users"]
predictions_collection = db["predictions"]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Load trained model with compatibility wrapper
basedir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(basedir, "models", "threat_detector_rf.pkl")
encoder_path = os.path.join(basedir, "models", "protocol_encoder.pkl")

try:
    # Use safe loader for compatibility
    model = safe_load_model(model_path)
    protocol_encoder = joblib.load(encoder_path)
    
    if model is not None:
        print("✅ Model loaded successfully.")
        try:
            # Check classes
            classes_list = list(model.classes_)
            if 'Attack' in classes_list:
                attack_idx = classes_list.index('Attack')
            else:
                attack_idx = 1 # Fallback
        except Exception as e:
            print(f"⚠️ Error accessing model classes: {e}")
            model = None
            attack_idx = 1
    else:
        print("⚠️ Model is None - ML predictions will use GenAI fallback")
        model = None
        attack_idx = 1
        
except Exception as e:
    print(f"⚠️ Error during model setup: {e}")
    print("📌 System will use GenAI predictions as primary")
    model = None
    protocol_encoder = None
    attack_idx = 1


def predict_with_genai(source_ip, dest_ip, protocol, packet_size, request_rate):
    if not openai_client:
        return None
    
    prompt = f"""
    Analyze the following network traffic for potential cyber attacks.
    Source IP: {source_ip}
    Destination IP: {dest_ip}
    Protocol: {protocol}
    Packet Size: {packet_size} bytes
    Request Rate: {request_rate} requests/sec

    Provide a risk assessment in valid JSON format with the following keys:
    - prediction: "Attack" or "Normal"
    - confidence: integer (0-100)
    - riskLevel: "Low", "Medium", "High", or "Critical"
    - details: A short explanation (max 2 sentences)
    - riskScore: integer (0-100)

    Do not include markdown formatting or code blocks. Just the JSON.
    """

    start_time = time.time()
    try:
        response = openai_client.chat.completions.create(
            model="openai/gpt-3.5-turbo", # Or any other model available on OpenRouter
            messages=[
                {"role": "system", "content": "You are a cybersecurity expert AI."},
                {"role": "user", "content": prompt}
            ]
        )
        end_time = time.time()
        inference_time = round(end_time - start_time, 2)
        
        content = response.choices[0].message.content.strip()
        # Remove potential markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        
        result = json.loads(content)
        
        # Add metadata
        result["tokens"] = response.usage.total_tokens
        result["time"] = inference_time
        result["model"] = response.model
        
        return result
    except Exception as e:
        print(f"GenAI prediction error: {e}")
        return None

def predict_attack(source_ip, dest_ip, protocol, packet_size, request_rate):
    global model, protocol_encoder, attack_idx
    
    # Get GenAI prediction (Now the primary and only one shown)
    genai_result = predict_with_genai(source_ip, dest_ip, protocol, packet_size, request_rate)
    
    # If GenAI succeeded, return only GenAI results
    if genai_result:
        return {
            "prediction": genai_result.get("prediction", "Unknown"),
            "confidence": genai_result.get("confidence", 0),
            "riskLevel": genai_result.get("riskLevel", "Unknown"),
            "details": genai_result.get("details", ""),
            "riskScore": genai_result.get("riskScore", 0),
            "tokens": genai_result.get("tokens", 0),
            "time": genai_result.get("time", 0.0),
            "model": genai_result.get("model", "Unknown"),
            "genaiPrediction": genai_result,
            "mlPrediction": None # Explicitly hide ML prediction
        }
    
    # If GenAI failed, provide a fallback error message
    return {
        "prediction": "Error",
        "confidence": 0,
        "riskLevel": "Unknown",
        "details": "GenAI analysis failed. Please check your API key and connection.",
        "riskScore": 0,
        "tokens": 0,
        "time": 0.0,
        "model": "None",
        "genaiPrediction": None,
        "mlPrediction": None
    }

def get_ml_prediction(source_ip, dest_ip, protocol, packet_size, request_rate):
    global model, protocol_encoder, attack_idx

    # Check if model is available
    if model is None:
        return {
            "prediction": "Unavailable",
            "confidence": 0,
            "riskLevel": "Unknown",
            "details": "ML Model not available, using GenAI fallback",
            "riskScore": 0
        }
    
    # Check if protocol encoder is available
    if protocol_encoder is None:
        return {
            "prediction": "Unavailable",
            "confidence": 0,
            "riskLevel": "Unknown",
            "details": "Protocol encoder not available",
            "riskScore": 0
        }

    try:
        # Preprocess input
        prot_lower = protocol.lower()
        # Handle unseen protocol
        valid_protocols = list(protocol_encoder.classes_)
        # map common variations?
        if prot_lower not in valid_protocols:
            # try to find closest match or default to tcp
            # For simplicity, fallback to tcp if available, or first class
            fallback_proto = 'tcp' if 'tcp' in valid_protocols else valid_protocols[0]
            prot_encoded = protocol_encoder.transform([fallback_proto])[0]
        else:
            prot_encoded = protocol_encoder.transform([prot_lower])[0]
    except Exception as e:
        print(f"Encoding error: {e}")
        prot_encoded = 0
        
    packet_size = int(packet_size)
    request_rate = int(request_rate)
    
    # Create DataFrame with correct feature names
    features = pd.DataFrame([{
        'protocol_type': prot_encoded,
        'src_bytes': packet_size,
        'count': request_rate
    }])
    
    # Predict
    try:
        prediction_prob = model.predict_proba(features)[0]
        prediction = model.predict(features)[0]
        
        # Calculate risk score
        risk_score = int(prediction_prob[attack_idx] * 100)
    except Exception as e:
        print(f"Prediction error: {e}")
        return {
            "prediction": "Error", 
            "confidence": 0, 
            "riskLevel": "Unknown", 
            "details": str(e), 
            "riskScore": 0
        }
    
    # Determine risk level
    if risk_score >= 80:
        risk_level = "Critical"
    elif risk_score >= 60:
        risk_level = "High"
    elif risk_score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"
        
    # Generate details
    details = []
    if prediction == "Attack":
        if request_rate > 500:
            details.append("Abnormally high request rate (Potential DDoS)")
        elif packet_size > 2000:
            details.append("Large packet size detected (Potential Data Exfiltration)")
        elif protocol.lower() == 'icmp':
            details.append("Suspicious ICMP traffic (Potential Reconnaissance)")
        elif 100 <= packet_size <= 200 and request_rate < 50:
             details.append("Suspicious periodic traffic (Potential Botnet C&C)")
        
        if not details:
            details.append("Traffic pattern matches known attack signatures")
        detail_msg = "; ".join(details)
    else:
        detail_msg = "Traffic pattern appears normal."

    return {
        "prediction": prediction,
        "confidence": int(max(prediction_prob) * 100),
        "riskLevel": risk_level,
        "details": detail_msg,
        "riskScore": risk_score
    }

# Authentication endpoints
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Allow only Gmail addresses
    if not email.endswith("@gmail.com"):
        return jsonify({"error": "Only Gmail addresses are allowed"}), 400
    
    # Check if user exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400
    
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already taken"}), 400
    
    # Create user
    hashed_pw = hash_password(password)
    user_data = {
        "username": username,
        "email": email,
        "password": hashed_pw,
        "created_at": datetime.utcnow()
    }
    users_collection.insert_one(user_data)
    
    return jsonify({"message": "User created successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # Find user
    user = users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    
    return jsonify({
        "message": "Login successful",
        "user": {
            "username": user["username"],
            "email": user["email"]
        }
    }), 200

@app.route("/user/<email>", methods=["GET"])
def get_user(email):
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "username": user["username"],
        "email": user["email"],
        "created_at": user["created_at"].isoformat()
    }), 200

@app.route("/user/<email>", methods=["PUT"])
def update_user(email):
    data = request.json
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    update_data = {}
    
    if data.get("username"):
        # Check if username is taken
        existing = users_collection.find_one({"username": data["username"]})
        if existing and existing["email"] != email:
            return jsonify({"error": "Username already taken"}), 400
        update_data["username"] = data["username"]
    
    if data.get("email"):
        # Check if email is taken
        existing = users_collection.find_one({"email": data["email"]})
        if existing and existing["email"] != email:
            return jsonify({"error": "Email already registered"}), 400
        update_data["email"] = data["email"]
    
    if update_data:
        users_collection.update_one({"email": email}, {"$set": update_data})
    
    return jsonify({"message": "User updated successfully"}), 200

# Attack prediction endpoints
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    email = data.get("email")
    source_ip = data.get("sourceIp")
    dest_ip = data.get("destIp")
    protocol = data.get("protocol")
    packet_size = data.get("packetSize")
    request_rate = data.get("requestRate")
    
    if not all([email, source_ip, dest_ip, protocol, packet_size, request_rate]):
        return jsonify({"error": "All fields are required"}), 400
    
    # Get prediction
    result = predict_attack(source_ip, dest_ip, protocol, packet_size, request_rate)
    
    # Store prediction in database
    prediction_data = {
        "email": email,
        "sourceIp": source_ip,
        "destIp": dest_ip,
        "protocol": protocol,
        "packetSize": int(packet_size),
        "requestRate": int(request_rate),
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "riskLevel": result["riskLevel"],
        "details": result["details"],
        "riskScore": result["riskScore"],
        "tokens": result.get("tokens", 0),
        "time": result.get("time", 0.0),
        "model": result.get("model", "Unknown"),
        "genaiPrediction": result.get("genaiPrediction"),
        "mlPrediction": None, # Do not store ML results anymore if we only want GenAI
        "created_at": datetime.utcnow()
    }
    predictions_collection.insert_one(prediction_data)
    
    return jsonify(result), 200

@app.route("/predictions/<email>", methods=["GET"])
def get_predictions(email):
    predictions = list(predictions_collection.find({"email": email}).sort("created_at", -1).limit(20))
    
    # Convert ObjectId and datetime to string
    for pred in predictions:
        pred["_id"] = str(pred["_id"])
        pred["created_at"] = pred["created_at"].isoformat()
    
    return jsonify({"predictions": predictions}), 200

# Dashboard endpoints
@app.route("/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    # Get recent predictions for stats
    recent_predictions = list(predictions_collection.find().sort("created_at", -1).limit(100))
    
    # Calculate stats
    total_requests = len(recent_predictions)
    attack_count = sum(1 for p in recent_predictions if p["prediction"] == "Attack")
    
    # Calculate average risk score
    avg_risk = sum(p.get("riskScore", 0) for p in recent_predictions) / max(total_requests, 1)
    
    # Determine threat level
    if avg_risk >= 60:
        threat_level = "High"
    elif avg_risk >= 30:
        threat_level = "Medium"
    else:
        threat_level = "Low"
    
    return jsonify({
        "threatLevel": threat_level,
        "riskScore": int(avg_risk),
        "totalRequests": total_requests,
        "anomaliesDetected": attack_count
    }), 200

@app.route("/dashboard/threats", methods=["GET"])
def get_recent_threats():
    # Get recent attack predictions
    threats = list(predictions_collection.find({"prediction": "Attack"}).sort("created_at", -1).limit(10))
    
    result = []
    for threat in threats:
        # Calculate time ago
        time_diff = datetime.utcnow() - threat["created_at"]
        if time_diff.seconds < 60:
            time_ago = f"{time_diff.seconds} seconds ago"
        elif time_diff.seconds < 3600:
            time_ago = f"{time_diff.seconds // 60} minutes ago"
        else:
            time_ago = f"{time_diff.seconds // 3600} hours ago"
        
        # Determine attack type based on indicators if stored, or infer
        # Better: use 'details' field if it contains types, or infer from packetSize etc.
        # Ideally store attack_type in DB? But for now re-infer or use details.
        
        attack_type = "Suspicious Activity"
        if threat.get("requestRate", 0) > 500:
            attack_type = "DDoS Attempt"
        elif threat.get("protocol", "").lower() == "icmp":
            attack_type = "Port Scan"
        elif threat.get("packetSize", 0) > 5000:
            attack_type = "Data Exfiltration"
        
        result.append({
            "id": str(threat["_id"]),
            "ip": threat["sourceIp"],
            "type": attack_type,
            "level": threat["riskLevel"],
            "time": time_ago
        })
    
    # Return actual threats found (or empty list if none)
    
    return jsonify({"threats": result}), 200

@app.route("/dashboard/risk-data", methods=["GET"])
def get_risk_data():
    # Generate risk data for the last 24 hours
    now = datetime.utcnow()
    risk_data = []
    
    for i in range(7):
        time_point = now - timedelta(hours=24 - (i * 4))
        # Get predictions around this time
        start_time = time_point - timedelta(hours=2)
        end_time = time_point + timedelta(hours=2)
        
        predictions = list(predictions_collection.find({
            "created_at": {"$gte": start_time, "$lte": end_time}
        }))
        
        if predictions:
            avg_risk = sum(p.get("riskScore", 0) for p in predictions) / len(predictions)
        else:
            avg_risk = 0
        
        risk_data.append({
            "time": f"{i * 4:02d}:00",
            "risk": int(avg_risk)
        })
    
    return jsonify({"riskData": risk_data}), 200

# --- Attack Simulation Integration ---
from attack_generator import simulator

@app.route("/simulation/start", methods=["POST"])
def start_simulation():
    if simulator.start():
        return jsonify({"message": "Attack simulation started"}), 200
    return jsonify({"message": "Simulation already running"}), 400

@app.route("/simulation/stop", methods=["POST"])
def stop_simulation():
    if simulator.stop():
        return jsonify({"message": "Attack simulation stopped"}), 200
    return jsonify({"message": "Simulation not running"}), 400

@app.route("/simulation/status", methods=["GET"])
def simulation_status():
    return jsonify({"running": simulator.running}), 200

if __name__ == "__main__":

    print("Starting Cybersecurity Attack Prediction Backend...")
    print("Server running on http://localhost:8000")
    app.run(host="0.0.0.0", port=10000)
    app.run(debug=True, port=8000)
    
