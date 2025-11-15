import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
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
            random_state=42,
            min_samples_split=5,
            min_samples_leaf=2
        )
        self.scaler = StandardScaler()
        self.feature_names = []
        
    def generate_synthetic_data(self, n_samples=10000):
        """Generate realistic synthetic health data for training"""
        print("🔄 Generating synthetic training data...")
        np.random.seed(42)
        
        # Generate realistic data distributions
        data = {
            'temperature': np.random.normal(37.0, 1.2, n_samples),  # Normal body temp with variation
            'humidity': np.random.normal(65, 20, n_samples),       # Typical humidity range
            'rainfall': np.random.exponential(12, n_samples),      # Rainfall often exponential
            'population_density': np.random.normal(600, 300, n_samples),  # Population density
            'sanitation_score': np.random.normal(6.5, 2.0, n_samples),    # Sanitation quality
            'previous_cases': np.random.poisson(8, n_samples),     # Previous cases as Poisson
            'vaccination_rate': np.random.normal(70, 18, n_samples),      # Vaccination rates
            'healthcare_access': np.random.normal(5.8, 2.2, n_samples)    # Healthcare access
        }
        
        df = pd.DataFrame(data)
        
        # Ensure realistic bounds
        df['temperature'] = np.clip(df['temperature'], 35, 42)
        df['humidity'] = np.clip(df['humidity'], 10, 100)
        df['rainfall'] = np.clip(df['rainfall'], 0, 100)
        df['population_density'] = np.clip(df['population_density'], 50, 2000)
        df['sanitation_score'] = np.clip(df['sanitation_score'], 1, 10)
        df['previous_cases'] = np.clip(df['previous_cases'], 0, 50)
        df['vaccination_rate'] = np.clip(df['vaccination_rate'], 20, 100)
        df['healthcare_access'] = np.clip(df['healthcare_access'], 1, 10)
        
        # Create realistic outbreak risk based on epidemiological factors
        risk_factors = (
            (df['temperature'] - 36.5) * 0.15 +           # Higher temp increases risk
            (df['humidity'] - 50) * 0.08 +               # High humidity increases risk
            df['rainfall'] * 0.06 +                      # More rainfall increases risk
            (df['population_density'] - 300) * 0.0008 +  # Denser population increases risk
            (10 - df['sanitation_score']) * 0.25 +       # Lower sanitation increases risk
            df['previous_cases'] * 0.18 +                # Previous cases increase risk
            (100 - df['vaccination_rate']) * 0.015 +     # Lower vaccination increases risk
            (10 - df['healthcare_access']) * 0.12        # Lower healthcare access increases risk
        )
        
        # Add some noise and normalize
        noise = np.random.normal(0, 0.5, n_samples)
        risk_score = risk_factors + noise
        
        # Create classes: Low (0), Medium (1), High (2) risk
        df['outbreak_risk'] = 0  # Low risk by default
        
        # Set medium risk (top 40-70%)
        medium_threshold = np.percentile(risk_score, 60)
        df.loc[risk_score > medium_threshold, 'outbreak_risk'] = 1
        
        # Set high risk (top 30%)
        high_threshold = np.percentile(risk_score, 70)
        df.loc[risk_score > high_threshold, 'outbreak_risk'] = 2
        
        print(f"✅ Generated {n_samples} samples with risk distribution:")
        print(f"   Low Risk: {(df['outbreak_risk'] == 0).sum()} samples")
        print(f"   Medium Risk: {(df['outbreak_risk'] == 1).sum()} samples")
        print(f"   High Risk: {(df['outbreak_risk'] == 2).sum()} samples")
        
        return df
    
    def preprocess_data(self, df):
        """Preprocess the data for training"""
        print("🔄 Preprocessing data...")
        
        # Separate features and target
        features = df.drop('outbreak_risk', axis=1)
        target = df['outbreak_risk']
        
        self.feature_names = features.columns.tolist()
        print(f"📊 Features used: {self.feature_names}")
        
        # Scale features
        features_scaled = self.scaler.fit_transform(features)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            features_scaled, target, 
            test_size=0.2, 
            random_state=42,
            stratify=target
        )
        
        print(f"📈 Training set: {X_train.shape[0]} samples")
        print(f"📊 Test set: {X_test.shape[0]} samples")
        
        return X_train, X_test, y_train, y_test
    
    def train(self):
        """Train the Random Forest model"""
        print("🚀 Starting model training...")
        
        # Generate and preprocess data
        df = self.generate_synthetic_data(15000)  # More samples for better training
        X_train, X_test, y_train, y_test = self.preprocess_data(df)
        
        # Train the model
        print("🤖 Training Random Forest classifier...")
        self.model.fit(X_train, y_train)
        
        # Make predictions
        y_pred = self.model.predict(X_test)
        
        # Evaluate model
        accuracy = accuracy_score(y_test, y_pred)
        
        print("\n" + "="*50)
        print("🎯 MODEL TRAINING RESULTS")
        print("="*50)
        print(f"📊 Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        print(f"🏆 Model: Random Forest (n_estimators=100)")
        
        print("\n📋 Classification Report:")
        print(classification_report(y_test, y_pred, 
                                  target_names=['Low Risk', 'Medium Risk', 'High Risk']))
        
        print("📈 Confusion Matrix:")
        cm = confusion_matrix(y_test, y_pred)
        print(cm)
        
        # Feature importance
        print("\n🔍 Feature Importance:")
        feature_importance = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print(feature_importance)
        
        return accuracy
    
    def save_model(self, model_path='models/disease_predictor.joblib'):
        """Save the trained model and scaler"""
        import os
        os.makedirs('models', exist_ok=True)
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'model_info': {
                'type': 'RandomForestClassifier',
                'n_estimators': 100,
                'max_depth': 10,
                'features': self.feature_names
            }
        }
        
        joblib.dump(model_data, model_path)
        print(f"💾 Model saved to: {model_path}")
        print(f"📁 Model size: {os.path.getsize(model_path) / 1024 / 1024:.2f} MB")
    
    def load_model(self, model_path='models/disease_predictor.joblib'):
        """Load a trained model"""
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        model_data = joblib.load(model_path)
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.feature_names = model_data['feature_names']
        print(f"📂 Model loaded from: {model_path}")
        print(f"🔧 Model type: {model_data['model_info']['type']}")

