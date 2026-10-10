"""
Seed data for AI Campus Companion.
Provides realistic student profiles and standardized career role competency requirements.
"""
from werkzeug.security import generate_password_hash

CAREER_ROLES = [
    {
        "id": "full_stack_dev",
        "title": "Full-Stack Developer",
        "category": "Web Development",
        "description": "Designs, builds, and maintains both client-side and server-side web applications and APIs.",
        "core_skills": [
            "HTML", "CSS", "JavaScript", "React", "Node.js", 
            "Express.js", "MongoDB", "Git", "REST APIs"
        ],
        "advanced_skills": [
            "TypeScript", "Docker", "Redux", "Tailwind CSS", "Next.js", "GraphQL"
        ],
        "learning_resources": [
            {"title": "The Odin Project - Full Stack JavaScript", "url": "https://www.theodinproject.com/", "type": "Interactive Course"},
            {"title": "MDN Web Docs - Web Developer Guide", "url": "https://developer.mozilla.org/", "type": "Documentation"},
            {"title": "FullStackOpen by University of Helsinki", "url": "https://fullstackopen.com/", "type": "Free University Course"},
            {"title": "Node.js & Express Documentation", "url": "https://expressjs.com/", "type": "Documentation"}
        ],
        "project_ideas": [
            "Campus Event Management Portal with User Authentication and Ticket Booking",
            "Real-time Collaborative Code Editor using WebSocket and MERN stack",
            "Student Peer Mentorship and Q&A Forum with Upvoting and Search"
        ]
    },
    {
        "id": "frontend_dev",
        "title": "Frontend Developer",
        "category": "Web Development",
        "description": "Specializes in building responsive, accessible, and high-performance interactive user interfaces.",
        "core_skills": [
            "HTML", "CSS", "JavaScript", "React", "Tailwind CSS", 
            "TypeScript", "Git", "Responsive Design"
        ],
        "advanced_skills": [
            "Next.js", "Redux", "GraphQL", "Figma", "Jest", "Web Performance Optimization"
        ],
        "learning_resources": [
            {"title": "React Official Documentation", "url": "https://react.dev/", "type": "Documentation"},
            {"title": "CSS-Tricks Guides & Flexbox/Grid", "url": "https://css-tricks.com/", "type": "Reference"},
            {"title": "TypeScript Handbook", "url": "https://www.typescriptlang.org/docs/", "type": "Documentation"}
        ],
        "project_ideas": [
            "Interactive Academic Grade Predictor and Animated Dashboard",
            "Accessible Campus Map and Virtual Tour Interface with Mapbox",
            "Component Library & Design System with Storybook"
        ]
    },
    {
        "id": "backend_dev",
        "title": "Backend Developer",
        "category": "Software Engineering",
        "description": "Architects reliable backend servers, robust microservices, database schemas, and REST/gRPC APIs.",
        "core_skills": [
            "Python", "Node.js", "Express.js", "MongoDB", "SQL", 
            "REST APIs", "Git", "Docker"
        ],
        "advanced_skills": [
            "Redis", "FastAPI", "PostgreSQL", "System Design", "Microservices", "AWS"
        ],
        "learning_resources": [
            {"title": "Backend Engineering Roadmap", "url": "https://roadmap.sh/backend", "type": "Roadmap"},
            {"title": "Designing Data-Intensive Applications", "url": "https://dataintensive.net/", "type": "Book"},
            {"title": "PostgreSQL Official Documentation & Tutorials", "url": "https://www.postgresql.org/docs/", "type": "Documentation"}
        ],
        "project_ideas": [
            "High-Throughput Academic Audit Service with Redis Caching and Rate Limiting",
            "Secure OAuth2 / JWT Single Sign-On Microservice for Campus Portals",
            "Automated Code Evaluation and Sandbox Execution Engine"
        ]
    },
    {
        "id": "data_analyst",
        "title": "Data Analyst",
        "category": "Data Science & Analytics",
        "description": "Inspects, cleans, transforms, and models data to uncover meaningful insights and empower decisions.",
        "core_skills": [
            "Python", "SQL", "Pandas", "NumPy", "Excel", 
            "Data Visualization", "Power BI", "Statistics"
        ],
        "advanced_skills": [
            "Tableau", "R", "Machine Learning Basics", "Git", "Data Storytelling"
        ],
        "learning_resources": [
            {"title": "Kaggle Learn - Pandas, SQL & Data Visualization", "url": "https://www.kaggle.com/learn", "type": "Interactive Courses"},
            {"title": "Khan Academy - Probability & Statistics", "url": "https://www.khanacademy.org/math/statistics-probability", "type": "Tutorials"},
            {"title": "Mode Analytics SQL Tutorial", "url": "https://mode.com/sql-tutorial/", "type": "Tutorials"}
        ],
        "project_ideas": [
            "University Semester Marks Exploratory Data Analysis & Attrition Predictor",
            "Campus Placement Trends & Salary Insight Dashboard in Power BI",
            "Student Study Habits & Exam Performance Correlation Analysis"
        ]
    },
    {
        "id": "ml_engineer",
        "title": "Machine Learning Engineer",
        "category": "Artificial Intelligence",
        "description": "Researches, trains, evaluates, and deploys predictive and generative machine learning models.",
        "core_skills": [
            "Python", "NumPy", "Pandas", "Scikit-Learn", "TensorFlow", 
            "Deep Learning", "Mathematics & Statistics", "Git"
        ],
        "advanced_skills": [
            "PyTorch", "MLOps", "Computer Vision", "NLP", "Docker", "Flask / FastAPI"
        ],
        "learning_resources": [
            {"title": "Fast.ai - Practical Deep Learning for Coders", "url": "https://course.fast.ai/", "type": "Free Course"},
            {"title": "Coursera - Deep Learning Specialization by Andrew Ng", "url": "https://www.coursera.org/", "type": "Course"},
            {"title": "Scikit-Learn User Guide", "url": "https://scikit-learn.org/stable/", "type": "Documentation"}
        ],
        "project_ideas": [
            "AI Automated Subject Grade Predictor and Early Dropout Warning System",
            "Smart Resume & Skill Matcher for Campus Placements",
            "Automated Handwritten Exam Answer Sheet OCR and Evaluator"
        ]
    },
    {
        "id": "devops_cloud_engineer",
        "title": "Cloud & DevOps Engineer",
        "category": "Infrastructure & Operations",
        "description": "Automates software delivery, provisions cloud infrastructure, and ensures system scalability & uptime.",
        "core_skills": [
            "Linux", "Git", "Docker", "Kubernetes", "AWS", 
            "CI/CD", "Bash", "Networking"
        ],
        "advanced_skills": [
            "Terraform", "Ansible", "Prometheus", "GCP", "Python", "Kubernetes Helm"
        ],
        "learning_resources": [
            {"title": "DevOps Roadmap", "url": "https://roadmap.sh/devops", "type": "Roadmap"},
            {"title": "Docker Official Getting Started Guide", "url": "https://docs.docker.com/get-started/", "type": "Documentation"},
            {"title": "Kubernetes the Hard Way", "url": "https://github.com/kelseyhightower/kubernetes-the-hard-way", "type": "Hands-on Guide"}
        ],
        "project_ideas": [
            "Multi-tier Campus Application Automated Deployment with GitHub Actions CI/CD and Docker",
            "Kubernetes Cluster Monitoring and Alerting Dashboard with Prometheus & Grafana",
            "Infrastructure as Code (IaC) Campus Cloud Lab with Terraform"
        ]
    }
]

