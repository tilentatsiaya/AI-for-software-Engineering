import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import joblib
import warnings
warnings.filterwarnings('ignore')
import os

class DiseaseOutbreakPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.feature_names = []
        
    def generate_synthetic_data(self, n_samples=5000):
        print("=== GENERATING TRAINING DATA ===")
        np.random.seed(42)
        
        data = {
            'temperature': np.random.normal(37, 1, n_samples),
            'humidity': np.random.normal(60, 15, n_samples),
            'rainfall': np.random.exponential(10, n_samples),
            'population_density': np.random.normal(500, 200, n_samples),
            'sanitation_score': np.random.normal(7, 2, n_samples),
            'previous_cases': np.random.poisson(5, n_samples),
            'vaccination_rate': np.random.normal(75, 15, n_samples),
            'healthcare_access': np.random.normal(6, 2, n_samples)
        }
        
        df = pd.DataFrame(data)
        
        risk_score = (
            df['temperature'] * 0.1 +
            df['humidity'] * 0.05 +
            df['rainfall'] * 0.08 +
            df['population_density'] * 0.001 -
            df['sanitation_score'] * 0.2 -
            df['vaccination_rate'] * 0.01 +
            df['previous_cases'] * 0.15 -
            df['healthcare_access'] * 0.1
        )
        
        df['outbreak_risk'] = (risk_score > risk_score.quantile(0.7)).astype(int)
        
        print(f"Generated {n_samples} samples")
        print(f"Low Risk: {(df['outbreak_risk'] == 0).sum()} samples")
        print(f"High Risk: {(df['outbreak_risk'] == 1).sum()} samples")
        print("Data generation completed!\\n")
        
        return df
    
    def preprocess_data(self, df):
        print("=== PREPROCESSING DATA ===")
        features = df.drop('outbreak_risk', axis=1)
        target = df['outbreak_risk']
        
        self.feature_names = features.columns.tolist()
        print(f"Features: {self.feature_names}")
        
        features_scaled = self.scaler.fit_transform(features)
        
        X_train, X_test, y_train, y_test = train_test_split(
            features_scaled, target, 
            test_size=0.2, 
            random_state=42,
            stratify=target
        )
        
        print(f"Training set: {X_train.shape[0]} samples")
        print(f"Test set: {X_test.shape[0]} samples")
        print("Preprocessing completed!\\n")
        
        return X_train, X_test, y_train, y_test
    
    def train(self):
        print("=== TRAINING MODEL ===")
        df = self.generate_synthetic_data(3000)
        X_train, X_test, y_train, y_test = self.preprocess_data(df)
        
        print("Training Random Forest model...")
        self.model.fit(X_train, y_train)
        
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print("=== TRAINING RESULTS ===")
        print(f"Model trained successfully!")
        print(f"Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        print("\\nDetailed Classification Report:")
        print(classification_report(y_test, y_pred))
        
        return accuracy
    
    def save_model(self, model_path='models/disease_predictor.joblib'):
        print("=== SAVING MODEL ===")
        os.makedirs('models', exist_ok=True)
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names
        }
        
        joblib.dump(model_data, model_path)
        print(f"Model saved to {model_path}")
        
        if os.path.exists(model_path):
            file_size = os.path.getsize(model_path) / 1024 / 1024
            print(f"File size: {file_size:.2f} MB")
        else:
            print("ERROR: Model file was not created!")

# Main execution
if __name__ == "__main__":
    print("Ì∂† DISEASE OUTBREAK PREDICTION MODEL TRAINING")
    print("=" * 60)
    
    try:
        predictor = DiseaseOutbreakPredictor()
        accuracy = predictor.train()
        predictor.save_model()
        
        print("\\nÌæØ FINAL RESULTS")
        print("=" * 30)
        print(f"Training completed successfully!")
        print(f"Final Accuracy: {accuracy*100:.2f}%")
        print(f"Model saved in: models/disease_predictor.joblib")
        
    except Exception as e:
        print(f"‚ùå Error during training: {e}")
        import traceback
        traceback.print_exc()
