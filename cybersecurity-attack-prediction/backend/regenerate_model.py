#!/usr/bin/env python3
"""
Quick model regeneration script
Creates a simple threat detector model without external training data
"""

import sys
import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import warnings

warnings.filterwarnings('ignore')

print("🔧 Regenerating ML models...")

try:
    # Create synthetic training data (simple for demo purposes)
    np.random.seed(42)
    
    # Generate synthetic samples
    n_samples = 1000
    
    # Protocol: 0=TCP, 1=UDP, 2=ICMP
    protocols = np.random.choice([0, 1, 2], n_samples)
    
    # Packet sizes: 50-2500 bytes
    packet_sizes = np.random.randint(50, 2500, n_samples)
    
    # Request rates: 1-1000 per second
    request_rates = np.random.randint(1, 1000, n_samples)
    
    # Generate labels: Attack if high request rate OR large packet size
    labels = []
    for i in range(n_samples):
        if request_rates[i] > 500 or packet_sizes[i] > 1800:
            labels.append('Attack')
        else:
            labels.append('Normal')
    
    X = np.column_stack([protocols, packet_sizes, request_rates])
    y = np.array(labels)
    
    print(f"✅ Created synthetic dataset: {X.shape[0]} samples")
    print(f"   - Attack: {sum(labels.count('Attack') for _ in range(1))}")
    print(f"   - Normal: {sum(labels.count('Normal') for _ in range(1))}")
    
    # Train Random Forest model
    print("🤖 Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X, y)
    
    print(f"✅ Model trained successfully")
    print(f"   - Accuracy: {model.score(X, y):.2%}")
    print(f"   - Classes: {list(model.classes_)}")
    
    # Create protocol encoder
    protocol_encoder = LabelEncoder()
    protocols_list = np.array(['tcp', 'udp', 'icmp'])
    protocol_encoder.fit(protocols_list)
    
    # Save models
    os.makedirs('models', exist_ok=True)
    
    joblib.dump(model, 'models/threat_detector_rf.pkl')
    print("✅ Saved: models/threat_detector_rf.pkl")
    
    joblib.dump(protocol_encoder, 'models/protocol_encoder.pkl')
    print("✅ Saved: models/protocol_encoder.pkl")
    
    # Verify the saved models
    print("\n✅ Verifying saved models...")
    test_model = joblib.load('models/threat_detector_rf.pkl')
    print(f"   - Model classes: {list(test_model.classes_)}")
    print(f"   - Has predict: {hasattr(test_model, 'predict')}")
    print(f"   - Has predict_proba: {hasattr(test_model, 'predict_proba')}")
    
    print("\n✅ Model regeneration complete!")
    sys.exit(0)
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
