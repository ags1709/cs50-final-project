from flask import Flask, session
from .config import secret_key
from flask_session import Session


# Configure the app and register blueprints
def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = secret_key
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"

    Session(app)

    from webapp.auth import auth
    from webapp.views import views
    from webapp.data_handling import data_handling

    app.register_blueprint(auth)
    app.register_blueprint(views)
    app.register_blueprint(data_handling)

    return app
