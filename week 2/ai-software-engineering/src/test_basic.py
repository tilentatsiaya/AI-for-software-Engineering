print("=== BASIC PYTHON TEST ===")
print("Testing imports...")

try:
    import pandas as pd
    print("✅ pandas imported")
except ImportError as e:
    print(f"❌ pandas import failed: {e}")

try:
    import numpy as np
    print("✅ numpy imported")
except ImportError as e:
    print(f"❌ numpy import failed: {e}")

try:
    from sklearn.ensemble import RandomForestClassifier
    print("✅ scikit-learn imported")
except ImportError as e:
    print(f"❌ scikit-learn import failed: {e}")

try:
    import joblib
    print("✅ joblib imported")
except ImportError as e:
    print(f"❌ joblib import failed: {e}")

print("Testing basic operations...")
try:
    import numpy as np
    X = np.random.rand(10, 5)
    y = np.random.randint(0, 2, 10)
    model = RandomForestClassifier(n_estimators=5)
    model.fit(X, y)
    print("✅ Basic model training works")
    
    import os
    os.makedirs('models', exist_ok=True)
    import joblib
    joblib.dump(model, 'models/test_model.joblib')
    print("✅ Model saving works")
    
except Exception as e:
    print(f"❌ Basic operations failed: {e}")

print("=== TEST COMPLETED ===")
