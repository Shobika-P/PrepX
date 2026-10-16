"""Role-aware skill assessments. Answer keys remain server-side."""
import uuid
from datetime import datetime, timezone

# These IDs deliberately match existing career competency names after normalization.
# Core role competencies require Proficient; advanced competencies require Advanced.
QUESTION_BANK = {
    "javascript": {"name": "JavaScript fundamentals", "skill": "JavaScript", "questions": [
        ("Which declaration cannot be reassigned?", ["let", "const", "var", "All declarations"], 1),
        ("What does === compare?", ["Values after coercion", "Type only", "Value and type", "Object identity only"], 2),
        ("Which method creates a new array by transforming each item?", ["filter", "forEach", "map", "find"], 2),
        ("What does await do inside an async function?", ["Pauses until a promise settles", "Starts a new thread", "Converts errors to null", "Runs synchronously"], 0),
        ("What is the result of typeof null?", ["null", "undefined", "object", "boolean"], 2),
        ("Which operator provides a fallback only for null or undefined?", ["||", "??", "&&", "!"], 1),
        ("Which method keeps array elements that pass a test?", ["map", "reduce", "filter", "sort"], 2),
        ("What does JSON.parse do?", ["Converts JSON text to a JavaScript value", "Converts any value to HTML", "Validates a URL", "Writes a file"], 0),
        ("Which event fires when a form is submitted?", ["submit", "changeAll", "loadForm", "send"], 0),
        ("What does a Promise represent?", ["A future completion or failure of an asynchronous operation", "A loop", "A class constructor", "A DOM element"], 0),
    ]},
    "react": {"name": "React and frontend", "skill": "React", "questions": [
        ("Which hook stores local component state?", ["useMemo", "useState", "useRef", "useEffect"], 1),
        ("Why should list items have stable keys?", ["To style them", "To help React track item identity", "To enable routing", "To prevent events"], 1),
        ("When does an effect with [] dependencies normally run?", ["Every render", "After initial mount", "Only on unmount", "Before every event"], 1),
        ("How should a child normally notify a parent of an action?", ["Mutate parent state", "Call a callback prop", "Change the DOM", "Use a global variable"], 1),
        ("What is a controlled input?", ["An input whose value is driven by React state", "An input with CSS", "A disabled input", "An input validated by HTML only"], 0),
        ("What should a state updater do?", ["Return the next state without mutating the old state", "Change props", "Edit the DOM directly", "Run during render"], 0),
        ("Which hook is intended for memoizing a computed value?", ["useMemo", "useState", "useContext", "useId"], 0),
        ("What does lifting state up mean?", ["Moving shared state to a common parent", "Moving CSS to the root", "Creating a portal", "Deleting local state"], 0),
        ("Which attribute associates a label with an input?", ["htmlFor", "className", "key", "ref"], 0),
        ("Why should effects clean up subscriptions?", ["To prevent stale subscriptions and leaks", "To force a remount", "To memoize props", "To skip rendering"], 0),
    ]},
    "sql": {"name": "Database management and SQL", "skill": "SQL", "questions": [
        ("Which clause filters grouped rows?", ["WHERE", "ORDER BY", "HAVING", "LIMIT"], 2),
        ("What does a primary key ensure?", ["Unique row identity", "Sorted rows", "Encrypted values", "No nulls in every column"], 0),
        ("Which join returns only matching rows from both tables?", ["LEFT JOIN", "FULL JOIN", "INNER JOIN", "CROSS JOIN"], 2),
        ("What is the purpose of an index?", ["Speed up selected lookups", "Replace constraints", "Back up data", "Normalize a table"], 0),
        ("Which command changes existing rows?", ["INSERT", "UPDATE", "CREATE", "SELECT"], 1),
        ("Which clause sorts query output?", ["GROUP BY", "ORDER BY", "HAVING", "DISTINCT"], 1),
        ("What does a foreign key represent?", ["A relationship to a key in another or the same table", "An encrypted index", "A duplicate primary key", "A query alias"], 0),
        ("Which aggregate counts rows?", ["COUNT", "SUM", "AVG", "ROUND"], 0),
        ("What does COMMIT do in a transaction?", ["Makes the transaction changes permanent", "Reverses the transaction", "Creates a table", "Locks the database forever"], 0),
        ("Which condition checks for missing SQL values?", ["= NULL", "IS NULL", "== NULL", "EMPTY()"], 1),
    ]},
    "rest_apis": {"name": "Backend and REST APIs", "skill": "REST APIs", "questions": [
        ("Which HTTP method is commonly used to retrieve a resource?", ["POST", "GET", "PATCH", "DELETE"], 1),
        ("What does HTTP 201 generally indicate?", ["Created", "Unauthorized", "No content", "Server error"], 0),
        ("Which status code means the request lacks valid authentication?", ["200", "301", "401", "503"], 2),
        ("What is idempotency for an HTTP operation?", ["Repeated identical requests have the same intended effect", "The request is encrypted", "The response is cached forever", "The request has no body"], 0),
        ("Where should a bearer access token normally be sent?", ["URL fragment", "Authorization header", "HTML title", "Cookie name"], 1),
        ("Which method is commonly used for a full resource replacement?", ["PUT", "GET", "TRACE", "OPTIONS"], 0),
        ("What does HTTP 204 indicate?", ["Success with no response body", "Resource created", "Authentication required", "Permanent redirect"], 0),
        ("Which response header can describe the body format?", ["Content-Type", "Host-Name", "Request-Id", "Accept-Language"], 0),
        ("Why validate request bodies on the server?", ["Clients can send arbitrary or malformed data", "Browsers never send JSON", "It replaces authentication", "It disables caching"], 0),
        ("What is a REST resource usually identified by?", ["A URI", "A CSS selector", "A process ID", "A database password"], 0),
    ]},
    "git": {"name": "Git and version control", "skill": "Git", "questions": [
        ("Which command creates a new branch and switches to it?", ["git merge", "git switch -c", "git status", "git stash"], 1),
        ("What does git commit do?", ["Records staged changes", "Downloads a repository", "Publishes a release", "Deletes a branch"], 0),
        ("Which command brings remote updates into the current branch?", ["git pull", "git init", "git log", "git tag"], 0),
        ("What does .gitignore do?", ["Lists files Git should ignore", "Hides remote branches", "Removes tracked files", "Encrypts commits"], 0),
        ("What is a merge conflict?", ["Overlapping changes Git cannot combine automatically", "A failed login", "A missing remote", "An empty commit"], 0),
        ("Which command shows the working tree state?", ["git status", "git show", "git tag", "git clean"], 0),
        ("What does git fetch do?", ["Downloads remote refs without merging them", "Deletes local history", "Stages all files", "Creates a commit"], 0),
        ("Which command unstages a file while keeping its edits?", ["git restore --staged", "git reset --hard", "git clean -fd", "git branch -D"], 0),
        ("What is a commit hash used for?", ["Identifying a commit", "Encrypting a repository", "Naming a remote", "Setting file permissions"], 0),
        ("What does git stash commonly do?", ["Temporarily shelves working changes", "Publishes a branch", "Rewrites every commit", "Deletes a remote"], 0),
    ]},
    "python": {"name": "Programming fundamentals (Python)", "skill": "Python", "questions": [
        ("Which Python type is mutable?", ["tuple", "str", "list", "int"], 2),
        ("What does a function return if it has no return statement?", ["0", "False", "None", "An error"], 2),
        ("Which keyword handles an exception?", ["catch", "except", "error", "ensure"], 1),
        ("What does range(3) produce when iterated?", ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3 only"], 1),
        ("Which expression creates a dictionary?", ["[1, 2]", "(1, 2)", "{'a': 1}", "{'a', 1}"], 2),
        ("Which keyword defines a class?", ["class", "struct", "object", "typeclass"], 0),
        ("What does enumerate(items) provide?", ["Index and item pairs", "Only the last item", "Sorted items", "A dictionary copy"], 0),
        ("Which syntax opens a file with automatic cleanup?", ["with open(...) as file", "try open(...) finally never", "open(...).close later", "using file = open(...)"], 0),
        ("What does a list comprehension create?", ["A list from an expression and iterable", "A generator function only", "A class", "A file handle"], 0),
        ("What does `in` test for a dictionary?", ["Key membership", "Value equality only", "Dictionary ordering", "Mutability"], 0),
    ]},
    "html_css": {"name": "HTML and CSS", "skill": "HTML", "questions": [
        ("Which element is the main heading?", ["<head>", "<h1>", "<title>", "<header1>"], 1),
        ("What does semantic HTML primarily improve?", ["Meaning and accessibility", "JavaScript speed", "Image resolution", "Database access"], 0),
        ("Which CSS layout is designed for one-dimensional rows or columns?", ["Flexbox", "Grid only", "Float", "Position absolute"], 0),
        ("What does the CSS box model include?", ["Content, padding, border, margin", "Only content and margin", "Color and font", "Viewport and scroll"], 0),
        ("Which attribute provides alternative text for an image?", ["title", "alt", "name", "label"], 1),
        ("Which element represents navigation links?", ["<nav>", "<aside>", "<meta>", "<summary>"], 0),
        ("Which unit scales relative to the root font size?", ["rem", "px", "vh", "deg"], 0),
        ("Which CSS property controls space inside an element's border?", ["padding", "margin", "outline", "gap"], 0),
        ("What does a media query support?", ["Styles based on viewport or device conditions", "Server-side rendering", "Database queries", "DOM event delegation"], 0),
        ("Which element should wrap a page's primary content?", ["<main>", "<footer>", "<small>", "<head>"], 0),
    ]},
}

BANDS = [(40, "Beginner"), (60, "Developing"), (80, "Proficient"), (101, "Advanced")]

def proficiency(score):
    return next(name for ceiling, name in BANDS if score < ceiling)

LEVELS = {1: "Foundation", 2: "Applied", 3: "Advanced"}

def skill_progress(attempts, skill_id):
    progress = []
    unlocked = 1
    for level in (1, 2, 3):
        level_attempts = [a for a in attempts if a.get("skill_id") == skill_id and int(a.get("level", 1)) == level]
        latest = max(level_attempts, key=lambda a: a.get("created_at", ""), default=None)
        passed = any(a.get("score_percentage", 0) >= 60 for a in level_attempts)
        progress.append({"level": level, "name": LEVELS[level], "attempt_count": len(level_attempts),
                         "latest_score": latest.get("score_percentage") if latest else None,
                         "completed": bool(level_attempts), "passed": passed,
                         "unlocked": level <= unlocked})
        if passed and level == unlocked and level < 3:
            unlocked += 1
    return {"levels": progress, "unlocked_level": unlocked}

def public_skills(role, attempts=None):
    attempts = attempts or []
    required = set((role or {}).get("core_skills", []) + (role or {}).get("advanced_skills", []))
    out = []
    for skill_id, item in QUESTION_BANK.items():
        if item["skill"].lower() in {s.lower() for s in required}:
            out.append({"id": skill_id, "name": item["name"], "skill": item["skill"], "question_count": 10,
                        "required_level": "Proficient" if item["skill"] in (role or {}).get("core_skills", []) else "Advanced",
                        **skill_progress(attempts, skill_id)})
    return out

def public_questions(skill_id, level=1):
    item = QUESTION_BANK.get(skill_id)
    if not item:
        return None
    if level not in LEVELS:
        return None
    prefix = {1: "", 2: "Applied scenario: ", 3: "Advanced scenario: "}[level]
    return [{"id": f"{skill_id}-L{level}-{i+1}", "text": f"{prefix}{q[0]}", "options": q[1]} for i, q in enumerate(item["questions"])]

def score_submission(skill_id, level, answers):
    item = QUESTION_BANK.get(skill_id)
    if not item:
        raise ValueError("Unsupported assessment skill.")
    questions = item["questions"]
    if level not in LEVELS:
        raise ValueError("Select a valid assessment level.")
    expected_ids = {f"{skill_id}-L{level}-{i+1}" for i in range(len(questions))}
    if not isinstance(answers, list) or len(answers) != len(questions):
        raise ValueError("Answer every question before submitting.")
    ids = [a.get("question_id") if isinstance(a, dict) else None for a in answers]
    if any(not isinstance(qid, str) for qid in ids) or len(set(ids)) != len(ids) or set(ids) != expected_ids:
        raise ValueError("Answers must contain each question exactly once.")
    by_id = {a["question_id"]: a.get("selected_option") for a in answers}
    if any(isinstance(v, bool) or not isinstance(v, int) or v < 0 or v > 3 for v in by_id.values()):
        raise ValueError("Each answer must select an option from 0 to 3.")
    correct = sum(by_id[f"{skill_id}-L{level}-{i+1}"] == q[2] for i, q in enumerate(questions))
    review = [{"question_id": f"{skill_id}-L{level}-{i+1}", "question": q[0], "options": q[1],
               "selected_option": by_id[f"{skill_id}-L{level}-{i+1}"], "correct_option": q[2],
               "is_correct": by_id[f"{skill_id}-L{level}-{i+1}"] == q[2],
               "explanation": f"Correct answer: {q[1][q[2]]}."} for i, q in enumerate(questions)]
    return {"total_questions": len(questions), "correct_answers": correct, "incorrect_answers": len(questions)-correct,
            "score_percentage": round(correct * 100 / len(questions), 1), "proficiency": proficiency(correct * 100 / len(questions)),
            "question_review": review}

def create_attempt(student_id, role, skill_id, level, answers, result):
    skill = QUESTION_BANK[skill_id]["skill"]
    required = "Proficient" if skill in role.get("core_skills", []) else "Advanced" if skill in role.get("advanced_skills", []) else None
    gap = required is not None and ["Beginner", "Developing", "Proficient", "Advanced"].index(result["proficiency"]) < ["Beginner", "Developing", "Proficient", "Advanced"].index(required)
    return {"attempt_id": uuid.uuid4().hex, "student_id": student_id, "skill_id": skill_id, "skill_name": skill,
            "level": level, "level_name": LEVELS[level], "question_review": result.pop("question_review", []),
            "career_role_id": role.get("id"), "career_role_title": role.get("title"), "answers": answers,
            **result, "required_level": required, "needs_improvement": gap,
            "recommendation": (f"Review {skill} fundamentals and retake this assessment." if gap else f"Maintain your {skill} practice with a role-relevant project."),
            "created_at": datetime.now(timezone.utc).isoformat()}
