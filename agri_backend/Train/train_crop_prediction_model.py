import os
import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Conv1D, MaxPooling1D
from tensorflow.keras.callbacks import EarlyStopping

# ========== PATHS ==========
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "DataSet", "crop_data.csv")
MODELS_DIR = os.path.join(BASE_DIR, "..", "Models")
MODEL_PATH = os.path.join(MODELS_DIR, "model.h5")
ENCODER_PATH = os.path.join(MODELS_DIR, "encoders.pkl")
SCALER_PATH = os.path.join(MODELS_DIR, "scaler.pkl")

os.makedirs(MODELS_DIR, exist_ok=True)

# ========== LOAD DATA ==========
df = pd.read_csv(DATA_PATH)

# ========== ENCODE ==========
encoders = {
    "Crop": LabelEncoder(),
    "Season": LabelEncoder(),
    "State": LabelEncoder()
}
for col, encoder in encoders.items():
    df[col] = encoder.fit_transform(df[col])

# ========== PREPROCESS ==========
features = ['Crop', 'Season', 'State', 'Area', 'Rainfall', 'Fertilizer', 'Pesticide']
target = 'Yield'
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(df[features])
y = df[target].values

# ========== SEQUENCE CREATION ==========
def create_sequences(X, y, window=3):
    Xs, ys = [], []
    for i in range(len(X) - window):
        Xs.append(X[i:i+window])
        ys.append(y[i+window])
    return np.array(Xs), np.array(ys)

X_seq, y_seq = create_sequences(X_scaled, y)
X_train, X_test, y_train, y_test = train_test_split(X_seq, y_seq, test_size=0.2, random_state=42)

# ========== MODEL ==========
model = Sequential([
    Conv1D(64, kernel_size=2, activation='relu', input_shape=(X_train.shape[1], X_train.shape[2])),
    MaxPooling1D(pool_size=2),
    LSTM(64),
    Dropout(0.3),
    Dense(32, activation='relu'),
    Dense(1)
])
model.compile(optimizer='adam', loss='mse')
model.fit(X_train, y_train, epochs=100, batch_size=16, validation_split=0.2, callbacks=[EarlyStopping(patience=10)])

# ========== EXPORT ==========
model.save(MODEL_PATH)
with open(SCALER_PATH, "wb") as f: pickle.dump(scaler, f)
with open(ENCODER_PATH, "wb") as f: pickle.dump(encoders, f)

print("✅ Model, scaler, and encoders saved to 'Models/'")
