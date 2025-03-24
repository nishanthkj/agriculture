from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os
import pickle
import numpy as np
from tensorflow.keras.models import load_model
from API import Crop

# ✅ Setup FastAPI instance first!
app = FastAPI()

# ✅ Then import and include routers
from API import Crop
app.include_router(Crop.router)

# ✅ Load templates
templates = Jinja2Templates(directory="templates")

# ✅ Load ML model and tools
MODEL_DIR = os.path.join("Models", "CropYield")
model = load_model(os.path.join(MODEL_DIR, "model.h5"), compile=False)

with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)
with open(os.path.join(MODEL_DIR, "encoders.pkl"), "rb") as f:
    encoders = pickle.load(f)

# ✅ HTML Form Endpoint
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "crops": encoders["Crop"].classes_.tolist(),
        "seasons": encoders["Season"].classes_.tolist(),
        "states": encoders["State"].classes_.tolist()
    })

# ✅ Form POST Prediction Route (HTML)
@app.post("/predict", response_class=HTMLResponse)
async def predict_form(
    request: Request,
    crop: str = Form(...),
    season: str = Form(...),
    state: str = Form(...),
    area: float = Form(...),
    rainfall: float = Form(...),
    fertilizer: float = Form(...),
    pesticide: float = Form(...)
):
    try:
        crop = crop.strip().title()
        season = season.strip().title()
        state = state.strip().title()

        if crop not in encoders["Crop"].classes_:
            raise ValueError(f"Unknown crop: '{crop}'")
        if season not in encoders["Season"].classes_:
            raise ValueError(f"Unknown season: '{season}'")
        if state not in encoders["State"].classes_:
            raise ValueError(f"Unknown state: '{state}'")

        crop_enc = encoders["Crop"].transform([crop])[0]
        season_enc = encoders["Season"].transform([season])[0]
        state_enc = encoders["State"].transform([state])[0]

        input_data = [crop_enc, season_enc, state_enc, area, rainfall, fertilizer, pesticide]
        input_scaled = scaler.transform([input_data])
        input_seq = np.expand_dims([input_scaled[0]] * 3, axis=0)

        predicted_yield = model.predict(input_seq)[0][0]

        return templates.TemplateResponse("index.html", {
            "request": request,
            "predicted_yield": round(predicted_yield, 4),
            "crops": encoders["Crop"].classes_.tolist(),
            "seasons": encoders["Season"].classes_.tolist(),
            "states": encoders["State"].classes_.tolist()
        })

    except Exception as e:
        return templates.TemplateResponse("index.html", {
            "request": request,
            "error": str(e),
            "crops": encoders["Crop"].classes_.tolist(),
            "seasons": encoders["Season"].classes_.tolist(),
            "states": encoders["State"].classes_.tolist()
        })
    