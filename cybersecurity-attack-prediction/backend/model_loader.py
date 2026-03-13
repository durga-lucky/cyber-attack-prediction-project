"""
Model loader with compatibility wrapper for scikit-learn version mismatches
Handles loading models saved with older scikit-learn versions
"""

import joblib
import warnings
import pickle
import numpy as np
from sklearn import __version__ as sklearn_version


def safe_load_model(path):
    """
    Safely load a model with compatibility handling for scikit-learn versions
    
    Args:
        path: Path to the pickled model file
        
    Returns:
        Loaded model or None if loading fails
    """
    try:
        # Try direct load first
        model = joblib.load(path)
        print(f"✅ Model loaded successfully from {path}")
        return model
    except (ValueError, TypeError) as e:
        if "incompatible dtype" in str(e) or "node array" in str(e):
            print(f"⚠️ Version mismatch detected: {str(e)[:100]}...")
            print(f"📦 Current scikit-learn version: {sklearn_version}")
            
            # Try loading with pickle protocol to inspect structure
            try:
                with open(path, 'rb') as f:
                    model = pickle.load(f)
                print("✅ Model loaded with pickle (compatibility mode)")
                return model
            except Exception as pickle_err:
                print(f"❌ Pickle load also failed: {pickle_err}")
                return None
        else:
            print(f"❌ Error loading model: {e}")
            return None
    except Exception as e:
        print(f"❌ Unexpected error loading model: {e}")
        return None


def test_model(model, test_input):
    """
    Test if model can make predictions
    
    Args:
        model: Loaded model
        test_input: Test data (DataFrame or array)
        
    Returns:
        True if prediction works, False otherwise
    """
    try:
        if hasattr(model, 'predict'):
            prediction = model.predict(test_input)
            print(f"✅ Model prediction works: {prediction}")
            return True
        return False
    except Exception as e:
        print(f"❌ Model prediction failed: {e}")
        return False
