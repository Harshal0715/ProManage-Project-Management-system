from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from sklearn.linear_model import LogisticRegression

app = FastAPI(title="Employee AI Workload Predictor")

# -----------------------------
# 1) Training dummy model (simple)
# -----------------------------
# Features = [pendingTasks, inProgressTasks, rejectedLeaves, approvedLeaves]
X_train = np.array([
    [0, 0, 0, 0],   # low
    [1, 0, 0, 0],   # low
    [2, 0, 0, 0],   # medium
    [0, 2, 0, 0],   # medium
    [3, 2, 0, 0],   # high
    [4, 3, 1, 0],   # high
    [5, 2, 1, 0],   # high
    [1, 1, 0, 1],   # low
    [2, 1, 1, 0],   # medium
])

y_train = np.array([
    0, 0, 1, 1, 2, 2, 2, 0, 1
])

model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

# labels mapping
labels = {0: "Low", 1: "Medium", 2: "High"}

# -----------------------------
# 2) Input body
# -----------------------------
class PredictionRequest(BaseModel):
    pendingTasks: int
    inProgressTasks: int
    rejectedLeaves: int
    approvedLeaves: int

@app.get("/")
def home():
    return {"message": "AI Workload Predictor Running ✅"}

@app.post("/predict")
def predict(req: PredictionRequest):
    X = np.array([[req.pendingTasks, req.inProgressTasks, req.rejectedLeaves, req.approvedLeaves]])
    pred = model.predict(X)[0]
    risk = labels[int(pred)]

    # Confidence score (approx)
    probs = model.predict_proba(X)[0]
    confidence = float(np.max(probs))

    return {
        "risk": risk,
        "confidence": round(confidence, 3)
    }
