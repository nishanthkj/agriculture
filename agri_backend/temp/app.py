from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import os
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

# === Load model and preprocessing tools ===
MODEL_DIR = os.path.join("Models", "CropYield")
model = load_model(os.path.join(MODEL_DIR, "model.h5"), compile=False)

with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)

with open(os.path.join(MODEL_DIR, "encoders.pkl"), "rb") as f:
    encoders = pickle.load(f)

# ✅ Route for HTML form
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html',
                           crops=encoders["Crop"].classes_,
                           seasons=encoders["Season"].classes_,
                           states=encoders["State"].classes_)

# ✅ API Route for Prediction
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        crop = data.get("crop", "").strip().title()
        season = data.get("season", "").strip().title()
        state = data.get("state", "").strip().title()
        area = float(data.get("area"))
        rainfall = float(data.get("rainfall"))
        fertilizer = float(data.get("fertilizer"))
        pesticide = float(data.get("pesticide"))

        if crop not in encoders["Crop"].classes_:
            return jsonify({"error": f"Unknown crop: {crop}"}), 400
        if season not in encoders["Season"].classes_:
            return jsonify({"error": f"Unknown season: {season}"}), 400
        if state not in encoders["State"].classes_:
            return jsonify({"error": f"Unknown state: {state}"}), 400

        crop_enc = encoders["Crop"].transform([crop])[0]
        season_enc = encoders["Season"].transform([season])[0]
        state_enc = encoders["State"].transform([state])[0]

        input_data = [crop_enc, season_enc, state_enc, area, rainfall, fertilizer, pesticide]
        scaled = scaler.transform([input_data])
        sequence_input = np.expand_dims([scaled[0]] * 3, axis=0)

        prediction = model.predict(sequence_input)[0][0]
        return jsonify({"predicted_yield": float(round(prediction, 4))})


    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
