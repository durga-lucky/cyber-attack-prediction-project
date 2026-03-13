import time
import random
import requests
import threading
import json
from datetime import datetime

# Configuration
const API_BASE_URL = "https://cyber-attack-prediction-project.onrender.com"
EMAIL = "simulation@cyberguard.ai"

# Attack patterns
ATTACK_TYPES = [
    {
        "type": "DDoS",
        "protocol": "UDP",
        "packet_size_range": (64, 1500),
        "request_rate_range": (1000, 5000),
        "weight": 0.3
    },
    {
        "type": "Port Scan",
        "protocol": "ICMP",
        "packet_size_range": (32, 64),
        "request_rate_range": (10, 100),
        "weight": 0.2
    },
    {
        "type": "Data Exfiltration",
        "protocol": "TCP",
        "packet_size_range": (2000, 65000),
        "request_rate_range": (10, 50),
        "weight": 0.2
    },
    {
        "type": "Normal",
        "protocol": "TCP",
        "packet_size_range": (64, 1500),
        "request_rate_range": (1, 20),
        "weight": 0.3
    }
]

class AttackSimulator:
    def __init__(self):
        self.running = False
        self.thread = None

    def generate_random_ip(self):
        return f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"

    def simulate(self):
        print("🚀 Attack Simulation Started...")
        while self.running:
            try:
                # Select a traffic type based on weights
                attack = random.choices(ATTACK_TYPES, weights=[a["weight"] for a in ATTACK_TYPES])[0]
                
                # Generate parameters
                source_ip = self.generate_random_ip()
                dest_ip = "192.168.1.100" # Target Server
                protocol = attack["protocol"]
                packet_size = random.randint(*attack["packet_size_range"])
                request_rate = random.randint(*attack["request_rate_range"])
                
                payload = {
                    "email": EMAIL,
                    "sourceIp": source_ip,
                    "destIp": dest_ip,
                    "protocol": protocol,
                    "packetSize": packet_size,
                    "requestRate": request_rate
                }
                
                # Send request
                try:
                    response = requests.post(API_URL, json=payload, timeout=2)
                    if response.status_code == 200:
                        result = response.json()
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] {attack['type']} -> {result.get('prediction')} (Risk: {result.get('riskScore')})")
                    else:
                        print(f"⚠️ API Error: {response.status_code}")
                except requests.exceptions.RequestException as e:
                    print(f"⚠️ Connection Error: {e}")
                
                # Sleep a bit to simulate real-time traffic
                time.sleep(random.uniform(0.5, 2.0))
                
            except Exception as e:
                print(f"❌ Simulation Error: {e}")
                time.sleep(1)

    def start(self):
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self.simulate)
            self.thread.daemon = True # Daemon thread exits when main program exits
            self.thread.start()
            return True
        return False

    def stop(self):
        if self.running:
            self.running = False
            if self.thread:
                self.thread.join(timeout=2)
            print("🛑 Attack Simulation Stopped.")
            return True
        return False

# Global instance
simulator = AttackSimulator()

if __name__ == "__main__":
    # Standalone mode
    try:
        simulator.start()
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        simulator.stop()
