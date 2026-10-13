import os
import joblib
import pandas as pd
import shap

# Pointing to the artifacts folder, we just created through train.py
MODEL_DIR = os.path.join(os.path.dirname(__file__), "artifacts")

class CosmicHazardExplainer:
    def __init__(self):
        # 1. Load artifacts into memory on server startup this prevents multiple requests each loading the model and preprocessor again
        self.preprocessor = joblib.load(os.path.join(MODEL_DIR, "preprocessor.joblib"))
        self.model = joblib.load(os.path.join(MODEL_DIR, "xgboost_model.joblib"))
        self.feature_names = joblib.load(os.path.join(MODEL_DIR, "feature_names.joblib"))
        
        # 2. Initialize the highly optimized TreeExplainer 
        self.explainer = shap.TreeExplainer(self.model)

    def predict_and_explain(self, input_data: dict):
        # Converting incoming FASTAPI JSON to pandas dataframe
        df_input = pd.DataFrame([input_data])
        
        # Preprocess the raw input (applies the StandardScaler)
        X_transformed = self.preprocessor.transform(df_input)
        
        # attach the exact feature names so SHAP aligns the math correctly
        X_final = pd.DataFrame(X_transformed, columns=self.feature_names)
        
        # We extract index 1 (the probability that the object is hazardous)
        risk_probability = float(self.model.predict_proba(X_final)[0][1])
        
        # SHAP Explanation calculation in milliseconds
        shap_values = self.explainer.shap_values(X_final)
        
        # Map the resulting SHAP values to their respective feature names
        attributions = [
            {"feature": name, "value": float(val)} 
            for name, val in zip(self.feature_names, shap_values[0])
        ]
        
        return {
            "prediction": {
                "hazard_probability": risk_probability,
                "status": "Hazardous" if risk_probability > 0.5 else "Safe"
            },
            "explanation": {
                "base_value": float(self.explainer.expected_value),
                "attributions": attributions
            }
        }

# Instantiate a singleton to be imported directly by the FastAPI router
cosmic_explainer = CosmicHazardExplainer()