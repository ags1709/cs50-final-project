from flask import Flask, session
from .config import secret_key
from flask_session import Session

def create_app(test_config=None):
    app = Flask(__name__)
    app.config["SECRET_KEY"] = secret_key
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    Session(app)

    from webapp.auth import auth
    from webapp.views import views

    app.register_blueprint(auth)
    app.register_blueprint(views)
    
    return app
