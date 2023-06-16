from flask import Blueprint, render_template, request, session, flash, jsonify
from .helpers import login_required
from .db import select_data, update_db
from datetime import date
import json

data_handling = Blueprint("data_handling", __name__)


@data_handling.route("/api/save_data", methods=["POST"])
@login_required
def save_data():
    # Get picture data
    data = request.get_json()
    title = data["title"]
    grid_size = data["gridSize"]
    pixel_data = data["pixelData"]
    pixel_data_str = json.dumps(pixel_data)
    # Define additional data
    user = select_data("SELECT * FROM users WHERE user_id = :id", id=session["user_id"])
    user_id = user[0]["user_id"]
    DATE = date.today()
    # Insert data into database
    update_db(
        "INSERT INTO pictures (gridsize, title, pixeldata, date, user_id) VALUES(:gridsize, :title, :pixeldata, :date, :user_id)",
        gridsize=grid_size,
        title=title,
        pixeldata=pixel_data_str,
        date=DATE,
        user_id=user_id,
    )
    # Create response to javascript
    response = {"message": "Data processed succesfully"}
    return jsonify(response)


@data_handling.route("/api/delete_data", methods=["POST"])
@login_required
def delete_data():
    # Get id of pixel art to be deleted
    data = request.get_json()
    # Delete pixel art
    update_db(
        "DELETE FROM pictures WHERE user_id = :user_id AND picture_id = :picture_id",
        user_id=session["user_id"],
        picture_id=data,
    )

    response = {"message": "Art deleted succesfully"}
    return jsonify(response)


@data_handling.route("/api/fetch_data", methods=["GET", "POST"])
@login_required
def fetch_data():
    if request.method == "POST":
        pixel_art_id = request.get_json()
        pixel_art = select_data(
            "SELECT * FROM pictures WHERE user_id = :user_id AND picture_id = :picture_id",
            user_id=session["user_id"],
            picture_id=pixel_art_id
        )
        return jsonify(pixel_art)

    else:
        user_pixel_art = select_data(
            "SELECT * FROM pictures WHERE user_id = :id", id=session["user_id"]
        )
        return jsonify(user_pixel_art)
