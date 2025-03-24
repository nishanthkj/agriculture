from fastapi import APIRouter, Body, FastAPI
from fastapi.responses import JSONResponse
import os
import numpy as np
import pickle
from tensorflow.keras.models import load_model
import traceback
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# ✅ Allow CORS from anywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🚨 In production, use specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Load model and preprocessing tools ===
MODEL_DIR = os.path.join("Models", "CropYield")
model = load_model(os.path.join(MODEL_DIR, "model.h5"), compile=False)

with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)

with open(os.path.join(MODEL_DIR, "encoders.pkl"), "rb") as f:
    encoders = pickle.load(f)

# === Setup Router ===
router = APIRouter()

@router.post("/predict/api")
async def predict_api(data: dict = Body(...)):
    try:
        # ✅ 1. Clean and extract input
        crop = data.get("crop", "").strip().title()
        season = data.get("season", "").strip().title()
        state = data.get("state", "").strip().title()
        area = float(data.get("area"))
        rainfall = float(data.get("rainfall"))
        fertilizer = float(data.get("fertilizer"))
        pesticide = float(data.get("pesticide"))

        # ✅ 2. Validate against known classes
        if crop not in encoders["Crop"].classes_:
            raise ValueError(f"Unknown crop: '{crop}'")
        if season not in encoders["Season"].classes_:
            raise ValueError(f"Unknown season: '{season}'")
        if state not in encoders["State"].classes_:
            raise ValueError(f"Unknown state: '{state}'")

        # ✅ 3. Encode categorical fields
        crop_enc = encoders["Crop"].transform([crop])[0]
        season_enc = encoders["Season"].transform([season])[0]
        state_enc = encoders["State"].transform([state])[0]

        # ✅ 4. Prepare model input
        input_data = [crop_enc, season_enc, state_enc, area, rainfall, fertilizer, pesticide]
        input_scaled = scaler.transform([input_data])  # shape: (1, 7)
        input_seq = np.expand_dims([input_scaled[0]] * 3, axis=0)  # shape: (1, 3, 7)

        # ✅ 5. Predict
        predicted_yield = model.predict(input_seq)[0][0]
        return {"predicted_yield": round(predicted_yield, 4)}

    except Exception as e:
        print("❌ EXCEPTION OCCURRED:")
        traceback.print_exc()  # ✅ Full traceback
        return JSONResponse(status_code=500, content={"error": str(e)})

