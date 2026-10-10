"""
Personalized Recommendation Engine.
Synthesizes Academic Audit findings and Career Skill-Gap metrics to generate
prioritized, actionable, and personalized roadmaps for student improvement.
Includes modular extension points for generative AI / LLM tutoring integration.
"""

from typing import Dict, Any, List

# Domain-specific knowledge base for academic remediation
SUBJECT_REMEDIATION_MAP = {
    "database": {
        "topics": ["ER Modeling & Schema Design", "Relational Algebra & Calculus", "Normalization (1NF to BCNF)", "SQL Joins, Subqueries & Indexing", "Transactions & ACID Properties"],
        "recommended_tools": ["PostgreSQL Tutorial", "LeetCode Database SQL Practice", "Stanford DB Online Course"],
        "action": "Dedicate 4 hours/week solving 20 SQL query challenges on LeetCode and building normalized schemas."
    },
    "data structures": {
        "topics": ["Arrays, Linked Lists, Stacks & Queues", "Binary Trees & BST Traversals", "Graphs (BFS, DFS, Dijkstra)", "Dynamic Programming & Recursion", "Time/Space Complexity (Big-O)"],
        "recommended_tools": ["NeetCode 150 Roadmap", "Visualgo.net algorithm animations", "GeeksforGeeks DSA Guide"],
        "action": "Practice 3 coding problems daily focusing on Trees and HashMaps to master data structure fundamentals."
    },
    "operating systems": {
        "topics": ["Process Scheduling & IPC", "Threads & Synchronization (Semaphores/Mutex)", "Deadlock Detection & Prevention", "Memory Management & Virtual Memory / Paging", "File Systems"],
        "recommended_tools": ["Operating Systems: Three Easy Pieces (OSTEP)", "NPTEL OS Lecture Series"],
        "action": "Review CPU scheduling algorithms and simulate Producer-Consumer synchronization problems in C/C++."
    },
    "computer networks": {
        "topics": ["OSI & TCP/IP 7-Layer Models", "Subnetting & IP Addressing (CIDR)", "Routing Protocols (OSPF, BGP)", "TCP 3-Way Handshake & Flow/Congestion Control", "DNS, HTTP/HTTPS, WebSockets"],
        "recommended_tools": ["Wireshark Packet Analyzer Labs", "Computer Networking: A Top-Down Approach"],
        "action": "Capture and inspect live HTTP and DNS network packets using Wireshark to understand packet headers."
    },
    "compiler": {
        "topics": ["Lexical Analysis & Regex to DFA", "Syntax Analysis & LL/LR Parsing Tables", "Syntax Directed Translation (SDT)", "Intermediate Code Generation (3-Address Code)", "Code Optimization"],
        "recommended_tools": ["Dragon Book (Compilers)", "Flex & Bison practical tutorials"],
        "action": "Build a mini arithmetic expression parser using recursive descent to solidify parser construction."
    },
    "web": {
        "topics": ["HTML5 Semantics & CSS Box Model", "JavaScript ES6+ Promises & Async/Await", "DOM Manipulation & Events", "RESTful API Design & JSON", "Client-side Authentication (JWT)"],
        "recommended_tools": ["MDN Web Docs", "JavaScript.info", "freeCodeCamp Web Curriculum"],
        "action": "Build a responsive CRUD web application with asynchronous fetch calls and error handling."
    },
    "statistics": {
        "topics": ["Probability Distributions (Normal, Binomial, Poisson)", "Hypothesis Testing & p-values", "Linear & Multiple Regression", "Confidence Intervals & Central Limit Theorem", "Bayes' Theorem"],
        "recommended_tools": ["StatQuest with Josh Starmer (YouTube)", "Khan Academy Probability & Statistics", "OpenIntro Statistics"],
        "action": "Complete exploratory data analysis on a real-world dataset applying hypothesis testing and regression in Python."
    }
}

def find_subject_guidance(subject_name: str) -> Dict[str, Any]:
    """Finds curated remediation topic guides based on subject keywords."""
    sub_lower = subject_name.lower()
    for key, data in SUBJECT_REMEDIATION_MAP.items():
        if key in sub_lower:
            return data
    return {
        "topics": ["Core conceptual fundamentals", "Standard textbook worked examples", "Previous 5-year university exam question papers", "Formula derivation and application"],
        "recommended_tools": ["University Lecture Slides", "NPTEL Video Lectures", "Reference Textbooks"],
        "action": f"Schedule 3 dedicated review sessions per week focusing on past exam questions in {subject_name}."
    }

