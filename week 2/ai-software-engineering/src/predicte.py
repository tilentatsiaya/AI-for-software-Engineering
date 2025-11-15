import joblib
import pandas as pd
import numpy as np

class DiseasePredictor:
    def __init__(self, model_path='models/disease_predictor.joblib'):
        self.model_path = model_path
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.load_model()
    
    def load_model(self):
        """Load the trained model"""
        try:
            model_data = joblib.load(self.model_path)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            print("Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    def predict(self, input_data):
        """Make prediction on new data"""
        try:
            input_df = pd.DataFrame([input_data])
            input_scaled = self.scaler.transform(input_df)
            
            prediction = self.model.predict(input_scaled)[0]
            probability = self.model.predict_proba(input_scaled)[0]
            
            return {
                'risk_level': 'High Risk' if prediction == 1 else 'Low Risk',
                'confidence': float(max(probability)),
                'risk_probability': float(probability[1]),
                'features_used': self.feature_names
            }
        except Exception as e:
            return {'error': str(e)}

if __name__ == "__main__":
    predictor = DiseasePredictor()
    
    sample_data = {
        'temperature': 38.5,
        'humidity': 85,
        'rainfall': 25,
        'population_density': 800,
        'sanitation_score': 4,
        'previous_cases': 12,
        'vaccination_rate': 60,
        'healthcare_access': 4
    }
    
    result = predictor.predict(sample_data)
    print("Prediction Result:", result)
