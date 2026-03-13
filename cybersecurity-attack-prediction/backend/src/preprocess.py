import pandas as pd
from scipy.io import arff
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load ARFF and decode byte strings
def load_and_preprocess_arff(filepath):
    print(f"Loading {filepath}...")
    data, meta = arff.loadarff(filepath)
    df = pd.DataFrame(data)
    
    # Decode byte strings
    df = df.map(lambda x: x.decode() if isinstance(x, bytes) else x)
    return df

# Encode categorical features and the label column
def process_features(df):
    # Select only the features we need
    # Frontend provides: protocol (protocol_type), packetSize (src_bytes), requestRate (count)
    # Target: class (xAttack)
    
    required_cols = ['protocol_type', 'src_bytes', 'count', 'class']
    
    # Check if columns exist
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns in dataset: {missing}")
        
    df = df[required_cols].copy()
    
    # Rename class to xAttack for consistency
    df.rename(columns={'class': 'xAttack'}, inplace=True)
    
    # Encode protocol_type
    le_protocol = LabelEncoder()
    df['protocol_type'] = le_protocol.fit_transform(df['protocol_type'])
    
    # Save the encoder
    if not os.path.exists("models"):
        os.makedirs("models")
    joblib.dump(le_protocol, "models/protocol_encoder.pkl")
    print("Saved protocol encoder to models/protocol_encoder.pkl")
    
    return df

# Save DataFrame to CSV
def save_to_csv(df, output_path):
    df.to_csv(output_path, index=False)
    print(f"Saved preprocessed data to {output_path}")

if __name__ == "__main__":
    # Use the full KDDTrain+.arff file
    input_path = "data/KDDTrain+.arff"
    output_path = "data/KDDTrain_simplified.csv"
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        exit(1)
        
    df = load_and_preprocess_arff(input_path)
    df = process_features(df)
    save_to_csv(df, output_path)
