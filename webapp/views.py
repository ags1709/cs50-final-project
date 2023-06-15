from flask import Blueprint, render_template, session, redirect
from .helpers import login_required
from .db import select_data, update_db
views = Blueprint("views", __name__)


@views.route("/")
@login_required
def index():
    return render_template("index.html")

@views.route("/gallery")
@login_required
def user_gallery():
    user_pixel_art = select_data("SELECT * FROM pictures WHERE user_id = :id", id=session["user_id"])
    return render_template("gallery.html", user_pixel_art=user_pixel_art)
