"""Authentication helpers for private student API resources."""
from functools import wraps
from flask import request, jsonify, g
from database.db import get_students_collection


def authenticated(handler):
    @wraps(handler)
    def wrapped(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        token = header[7:].strip() if header.startswith("Bearer ") else ""
        if not token:
            return jsonify({"status": "error", "message": "Authentication required."}), 401
        student = get_students_collection().find_one({"token": token})
        if not student:
            return jsonify({"status": "error", "message": "Session expired or invalid."}), 401
        g.student = student
        requested_id = kwargs.get("student_id")
        if requested_id and requested_id not in (student.get("id"), student.get("roll_number")):
            return jsonify({"status": "error", "message": "You cannot access another student's records."}), 403
        return handler(*args, **kwargs)
    return wrapped
