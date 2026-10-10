# PrepX — Academic Audit & Personalized Skill-Gap Analysis

A full-stack, enterprise-grade web application built to help higher-education students analyze their academic performance, detect technical skill deficits against target industry career paths, and receive personalized recommendations for academic remediation and career readiness.

---

## 🌟 Key Features

### 1. 📊 Real-Time Student Dashboard
- **Key Performance Indicators (KPIs)**: Instant calculation of Overall Average Score (%), Weighted Grade Point Average (GPA / 10.0), Attendance Health, and Target Career Match (%).
- **Interactive Visualizations**: Dynamic Recharts Bar & Pie charts displaying subject scorecards against proficiency baselines (60% standard, 75% honors threshold).
- **Attendance Compliance Meter**: Real-time attendance gauge with automatic calculation of consecutive classes needed to recover from critical shortages (<75%).
- **Prioritized Recommendations**: Immediate display of the top 3 actionable tasks to improve grades and close skill gaps.

### 2. 🎓 Automated Academic Audit (Powered by Statistical & Pandas Engine)
- **Weighted GPA & Credits Aggregation**: Calculates weighted grade points across all semester courses.
- **Academic Standing Classification**: Categorizes performance into **Excellent** ($\ge 85\%$), **Good** ($70\% - 84\%$), **Average** ($55\% - 69\%$), or **Needs Improvement** ($< 55\%$).
- **Strengths & Weaknesses Identification**: Segregates strong subjects ($\ge 75\%$) from weak subjects ($< 60\%$) needing urgent faculty consultation or remediation.
- **Statistical Dispersion Analysis**: Calculates variance, standard deviation ($\sigma$), highest score, and lowest score.
- **Grade Distribution Breakdown**: Categorizes grades across UGC/AICTE 10-point scale ($O, A+, A, B+, B, C, F$).

### 3. 🎯 Skill-Gap Analysis & Career Role Pathways
- **Multi-Role Industry Profiles**: Built-in competency profiles for:
  - **Full-Stack Developer** (HTML, CSS, JavaScript, React, Node.js, Express.js, MongoDB, Git, REST APIs, etc.)
  - **Frontend Developer** (HTML, CSS, JavaScript, React, Tailwind CSS, TypeScript, Next.js, Figma, etc.)
  - **Backend Developer** (Python, Node.js, Express.js, SQL, PostgreSQL, MongoDB, Docker, Redis, System Design, etc.)
  - **Data Analyst** (Python, SQL, Pandas, NumPy, Power BI, Excel, Data Visualization, Statistics, etc.)
  - **Machine Learning Engineer** (Python, NumPy, Pandas, Scikit-Learn, TensorFlow, Deep Learning, Math/Stats, etc.)
  - **Cloud & DevOps Engineer** (Linux, Git, Docker, Kubernetes, AWS, CI/CD, Terraform, Bash, etc.)
- **Skill Normalization & Matrix Matching**: Automatically normalizes synonyms and aliases (e.g. `react.js` $\rightarrow$ `React`, `node` $\rightarrow$ `Node.js`).
- **Readiness Donut Gauge**: Calculates weighted readiness scores and highlights missing core vs. optional advanced skills.
- **Curated Learning Resources**: Direct links to official documentation, interactive courses, and recommended capstone projects.

### 4. 💡 Personalized Recommendations & 30-Day Recovery Roadmap
- **Subject-Specific Remediation**: Targeted study guides, lecture topics, and practice problem recommendations for weak subjects.
- **Structured 4-Phase Skill Roadmap**: Step-by-step milestones (Fundamentals $\rightarrow$ Frameworks $\rightarrow$ Database Integration $\rightarrow$ Portfolio Project).
- **30-Day Action Plan Checklist**: Daily and weekly milestones to guide student recovery.
- **AI / LLM Extensible Architecture**: Clean service hooks ready to connect to Google Gemini / OpenAI APIs for interactive generative tutoring.

### 5. 👥 Student Data Management (Full CRUD)
- Add, update, view, and delete student records.
- Dynamic subject marks editor with credit allocation.
- Manage technical skills and completed certifications.
- One-click dataset reset to restore verified sample student records.

### 6. 📄 Official Academic Dossier & Printable Report
- Comprehensive printable student transcript with institutional letterhead.
- Printable layout formatted via dedicated `@media print` CSS rules.
- Institutional sign-off section with signature and verification seal blocks.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Python 3.10+, Flask, Flask-CORS, PyMongo |
| **Data Analysis** | Pandas / Python Statistical Analysis Engine |
| **Database** | MongoDB (with automatic resilient Embedded DB fallback) |
| **Testing** | Pytest, Vite Build Tooling |

---

## 📁 Project Directory Structure

