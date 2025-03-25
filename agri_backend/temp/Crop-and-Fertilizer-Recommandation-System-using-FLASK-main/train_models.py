import pickle
import os
import pandas as pd
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Ensure models directory exists
os.makedirs("models", exist_ok=True)

# Load the correct dataset with 7 features
data = pd.read_csv("Crop_recommendation.csv")  # Ensure this file contains all 7 features

# Ensure only the required 7 columns are selected
X = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y_crop = data['crop_label']  # Target variable for crops

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y_crop, test_size=0.2, random_state=42)

# Train Naive Bayes model with 7 features
nb_model = GaussianNB()
nb_model.fit(X_train, y_train)

# Save the updated Naive Bayes model
with open("models/naive_bayes_model.pkl", "wb") as f:
    pickle.dump(nb_model, f)

print("✅ Naive Bayes model retrained and saved successfully!")

# Train Random Forest model (for fertilizer prediction)
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save Random Forest model
with open("models/random_forest_model.pkl", "wb") as f:
    pickle.dump(rf_model, f)

print("✅ Random Forest model retrained and saved successfully!")
