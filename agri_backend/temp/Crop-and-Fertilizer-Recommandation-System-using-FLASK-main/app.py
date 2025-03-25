from flask import Flask, request, render_template
import pickle
import numpy as np
import os

app = Flask(__name__)

# Load models
def load_models():
    try:
        print("Loading models...")  # Debugging statement
        nb_model = pickle.load(open('models/naive_bayes_model.pkl', 'rb'))
        rf_model = pickle.load(open('models/random_forest_model.pkl', 'rb'))
        print("Models loaded successfully!")  # Debugging statement
    except Exception as e:
        print(f"Error loading models: {e}")
        raise
    return nb_model, rf_model

nb_model, rf_model = load_models()

# Mapping from number to crop name
crop_dict = { 
    1: 'Rice', 2: 'Maize', 3: 'Jute', 4: 'Cotton', 5: 'Coconut',
    6: 'Papaya', 7: 'Orange', 8: 'Apple', 9: 'Muskmelon', 10: 'Watermelon',
    11: 'Grapes', 12: 'Mango', 13: 'Banana', 14: 'Pomegranate',
    15: 'Lentil', 16: 'Blackgram', 17: 'Mungbean', 18: 'Mothbeans',
    19: 'Pigeonpeas', 20: 'Kidneybeans', 21: 'Chickpea', 22: 'Coffee'
}

fertilizer_dict = {
    0: 'Urea', 1: 'DAP', 2: 'Fourteen-Thirty Five-Fourteen',
    3: 'Twenty Eight-Twenty Eight', 4: 'Seventeen-Seventeen-Seventeen',
    5: 'Twenty-Twenty', 6: 'Ten-Twenty Six-Twenty Six'
}

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        try:
            # Extracting input data from the form
            N = float(request.form['N'])
            P = float(request.form['P'])
            K = float(request.form['K'])
            temperature = float(request.form['temperature'])
            humidity = float(request.form['humidity'])
            ph = float(request.form['ph'])
            rainfall = float(request.form['rainfall'])

            print("Received input:", N, P, K, temperature, humidity, ph, rainfall)  # Debugging statement

            # Use only 4 features for crop model
            crop_features = np.array([[N, P, K, ph]])
            crop_prediction_num = nb_model.predict(crop_features)[0]
            crop_name = crop_dict.get(crop_prediction_num, "Unknown Crop")

            print("Crop Prediction:", crop_name)  # Debugging statement

            # Use 4 features for fertilizer model (match training input)
            fertilizer_features = np.array([[N, P, K, ph]])  # FIXED input
            fertilizer_prediction = rf_model.predict(fertilizer_features)[0]

            fertilizer_name = fertilizer_dict.get(fertilizer_prediction, "Unknown Fertilizer")

            print("Fertilizer Prediction:", fertilizer_name)  # Debugging statement

            return render_template('index.html', crop_prediction=crop_name, fertilizer_prediction=fertilizer_name)
        except Exception as e:
            print("Error in processing:", e)  # Debugging statement
            return render_template('index.html', error=str(e))

    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
