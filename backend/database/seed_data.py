"""
Seed data for AI Campus Companion.
Provides public career role competency requirements. User profiles are never seeded.
"""

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