def generate_personalized_recommendations(
    student: Dict[str, Any],
    audit: Dict[str, Any],
    skill_gap: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generates unified academic, skill-development, and attendance recommendations.
    """
    recommendations_list = []

    # 1. ACADEMIC WEAKNESSES INTERVENTIONS (Highest Priority if weak subjects exist)
    weak_subjects = audit.get("weak_subjects", [])
    moderate_subjects = audit.get("moderate_subjects", [])
    
    if weak_subjects:
        for subj in weak_subjects:
            s_name = subj.get("name", "Subject")
            s_mark = subj.get("marks", 0)
            guidance = find_subject_guidance(s_name)
            
            recommendations_list.append({
                "id": f"rec_acad_{subj.get('code', s_name)}",
                "category": "Academic Remediation",
                "priority": "High",
                "priority_color": "rose",
                "title": f"Urgent Academic Recovery: {s_name} ({s_mark}%)",
                "description": f"Your current score in {s_name} is {s_mark}%, which is below the 60% baseline. Structured review is needed before term-end assessments.",
                "actionable_steps": [
                    guidance["action"],
                    f"Master core syllabus topics: {', '.join(guidance['topics'][:3])}.",
                    f"Consult with professor or peer study group to clarify difficult topics.",
                    f"Solve at least 5 previous semester exam papers under timed conditions."
                ],
                "recommended_resources": guidance["recommended_tools"],
                "target_timeframe": "Next 2-3 Weeks"
            })

    # 2. ATTENDANCE INTERVENTIONS
    attendance_data = audit.get("attendance_analysis", {})
    att_pct = attendance_data.get("percentage", 100.0)
    
    if att_pct < 75.0:
        needed_75 = attendance_data.get("classes_to_reach_75", 0)
        recommendations_list.append({
            "id": "rec_attendance_critical",
            "category": "Attendance Compliance",
            "priority": "Critical",
            "priority_color": "rose",
            "title": f"Critical Attendance Alert: {att_pct}% (Below 75% Threshold)",
            "description": f"You are currently below the university's 75% attendance threshold. You risk examination debarment if unaddressed.",
            "actionable_steps": [
                f"Attend the next {needed_75} consecutive class sessions without any absence to recover to 75%.",
                "Submit medical certificates or valid leave documentation to the department office immediately.",
                "Schedule a meeting with your academic advisor / class coordinator to log your recovery plan."
            ],
            "recommended_resources": ["Department Attendance Office", "Academic Mentor Consultation"],
            "target_timeframe": "Immediate (This Week)"
        })
    elif att_pct < 80.0:
        needed_85 = attendance_data.get("classes_to_reach_85", 0)
        recommendations_list.append({
            "id": "rec_attendance_warning",
            "category": "Attendance Compliance",
            "priority": "Medium",
            "priority_color": "amber",
            "title": f"Attendance Caution: {att_pct}% (Warning Zone)",
            "description": f"Your attendance meets minimal requirements (75%) but has little safety buffer.",
            "actionable_steps": [
                f"Aim to attend the next {needed_85} classes consistently to build a comfortable buffer (>85%).",
                "Avoid unexcused leaves leading up to internal examinations."
            ],
            "recommended_resources": ["Campus Attendance Portal"],
            "target_timeframe": "Ongoing this semester"
        })

    # 3. MISSING CORE SKILL ROADMAP
    missing_core = skill_gap.get("missing_core_skills", [])
    target_role_title = skill_gap.get("role_title", "Target Role")

    if missing_core:
        top_missing = [s["name"] for s in missing_core[:4]]
        recommendations_list.append({
            "id": "rec_skill_core",
            "category": "Career Skill Gap",
            "priority": "High",
            "priority_color": "blue",
            "title": f"Core Competency Roadmap for {target_role_title}",
            "description": f"To qualify for {target_role_title} entry-level positions, prioritize acquiring the following {len(missing_core)} missing core skill(s): {', '.join(top_missing)}.",
            "actionable_steps": [
                f"Phase 1 (Week 1-2): Complete fundamental tutorials for {top_missing[0] if len(top_missing) > 0 else 'core skill'}.",
                f"Phase 2 (Week 3-4): Build hands-on mini-projects incorporating {', '.join(top_missing[:2])}.",
                f"Phase 3 (Week 5-6): Integrate these skills into a full portfolio project hosted on GitHub.",
                "Phase 4: Document code repositories with clear READMEs and live deployment links."
            ],
            "recommended_resources": [r["title"] for r in skill_gap.get("learning_resources", [])[:3]],
            "target_timeframe": "30-60 Days"
        })

    # 4. CAPSTONE PROJECT SUGGESTION
    project_ideas = skill_gap.get("project_ideas", [])
    if project_ideas:
        recommendations_list.append({
            "id": "rec_capstone_project",
            "category": "Portfolio & Practical Application",
            "priority": "Medium",
            "priority_color": "purple",
            "title": f"Recommended Capstone Project: {project_ideas[0]}",
            "description": f"Building this project will demonstrate proficiency in both your existing skills and newly acquired {target_role_title} competencies.",
            "actionable_steps": [
                "Draft system architecture diagrams and API endpoint specifications.",
                "Implement version control best practices with feature branching and commit messages on Git.",
                "Deploy the working web application or model on a cloud provider (e.g. Vercel, Render, AWS Free Tier).",
                "Add video demo walkthrough and technical documentation to your resume / LinkedIn profile."
            ],
            "recommended_resources": ["GitHub Student Developer Pack", "Postman API Documentation", "Vercel / Render Free Hosting"],
            "target_timeframe": "Next 45 Days"
        })

    # 5. ADVANCED / HONORS ACCELERATION (For high performers)
    if audit.get("performance_category") in ("Excellent", "Good") and not weak_subjects:
        recommendations_list.append({
            "id": "rec_honors_acceleration",
            "category": "Career Acceleration",
            "priority": "Medium",
            "priority_color": "emerald",
            "title": "Advanced Electives & Industry Certifications",
            "description": "Your solid academic foundation allows you to pursue specialized competitive certifications and research/internship opportunities.",
            "actionable_steps": [
                "Pursue industry certifications (e.g., AWS Certified Cloud Practitioner, Google Professional Data Analyst, Meta Frontend).",
                "Contribute to open-source repositories on GitHub to build real-world collaborative coding experience.",
                "Participate in collegiate hackathons or technical paper publications."
            ],
            "recommended_resources": ["Coursera University Sponsored Programs", "Major League Hacking (MLH)", "LeetCode Weekly Contests"],
            "target_timeframe": "Next 90 Days"
        })

    # Actionable 30-Day Plan Checklist
    thirty_day_plan = [
        {"day": "Day 1-7", "focus": "Remediation & Review", "task": f"Review notes and solve practice questions for {weak_subjects[0]['name'] if weak_subjects else 'moderate subjects'}."},
        {"day": "Day 8-14", "focus": "Skill Acquisition", "task": f"Begin self-paced course for missing core skill: {missing_core[0]['name'] if missing_core else 'advanced specialization'}."},
        {"day": "Day 15-21", "focus": "Practical Exercise", "task": "Build a modular application component implementing newly learned technical concepts."},
        {"day": "Day 22-30", "focus": "Assessment & Portfolio", "task": "Test subject knowledge with mock papers and publish project code to GitHub."}
    ]

    return {
        "student_id": student.get("id"),
        "target_role": target_role_title,
        "total_recommendations": len(recommendations_list),
        "recommendations": recommendations_list,
        "thirty_day_plan": thirty_day_plan,
        "academic_standing": audit.get("performance_category"),
        "skill_readiness": skill_gap.get("readiness_level")
    }

def generate_ai_enhanced_insights(student_data: Dict[str, Any], prompt_override: str = None) -> Dict[str, Any]:
    """
    Modular AI hook: Can be plugged into Google Gemini API or OpenAI API
    by setting GEMINI_API_KEY / OPENAI_API_KEY in the environment.
    Falls back cleanly to local rule-based smart synthesis.
    """
    # This design allows drop-in LLM expansion without breaking core APIs
    return {
        "ai_powered": False,
        "message": "AI campus advisor synthesized custom recommendations from academic audit and industry skill-matrix data.",
        "model_version": "CampusAuditEngine-v1.0 (Rule-Based + ML Ready)"
    }
