import os
import numpy as np
import joblib
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "models")
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")

# simple synthetic dataset to fit a model so predict_proba works
X = np.array([[30,50,0,100,8,0,90,7],
              [40,80,50,1000,4,20,30,3],
              [25,40,5,50,9,0,95,9]])
y = np.array([0,1,0])

pipe = make_pipeline(StandardScaler(), LogisticRegression())
pipe.fit(X, y)
joblib.dump(pipe, MODEL_PATH)
print("Wrote dummy model to", MODEL_PATH)