def main():
    """Main function to train and save the model"""
    print("🦠 DISEASE OUTBREAK PREDICTION MODEL TRAINING")
    print("="*60)
    
    try:
        # Create and train model
        predictor = DiseaseOutbreakPredictor()
        accuracy = predictor.train()
        
        # Save model
        predictor.save_model()
        
        print("\n✅ Training completed successfully!")
        print(f"🎯 Final Accuracy: {accuracy*100:.2f}%")
        print("📁 Model saved in 'models/disease_predictor.joblib'")
        
        # Test prediction with sample data
        print("\n🧪 Testing model with sample data...")
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
        
        # Convert to DataFrame and scale
        sample_df = pd.DataFrame([sample_data])
        sample_scaled = predictor.scaler.transform(sample_df)
        
        # Make prediction
        prediction = predictor.model.predict(sample_scaled)[0]
        probability = predictor.model.predict_proba(sample_scaled)[0]
        
        risk_levels = ['Low Risk', 'Medium Risk', 'High Risk']
        
        print(f"📊 Sample Prediction:")
        print(f"   Input: {sample_data}")
        print(f"   Predicted Risk: {risk_levels[prediction]}")
        print(f"   Probabilities: Low={probability[0]:.3f}, Medium={probability[1]:.3f}, High={probability[2]:.3f}")
        
    except Exception as e:
        print(f"❌ Error during training: {e}")
        raise

if __name__ == "__main__":
    main()