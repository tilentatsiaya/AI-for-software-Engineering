print("STARTING MINIMAL TRAINING...")

try:
    # Basic imports
    import pandas as pd
    import numpy as np
    from sklearn.ensemble import RandomForestClassifier
    import joblib
    import os
    
    print("✅ All imports successful")
    
    # Create simple data
    print("Creating synthetic data...")
    np.random.seed(42)
    n_samples = 100
    
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
    print(f"✅ Created DataFrame with {len(df)} samples")
    
    # Simple target
    risk_score = (
        df['temperature'] * 0.1 +
        df['humidity'] * 0.05 +
        df['rainfall'] * 0.08 -
        df['sanitation_score'] * 0.2
    )
    df['outbreak_risk'] = (risk_score > risk_score.mean()).astype(int)
    
    print(f"Target distribution: {df['outbreak_risk'].value_counts().to_dict()}")
    
    # Train model
    print("Training model...")
    X = df.drop('outbreak_risk', axis=1)
    y = df['outbreak_risk']
    
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X, y)
    
    accuracy = model.score(X, y)
    print(f"✅ Model trained with accuracy: {accuracy:.3f}")
    
    # Save model
    print("Saving model...")
    os.makedirs('models', exist_ok=True)
    
    model_data = {
        'model': model,
        'feature_names': X.columns.tolist()
    }
    
    joblib.dump(model_data, 'models/minimal_model.joblib')
    print("✅ Model saved successfully!")
    
    # Verify file exists
    if os.path.exists('models/minimal_model.joblib'):
        file_size = os.path.getsize('models/minimal_model.joblib') / 1024
        print(f"✅ Model file exists! Size: {file_size:.1f} KB")
    else:
        print("❌ Model file was not created!")
    
except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()

print("TRAINING COMPLETED")
