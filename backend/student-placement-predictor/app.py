from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and scaler once at startup
model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        cgpa = float(data.get('cgpa', 0))
        iq = int(data.get('iq', 0))

        features = np.array([[cgpa, iq]])
        scaled = scaler.transform(features)
        prediction = model.predict(scaled)[0]
        probability = model.predict_proba(scaled)[0]

        result = 'Placed' if prediction == 1 else 'Not Placed'
        confidence = float(max(probability))

        return jsonify({
            'result': result,
            'confidence': confidence
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5000)
