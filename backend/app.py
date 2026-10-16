"""
AI Campus Companion - Flask Backend Application Entrypoint.
Automated Academic Audit & Personalized Skill-Gap Analysis Platform.
"""

import logging
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database.db import is_connected_to_mongo

# Import Route Blueprints
from routes.auth_routes import auth_bp
from routes.student_routes import student_bp
from routes.academic_routes import academic_bp
from routes.skill_routes import skill_bp
from routes.career_routes import career_bp
from routes.recommendation_routes import rec_bp
from routes.report_routes import report_bp

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("AICampusCompanion")

def create_app():
    """Initializes and configures the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all frontend origins
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register API Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(academic_bp)
    app.register_blueprint(skill_bp)
    app.register_blueprint(career_bp)
    app.register_blueprint(rec_bp)
    app.register_blueprint(report_bp)

    @app.route("/", methods=["GET"])
    def root():
        return jsonify({
            "name": "AI Campus Companion API",
            "version": "1.0.0",
            "description": "Automated Academic Audit and Personalized Skill-Gap Analysis Platform",
            "status": "online",
            "db_mode": "MongoDB persistent" if is_connected_to_mongo() else "In-memory demo fallback (data resets on restart)",
            "endpoints": [
                "/api/students",
                "/api/academic/audit/<student_id>",
                "/api/skills/gap-analysis/<student_id>?role=<role_id>",
                "/api/careers/roles",
                "/api/recommendations/<student_id>?role=<role_id>",
                "/api/reports/student/<student_id>?role=<role_id>",
                "/api/health"
            ]
        }), 200

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "mongo_connected": is_connected_to_mongo(),
            "persistent_storage": is_connected_to_mongo(),
            "service": "AI Campus Companion Backend Engine"
        }), 200

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"status": "error", "message": "Endpoint or resource not found."}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"status": "error", "message": "An internal server error occurred."}), 500

    return app

app = create_app()

if __name__ == "__main__":
    logger.info("Starting AI Campus Companion Backend on port %d...", Config.PORT)
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)
