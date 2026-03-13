import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np

print("Loading preprocessed data...")
# Load preprocessed data
df = pd.read_csv("data/KDDTrain_simplified.csv")

# Map labels to binary (Normal vs Attack)
# Assume 'normal' means Normal traffic, any other label means Attack
df['xAttack'] = df['xAttack'].apply(lambda x: 'Normal' if x == 'normal' else 'Attack')

# Separate features and target
X = df.drop("xAttack", axis=1)
y = df["xAttack"]

print(f"Training on features: {X.columns.tolist()}")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model
print("Training model...")
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Evaluate
from sklearn.metrics import accuracy_score
y_pred = rf_model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {acc:.4f}")

# Save model
joblib.dump(rf_model, "models/threat_detector_rf.pkl")
print("Model saved to models/threat_detector_rf.pkl")
