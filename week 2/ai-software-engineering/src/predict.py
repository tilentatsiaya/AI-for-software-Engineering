import joblib
import pandas as pd
import numpy as np
import os

class DiseasePredictor:
    def __init__(self, model_path='models/disease_predictor.joblib'):
        self.model_path = model_path
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.load_model()
    
    def load_model(self):
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model file not found at {self.model_path}")
            
            model_data = joblib.load(self.model_path)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            print(f"✅ Model loaded successfully from {self.model_path}")
            print(f"��� Features: {self.feature_names}")
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            raise
    
    def predict(self, input_data):
        try:
            # Check for missing features
            missing_features = set(self.feature_names) - set(input_data.keys())
            if missing_features:
                return {'error': f'Missing features: {missing_features}'}
            
            # Create DataFrame with correct feature order
            input_df = pd.DataFrame([input_data])[self.feature_names]
            
            # Scale features
            input_scaled = self.scaler.transform(input_df)
            
            # Make prediction
            prediction = self.model.predict(input_scaled)[0]
            probability = self.model.predict_proba(input_scaled)[0]
            
            risk_levels = ['Low Risk', 'High Risk']
            
            return {
                'risk_level': risk_levels[prediction],
                'confidence': float(max(probability)),
                'probabilities': {
                    'low_risk': float(probability[0]),
                    'high_risk': float(probability[1])
                },
                'feature_importance': dict(zip(self.feature_names, self.model.feature_importances_))
            }
        except Exception as e:
            return {'error': str(e)}

# Test the predictor
if __name__ == "__main__":
    print("��� TESTING DISEASE PREDICTION MODEL")
    print("=" * 40)
    
    try:
        predictor = DiseasePredictor()
        
        # Test with different scenarios
        test_cases = [
            {
                'name': 'High Risk Scenario',
                'data': {
                    'temperature': 38.5,
                    'humidity': 85,
                    'rainfall': 25,
                    'population_density': 800,
                    'sanitation_score': 4,
                    'previous_cases': 12,
                    'vaccination_rate': 60,
                    'healthcare_access': 4
                }
            },
            {
                'name': 'Low Risk Scenario', 
                'data': {
                    'temperature': 36.5,
                    'humidity': 50,
                    'rainfall': 5,
                    'population_density': 300,
                    'sanitation_score': 8,
                    'previous_cases': 2,
                    'vaccination_rate': 85,
                    'healthcare_access': 7
                }
            }
        ]
        
        for test_case in test_cases:
            print(f"\\n��� {test_case['name']}:")
            print(f"Input: {test_case['data']}")
            
            result = predictor.predict(test_case['data'])
            
            if 'error' in result:
                print(f"❌ Error: {result['error']}")
            else:
                print(f"��� Risk Level: {result['risk_level']}")
                print(f"��� Confidence: {result['confidence']:.3f}")
                print(f"��� Probabilities: {result['probabilities']}")
                
        print("\\n✅ All tests completed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")


