from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# Trigger hot reload
from pydantic import BaseModel
from typing import List
from pathlib import Path
import joblib
import pickle
import numpy as np
import pandas as pd

app = FastAPI(title="Employee Productivity Prediction API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------- LOAD MODEL PIPELINE ----------------------
try:
    with open("employee_productivity_xgboost.pkl", "rb") as f:
        model_pipeline = pickle.load(f)
    print("✅ XGBoost model pipeline loaded successfully!")
except Exception as e:
    print("❌ Error loading model pipeline:", e)
    model_pipeline = None

# ---------------------- Pydantic Models ----------------------
class Employee(BaseModel):
    Department: str
    Gender: str
    Age: int
    Job_Title: str
    Years_At_Company: int
    Education_Level: str
    Monthly_Salary: float
    Work_Hours_Per_Week: float
    Projects_Handled: int
    Overtime_Hours: float
    Sick_Days: float
    Remote_Work_Frequency: float
    Team_Size: int
    Training_Hours: float
    Promotions: int
    Employee_Satisfaction_Score: float
    Resigned: int

class EmployeeRequest(BaseModel):
    employee: Employee

class EmployeeBatchRequest(BaseModel):
    employees: List[Employee]

# ---------------------- HELPER FUNCTION ----------------------
def safe_divide(a: float, b: float) -> float:
    """Safe division that returns 0 when denominator is 0."""
    return 0.0 if b == 0 else a / b


def preprocess_employee(emp: Employee) -> dict:
    """Convert Employee object to dict with engineered features matching XGBoost training."""
    data = {
        "Department": emp.Department,
        "Gender": emp.Gender,
        "Age": emp.Age,
        "Job_Title": emp.Job_Title,
        "Years_At_Company": emp.Years_At_Company,
        "Education_Level": emp.Education_Level,
        "Monthly_Salary": emp.Monthly_Salary,
        "Work_Hours_Per_Week": emp.Work_Hours_Per_Week,
        "Projects_Handled": emp.Projects_Handled,
        "Overtime_Hours": emp.Overtime_Hours,
        "Sick_Days": emp.Sick_Days,
        "Remote_Work_Frequency": emp.Remote_Work_Frequency,
        "Team_Size": emp.Team_Size,
        "Training_Hours": emp.Training_Hours,
        "Promotions": emp.Promotions,
        "Employee_Satisfaction_Score": emp.Employee_Satisfaction_Score,
        "Resigned": emp.Resigned,
        # Engineered features — must match employee_productivity_xgboost_model.py
        "Experience_Salary_Interaction": emp.Years_At_Company * emp.Monthly_Salary,
        "Workload_Intensity": safe_divide(emp.Work_Hours_Per_Week, emp.Projects_Handled),
        "Overtime_Work_Ratio": safe_divide(emp.Overtime_Hours, emp.Work_Hours_Per_Week),
        "SickDays_WorkDays_Ratio": safe_divide(emp.Sick_Days, emp.Work_Hours_Per_Week),
    }
    return data

# ---------------------- PREDICTION ENDPOINTS ----------------------
@app.post("/predict")
def predict_productivity(req: EmployeeRequest):
    if model_pipeline is None:
        raise HTTPException(status_code=500, detail="Model pipeline not loaded")

    try:
        emp_data = preprocess_employee(req.employee)
        df = pd.DataFrame([emp_data])  # one-row DataFrame
        prediction = model_pipeline.predict(df)[0]
        return {"Predicted_Performance_Score": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {e}")


@app.post("/predict-batch")
def predict_productivity_batch(req: EmployeeBatchRequest):
    if model_pipeline is None:
        raise HTTPException(status_code=500, detail="Model pipeline not loaded")

    try:
        rows = [preprocess_employee(emp) for emp in req.employees]
        
        df = pd.DataFrame(rows)
        preds = model_pipeline.predict(df)
        return {
            "scores": [float(p) for p in preds]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during batch prediction: {e}")
