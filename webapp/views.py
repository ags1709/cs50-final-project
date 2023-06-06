from flask import Blueprint, render_template

views = Blueprint("views", __name__)

@views.route("/")
def index():
    return "This is the homepage"
