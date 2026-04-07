
# employee_productivity_xgboost_model.py

import pandas as pd
import numpy as np
import pickle

from xgboost import XGBRegressor

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    r2_score,
    mean_squared_error,
    mean_absolute_error
)

# =====================================================
# LOAD DATA
# =====================================================

# Change filename if needed
df = pd.read_csv("employee_productivity_complete_5000_with_hire_date.csv")

print("Dataset Loaded Successfully")
print(f"Rows: {df.shape[0]}")
print(f"Columns: {df.shape[1]}")

# =====================================================
# DATA CLEANING
# =====================================================

# Remove duplicates
df.drop_duplicates(inplace=True)

# Drop unwanted date column if present
if "Hire_Date" in df.columns:
    df.drop(columns=["Hire_Date"], inplace=True)

if "Employee_ID" in df.columns:
    df.drop(columns=["Employee_ID"], inplace=True)

if "Resigned" in df.columns:
    # Convert 'True' / 'False' string or bools to 1/0
    df['Resigned'] = df['Resigned'].replace({True: 1, False: 0, "True": 1, "False": 0, "true": 1, "false": 0})
    df['Resigned'] = pd.to_numeric(df['Resigned'], errors='coerce').fillna(0)

# =====================================================
# FEATURE ENGINEERING
# =====================================================

# Safe division helper
def safe_divide(a, b):
    return np.where(b == 0, 0, a / b)

# Create engineered features
if "Years_At_Company" in df.columns and "Monthly_Salary" in df.columns:
    df["Experience_Salary_Interaction"] = (
        df["Years_At_Company"] * df["Monthly_Salary"]
    )

if "Work_Hours_Per_Week" in df.columns and "Projects_Handled" in df.columns:
    df["Workload_Intensity"] = safe_divide(
        df["Work_Hours_Per_Week"],
        df["Projects_Handled"]
    )

if "Overtime_Hours" in df.columns and "Work_Hours_Per_Week" in df.columns:
    df["Overtime_Work_Ratio"] = safe_divide(
        df["Overtime_Hours"],
        df["Work_Hours_Per_Week"]
    )

if "Sick_Days" in df.columns and "Work_Hours_Per_Week" in df.columns:
    df["SickDays_WorkDays_Ratio"] = safe_divide(
        df["Sick_Days"],
        df["Work_Hours_Per_Week"]
    )

# Replace inf values
df.replace([np.inf, -np.inf], np.nan, inplace=True)

# =====================================================
# TARGET + FEATURES
# =====================================================

target_column = "Performance_Score"

X = df.drop(columns=[target_column])
y = df[target_column]

# Identify column types
categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
numerical_cols = X.select_dtypes(exclude=["object"]).columns.tolist()

print("\nCategorical Columns:", categorical_cols)
print("Numerical Columns:", numerical_cols)

# Save the feature columns list for reference in main.py
all_feature_columns = {
    "categorical": categorical_cols,
    "numerical": numerical_cols
}
print("\nAll feature columns saved for API reference.")

# =====================================================
# PREPROCESSING PIPELINE
# =====================================================

numeric_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", MinMaxScaler())
    ]
)

categorical_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore"))
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numerical_cols),
        ("cat", categorical_transformer, categorical_cols)
    ]
)

# =====================================================
# TRAIN TEST SPLIT
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# =====================================================
# XGBOOST MODEL
# =====================================================

xgb_model = XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    min_child_weight=3,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="reg:squarederror",
    random_state=42
)

# Full pipeline
model_pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", xgb_model)
    ]
)

# =====================================================
# MODEL TRAINING
# =====================================================

print("\nTraining XGBoost Model...")
model_pipeline.fit(X_train, y_train)

print("Training Completed")

# =====================================================
# PREDICTION
# =====================================================

y_pred = model_pipeline.predict(X_test)

# =====================================================
# EVALUATION
# =====================================================

r2 = r2_score(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)

print("\n===== MODEL PERFORMANCE =====")
print(f"R2 Score  : {r2:.4f}")
print(f"MSE       : {mse:.4f}")
print(f"RMSE      : {rmse:.4f}")
print(f"MAE       : {mae:.4f}")

# =====================================================
# SAVE PICKLE FILE
# =====================================================

pickle_filename = "employee_productivity_xgboost.pkl"

with open(pickle_filename, "wb") as file:
    pickle.dump(model_pipeline, file)

print(f"\nModel saved successfully as '{pickle_filename}'")
print(f"\nFeature columns used:")
print(f"  Numerical : {numerical_cols}")
print(f"  Categorical: {categorical_cols}")
