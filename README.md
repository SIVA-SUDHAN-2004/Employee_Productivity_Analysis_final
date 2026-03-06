📊 Employee Productivity Prediction System (MERN + ML)

A full-stack MERN dashboard application that allows managers to upload employee datasets (CSV/Excel), manage employee records, and predict employee productivity using a trained Machine Learning model served by a Python FastAPI microservice.

This system integrates:

React.js dashboard

Node.js/Express backend

MongoDB for employee & user data

Python FastAPI microservice for ML predictions

Secure JWT authentication

Advanced analytics & charts

🚀 Features
👤 Authentication

Manager registration and login

JWT-based secure authentication

Protected routes across backend + frontend

📥 CSV / Excel Upload

Upload CSV or XLSX files containing employee data

Automatic parsing, validation & storage in MongoDB

Displays a preview sample after upload

🧾 Employee Management

View Employees (with pagination)

Add new employees

Edit employees

Delete employees

Predict productivity score for:

A single employee

All employees (batch prediction)

🧠 Machine Learning Model (FastAPI microservice)

Predicts employee productivity using real model (productivity_model.pkl)

Supports:

/predict (single record)

/predict-batch (multiple employees)

📈 Analytics Dashboard

Average productivity

Top performers

Department-wise statistics

Charts:

Bar chart: Productivity by employee

Scatter plot: Hours vs Productivity

Pie chart: Department distribution

🖥️ Modern UI

Tailwind CSS powered dashboard

Sidebar navigation

Responsive layout

Clean & minimal design

🧱 Project Structure


employee-productivity-mern/
│
├── server/                     # Node.js backend
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Employee.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── errorHandler.js
│   └── ml/
│       └── productivityModel.js      # Python ML service client
│
├── client/                     # React frontend (Vite)
│   ├── package.json
│   ├── index.html
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   ├── axiosInstance.js
│       │   ├── authApi.js
│       │   ├── employeeApi.js
│       │   └── analyticsApi.js
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── components/
│       │   ├── Layout/Sidebar.jsx
│       │   ├── Layout/Navbar.jsx
│       │   ├── Layout/ProtectedRoute.jsx
│       │   ├── Upload/CSVUpload.jsx
│       │   ├── Employees/EmployeeTable.jsx
│       │   ├── Charts/
│       │   │   ├── ProductivityBarChart.jsx
│       │   │   ├── DepartmentPieChart.jsx
│       │   │   └── HoursVsProductivityScatter.jsx
│       │   ├── Common/Card.jsx
│       │   └── Common/StatTile.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── UploadPage.jsx
│       │   ├── EmployeesPage.jsx
│       │   ├── AnalyticsPage.jsx
│       │   ├── ProfilePage.jsx
│       │   └── NotFoundPage.jsx
│       └── styles/
│
└── ml_service/                 # Python FastAPI ML microservice
    ├── main.py
    ├── productivity_model.pkl
    └── requirements.txt


🛠️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/YOUR-REPO/employee-productivity-mern.git
cd employee-productivity-mern

2️⃣ Backend (Node.js / Express)
Install dependencies
cd server
npm install

Create .env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
ML_SERVICE_URL=http://localhost:8000

Start backend
npm run dev


Backend starts at:

http://localhost:5000

3️⃣ ML Microservice (FastAPI)
Install Python packages
cd ml_service
pip install -r requirements.txt

Start FastAPI app
uvicorn main:app --reload --port 8000


ML API runs at:

http://localhost:8000

4️⃣ Frontend (React + Vite)
Install dependencies
cd client
npm install

Start React app
npm run dev


Frontend runs at:

http://localhost:5173

🔗 API Summary
Auth
Method	Endpoint	Description
POST	/api/auth/register	Register manager
POST	/api/auth/login	Login & get JWT
Employees
Method	Endpoint	Description
POST	/api/employees/upload-csv	Upload CSV/XLSX
GET	/api/employees?page=1&limit=50	Get employees (paginated)
POST	/api/employees	Add employee
PUT	/api/employees/:id	Update employee
DELETE	/api/employees/:id	Delete employee
POST	/api/employees/:id/predict	Predict one
POST	/api/employees/predict	Predict many
Analytics
Method	Endpoint	Description
GET	/api/analytics/summary	Dashboard stats
GET	/api/analytics/department	Department-level insights
ML Microservice
Method	Endpoint	Description
POST	/predict	Predict single employee
POST	/predict-batch	Predict multiple employees
📄 CSV Format Example

Valid CSV columns:

employeeId,name,department,role,experienceYears,age,avgHoursPerDay,tasksCompletedPerWeek,overtimeHoursPerWeek,absentDaysPerMonth
E001,John Doe,IT,Developer,3,28,7,25,4,1
E002,Alice,HR,Manager,5,34,8,30,3,0


Note: Excel files (.xlsx) are supported too.

🖼️ Screenshots (Optional)

Add screenshots here:

/screenshots
  ├── login.png
  ├── dashboard.png
  ├── employees.png
  ├── analytics.png

🚀 Deployment Notes
Backend

Deploy to:

Render

Railway

AWS EC2

Azure App Service

Frontend

Netlify

Vercel

ML Microservice

Render Web Service

Railway

Docker + EC2

Make sure the backend has access to the ML service via:

ML_SERVICE_URL = https://your-ml-domain.com
