from flask import Flask


def create_app(test_config=None):
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "dev"

    from webapp.auth import auth
    from webapp.views import views

    app.register_blueprint(auth)
    app.register_blueprint(views)
    
    return app