```
AI_CAMPUS_COMPANION/
│
├── backend/
│   ├── app.py                      # Flask Server Entrypoint & CORS configuration
│   ├── config.py                   # Environment configuration loader
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Sample environment configuration
│   ├── .env                        # Local environment variables
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── db.py                   # MongoDB manager with seamless in-memory fallback
│   │   └── seed_data.py            # Initial dataset (5 sample students + 6 career roles)
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── student_model.py        # Student schema validation & serialization
│   │   └── career_model.py         # Career role schema validation
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── academic_service.py     # Academic Audit & Pandas statistical calculations
│   │   ├── skill_gap_service.py    # Skill matching, normalization & gap evaluation
│   │   └── recommendation_service.py # Personalized remediation & 30-day roadmap engine
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── student_routes.py       # CRUD endpoints (/api/students)
│   │   ├── academic_routes.py      # Academic audit endpoints (/api/academic)
│   │   ├── skill_routes.py         # Skill gap analysis endpoints (/api/skills)
│   │   ├── career_routes.py        # Career role endpoints (/api/careers)
│   │   ├── recommendation_routes.py# Personalized recommendations (/api/recommendations)
│   │   └── report_routes.py        # Student Dossier report endpoint (/api/reports)
│   │
│   └── tests/
│       └── test_services.py        # Unit tests for audit & skill gap algorithms
│
├── frontend/
│   ├── package.json                # Frontend dependencies & scripts
│   ├── vite.config.js              # Vite server & build settings
│   ├── tailwind.config.js          # Tailwind CSS theme & tokens
│   ├── postcss.config.js           # PostCSS configuration
│   ├── index.html                  # HTML entry point
│   │
│   └── src/
│       ├── main.jsx                # React root mount
│       ├── App.jsx                 # Main layout & router
│       ├── index.css               # Global styles, glassmorphism & print formatting
│       ├── api/
│       │   └── client.js           # Centralized Fetch API client
│       ├── context/
│       │   └── StudentContext.jsx  # Global application state provider
│       └── components/
│           ├── Navbar.jsx          # Header with student selector & live DB status
│           ├── Sidebar.jsx         # Navigation sidebar
│           ├── Dashboard/          # Dashboard charts & KPI widgets
│           ├── AcademicAudit/      # Statistical scorecard & grade distributions
│           ├── SkillGap/           # Career role selector, gauge & missing skill matrix
│           ├── Recommendations/    # Actionable plans & 30-day roadmap
│           ├── StudentManagement/  # Student CRUD list & modal form
│           └── Reports/            # Printable official student transcript
│
└── README.md                       # Complete documentation & run guide
```

---

## 🚀 Step-by-Step Installation & Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Python**: v3.10 or higher ([Download Python](https://www.python.org/))
- **MongoDB (Optional)**: If you have MongoDB installed locally or on MongoDB Atlas, the backend connects automatically. If MongoDB is not installed, the built-in database fallback runs seamlessly without requiring any database installation!

---

### 2. Backend Setup & Run

1. Open a terminal and navigate to the project directory:
   ```bash
   cd c:/Users/shobi/OneDrive/Desktop/AI_CAMPUS_COMPANION/backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Or install core packages directly: `pip install Flask Flask-Cors pymongo mongomock pytest python-dotenv`)*

3. (Optional) Configure MongoDB connection in `backend/.env`:
   ```env
   PORT=5000
   DEBUG=True
   MONGO_URI=mongodb://localhost:27017/campus_companion
   DB_NAME=campus_companion
   ```

4. Run unit tests to verify algorithms:
   ```bash
   python -m pytest tests/test_services.py -v
   ```

5. Start the Flask Backend Server:
   ```bash
   python app.py
   ```
   *The backend will start on **`http://localhost:5000`** and auto-seed sample student data.*

---

### 3. Frontend Setup & Run

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd c:/Users/shobi/OneDrive/Desktop/AI_CAMPUS_COMPANION/frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   **`http://localhost:5173`**

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend and Database connection health check |
| `GET` | `/api/students` | Get list of all student profiles |
| `GET` | `/api/students/<student_id>` | Get details of a specific student by ID or Roll Number |
| `POST` | `/api/students` | Create a new student profile |
| `PUT` | `/api/students/<student_id>` | Update an existing student profile |
| `DELETE`| `/api/students/<student_id>` | Delete a student record |
| `POST` | `/api/students/reset` | Reset database back to default sample dataset |
| `GET` | `/api/academic/audit/<student_id>` | Run automated academic audit on student marks |
| `GET` | `/api/skills/gap-analysis/<student_id>?role=<role_id>` | Run career skill gap analysis against chosen role |
| `GET` | `/api/careers/roles` | Get all career role definitions and skill roadmaps |
| `GET` | `/api/recommendations/<student_id>?role=<role_id>` | Generate prioritized improvement recommendations |
| `GET` | `/api/reports/student/<student_id>?role=<role_id>` | Get unified student dossier for printable transcript |

---

## 🧪 Testing Verification

Run the automated backend test suite with:
```bash
python -m pytest backend/tests/test_services.py -v
```

All test cases verify:
- Accurate UGC 10-point grade conversions.
- Attendance compliance status and deficit recovery calculations.
- Pandas-based academic audit metrics, GPA, and strong/weak categorization.
- Skill normalization and career readiness percentage scoring.
- Personalized recommendation prioritization rules.
- Student model schema validation.

---

## 📄 License
MIT License. Built for collegiate academic performance auditing and personalized career readiness.