SAMPLE_STUDENTS = [
    {
        "id": "STU001",
        "name": "Neha",
        "roll_number": "24CS001",
        "email": "neha@campus.edu",
        "password_hash": generate_password_hash("123456"),
        "semester": 6,
        "department": "Computer Science & Engineering",
        "target_role": "full_stack_dev",
        "attendance_percentage": 78.5,
        "technical_skills": ["HTML", "CSS", "JavaScript", "Python", "Git", "SQL"],
        "completed_courses": [
            "Responsive Web Design (freeCodeCamp)",
            "Python for Everybody (Coursera)"
        ],
        "subjects": [
            {"code": "CS601", "name": "Data Structures & Algorithms", "marks": 86, "credits": 4},
            {"code": "CS602", "name": "Database Management Systems (DBMS)", "marks": 58, "credits": 4},
            {"code": "CS603", "name": "Operating Systems", "marks": 74, "credits": 3},
            {"code": "CS604", "name": "Computer Networks", "marks": 68, "credits": 3},
            {"code": "CS605", "name": "Web Technologies", "marks": 91, "credits": 3},
            {"code": "CS606", "name": "Software Engineering", "marks": 79, "credits": 3}
        ]
    },
    {
        "id": "STU002",
        "name": "Priya Patel",
        "roll_number": "21CS089",
        "email": "priya.patel@campus.edu",
        "semester": 6,
        "department": "Computer Science & Engineering",
        "target_role": "data_analyst",
        "attendance_percentage": 92.0,
        "technical_skills": ["Python", "SQL", "Pandas", "Excel", "Data Visualization", "NumPy", "Git"],
        "completed_courses": [
            "Google Data Analytics Professional Certificate",
            "SQL for Data Science (Coursera)"
        ],
        "subjects": [
            {"code": "CS601", "name": "Data Structures & Algorithms", "marks": 72, "credits": 4},
            {"code": "CS602", "name": "Database Management Systems (DBMS)", "marks": 94, "credits": 4},
            {"code": "CS607", "name": "Probability & Statistics", "marks": 90, "credits": 3},
            {"code": "CS608", "name": "Data Mining & Warehousing", "marks": 88, "credits": 3},
            {"code": "CS603", "name": "Operating Systems", "marks": 65, "credits": 3},
            {"code": "CS604", "name": "Computer Networks", "marks": 71, "credits": 3}
        ]
    },
    {
        "id": "STU003",
        "name": "Rohan Varma",
        "roll_number": "22IT015",
        "email": "rohan.varma@campus.edu",
        "semester": 4,
        "department": "Information Technology",
        "target_role": "ml_engineer",
        "attendance_percentage": 68.0,
        "technical_skills": ["Python", "C++", "Mathematics & Statistics", "NumPy", "Git"],
        "completed_courses": [
            "Deep Learning Specialization (DeepLearning.AI)"
        ],
        "subjects": [
            {"code": "IT401", "name": "Data Structures", "marks": 80, "credits": 4},
            {"code": "IT402", "name": "Linear Algebra & Statistics", "marks": 85, "credits": 4},
            {"code": "IT403", "name": "Object Oriented Programming", "marks": 76, "credits": 3},
            {"code": "IT404", "name": "Database Systems", "marks": 62, "credits": 3},
            {"code": "IT405", "name": "Discrete Mathematics", "marks": 88, "credits": 3},
            {"code": "IT406", "name": "Digital Electronics", "marks": 52, "credits": 3}
        ]
    },
    {
        "id": "STU004",
        "name": "Sneha Kulkarni",
        "roll_number": "21CS112",
        "email": "sneha.k@campus.edu",
        "semester": 6,
        "department": "Computer Science & Engineering",
        "target_role": "frontend_dev",
        "attendance_percentage": 88.5,
        "technical_skills": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Responsive Design", "Git", "Figma"],
        "completed_courses": [
            "Meta Front-End Developer Professional Certificate",
            "Advanced React & Next.js Masterclass"
        ],
        "subjects": [
            {"code": "CS605", "name": "Web Technologies", "marks": 96, "credits": 3},
            {"code": "CS609", "name": "Human Computer Interaction", "marks": 92, "credits": 3},
            {"code": "CS606", "name": "Software Engineering", "marks": 84, "credits": 3},
            {"code": "CS604", "name": "Computer Networks", "marks": 77, "credits": 3},
            {"code": "CS602", "name": "Database Management Systems (DBMS)", "marks": 81, "credits": 4},
            {"code": "CS610", "name": "Compiler Design", "marks": 59, "credits": 4}
        ]
    },
    {
        "id": "STU005",
        "name": "Vikram Malhotra",
        "roll_number": "20CS005",
        "email": "vikram.m@campus.edu",
        "semester": 8,
        "department": "Computer Science & Engineering",
        "target_role": "backend_dev",
        "attendance_percentage": 84.0,
        "technical_skills": ["Python", "Node.js", "Express.js", "MongoDB", "SQL", "REST APIs", "Git", "Docker", "PostgreSQL"],
        "completed_courses": [
            "Backend Development with Node.js & Express",
            "Docker & Kubernetes Developer Guide"
        ],
        "subjects": [
            {"code": "CS801", "name": "Distributed Systems", "marks": 89, "credits": 4},
            {"code": "CS802", "name": "Cloud Computing", "marks": 87, "credits": 3},
            {"code": "CS602", "name": "Database Management Systems (DBMS)", "marks": 91, "credits": 4},
            {"code": "CS803", "name": "System Design", "marks": 85, "credits": 3},
            {"code": "CS804", "name": "Information Security", "marks": 78, "credits": 3},
            {"code": "CS805", "name": "Software Testing & QA", "marks": 82, "credits": 3}
        ]
    }
]

# Keep one ready-to-use student account in a fresh database. The career role
# catalog remains populated with the full set of available pathways.
SAMPLE_STUDENTS = [SAMPLE_STUDENTS[0]]
