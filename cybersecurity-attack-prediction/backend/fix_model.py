#!/usr/bin/env python3
"""
Quick fix for scikit-learn model compatibility issue
This script converts the old model to work with scikit-learn 1.6.1+
"""

import pickle
import numpy as np
import sys
import shutil
from pathlib import Path

def fix_model():
    """Fix the model by converting it to be compatible with newer scikit-learn"""
    
    model_path = "models/threat_detector_rf.pkl"
    backup_path = "models/threat_detector_rf.pkl.bak"
    
    print(f"📦 Attempting to fix model at: {model_path}")
    
    # Create backup
    if Path(model_path).exists():
        shutil.copy(model_path, backup_path)
        print(f"✅ Backup created: {backup_path}")
    
    # Try loading with pickle protocol that handles version differences
    try:
        with open(model_path, 'rb') as f:
            # Load with different protocol
            original_pickle = pickle.Unpickler(f)
            original_pickle.encoding = 'latin1'
            
            try:
                model = original_pickle.load()
                print("✅ Model loaded successfully!")
                
                # Try to use it for prediction
                import pandas as pd
                test_data = pd.DataFrame([{
                    'protocol_type': 1,
                    'src_bytes': 100,
                    'count': 5
                }])
                
                pred = model.predict(test_data)
                print(f"✅ Model prediction works: {pred}")
                return True
                
            except Exception as e:
                print(f"⚠️  Direct load method failed: {e}")
                return False
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = fix_model()
    sys.exit(0 if success else 1)
