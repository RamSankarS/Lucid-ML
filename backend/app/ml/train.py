import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
import xgboost as xgb

# Define where we will save the trained model files
MODEL_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
os.makedirs(MODEL_DIR, exist_ok=True)

def fetch_nasa_data():
    """Fetches the NASA NEO dataset or generates a realistic fallback."""
    url = "https://raw.githubusercontent.com/Abhaykumar04/Near-earth-objects-observed-by--NASA/main/neo.csv"
    try:
        print("1. Fetching NASA Asteroid dataset...")
        df = pd.read_csv(url)
        # Taking a lighter sample for demonstration purposes
        if len(df) > 20000:
            df = df.sample(20000, random_state=42)
    except Exception as e:
        # creating a failsafe, incase the url doesn't work.
        print(f"URL fetch failed ({e}). Generating realistic fallback data...")
        np.random.seed(42)
        n = 20000
        df = pd.DataFrame({
            'absolute_magnitude': np.random.normal(22, 2.5, n),
            'est_diameter_max': np.random.exponential(0.5, n), 
            'relative_velocity': np.random.normal(50000, 20000, n),
            'miss_distance': np.random.uniform(0, 50000000, n)
        })
        # Logic: Large diameter + close miss distance = higher hazard probability
        hazard_prob = (df['est_diameter_max'] * 0.3) - (df['miss_distance'] / 100000000)
        df['hazardous'] = (hazard_prob > 0.1).astype(bool)
        
    return df

def train_pipeline():
    df = fetch_nasa_data()

    # Core UI Features
    features = [
        "absolute_magnitude", 
        "est_diameter_max",  
        "relative_velocity", 
        "miss_distance"
    ]
    
    X = df[features]
    # The target 'hazardous' is boolean. Convert True/False to 1/0 for model training
    y = df['hazardous'].astype(int)

    print("2. Setting up Preprocessing...")
    # All our cosmic features are numerical therefore nothing else needed other than standard scalar
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), features)
        ]
    )

    # Splitting data into 80% training and 20% testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("3. Transforming data...")
    X_train_transformed = preprocessor.fit_transform(X_train)
    
    # for SHAP, we need to keep track of the feature names after transformation
    X_train_final = pd.DataFrame(X_train_transformed, columns=features)

    print("4. Training XGBoost Classifier...")
    # scale_pos_weight is important as hazardous asteroids are rare (imbalanced data)
    pos_weight = (len(y_train) - sum(y_train)) / sum(y_train) if sum(y_train) > 0 else 1
    
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        scale_pos_weight=pos_weight, 
        random_state=42,
        eval_metric="logloss"
    )
    model.fit(X_train_final, y_train)

    print("5. Saving artifacts...")
    joblib.dump(preprocessor, os.path.join(MODEL_DIR, "preprocessor.joblib"))
    joblib.dump(model, os.path.join(MODEL_DIR, "xgboost_model.joblib"))
    joblib.dump(features, os.path.join(MODEL_DIR, "feature_names.joblib"))

    print("✅ Training complete! Artifacts saved to backend/app/ml/artifacts/")

if __name__ == "__main__":
    train_pipeline()