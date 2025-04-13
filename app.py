from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.metrics import accuracy_score
import xgboost as xgb

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load pre-trained models
rf_model = RandomForestClassifier(n_estimators=30, random_state=30)
xgb_model = xgb.XGBClassifier(n_estimators=100, use_label_encoder=False, eval_metric='logloss', random_state=42)

@app.route('/')
def home():
    return jsonify({"message": "Chronic Kidney Disease Prediction API"})

@app.route('/train', methods=['POST'])
def train():
    try:
        # Read the uploaded CSV file
        file = request.files['file']
        df = pd.read_csv(file)

        # Preprocessing steps
        if 'id' in df.columns:
            df.drop('id', axis=1, inplace=True)
        
        df.columns = ['age', 'bp', 'sg', 'al', 'su', 'rbc', 'pc', 'pcc', 'ba', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo',
                      'pcv', 'wc', 'rc', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane', 'classification']

        df['pcv'] = pd.to_numeric(df['pcv'], errors='coerce')
        df['wc'] = pd.to_numeric(df['wc'], errors='coerce')
        df['rc'] = pd.to_numeric(df['rc'], errors='coerce')

        df.fillna(df.median(numeric_only=True), inplace=True)
        label_encoder = LabelEncoder()
        for col in df.select_dtypes(include='object').columns:
            df[col] = label_encoder.fit_transform(df[col])

        X = df.drop('classification', axis=1)
        y = df['classification']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        selector = SelectKBest(score_func=f_classif, k=10)
        X_train_selected = selector.fit_transform(X_train, y_train)
        X_test_selected = selector.transform(X_test)
        scaler = StandardScaler()
        X_train_selected = scaler.fit_transform(X_train_selected)
        X_test_selected = scaler.transform(X_test_selected)

        rf_model.fit(X_train_selected, y_train)
        xgb_model.fit(X_train_selected, y_train)

        rf_accuracy = accuracy_score(y_test, rf_model.predict(X_test_selected))
        xgb_accuracy = accuracy_score(y_test, xgb_model.predict(X_test_selected))

        return jsonify({"Random Forest Accuracy": rf_accuracy, "XGBoost Accuracy": xgb_accuracy})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        model_choice = data.get('model', 'Random Forest')
        values = np.array([data['features']])
        prediction = rf_model.predict(values) if model_choice == "Random Forest" else xgb_model.predict(values)
        result = "CKD" if prediction[0] == 1 else "No CKD"
        return jsonify({"prediction": result})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)