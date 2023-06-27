from flask import Blueprint, render_template, request, session, flash, jsonify
from .helpers import login_required
from .db import select_data, update_db
from datetime import date
import json

data_handling = Blueprint("data_handling", __name__)


# Save 1 pixel art picture to database along with other metadata.
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
    # Return a response to frontend
    response = {"message": "Data processed succesfully"}
    return jsonify(response)


# Delete data for a specific pixel art picture
@data_handling.route("/api/delete_data", methods=["POST"])
@login_required
def delete_data():
    pixel_art_id = request.get_json()
    # Delete pixel art
    update_db(
        "DELETE FROM pictures WHERE user_id = :user_id AND picture_id = :picture_id",
        user_id=session["user_id"],
        picture_id=pixel_art_id,
    )
    # Return a response to frontend
    response = {"message": "Art deleted succesfully"}
    return jsonify(response)


# Get data from database and send it to frontend
@data_handling.route("/api/fetch_data", methods=["GET", "POST"])
@login_required
def fetch_data():
    # If request is post, 1 specific pixel art is fetched
    if request.method == "POST":
        pixel_art_id = request.get_json()
        pixel_art = select_data(
            "SELECT * FROM pictures WHERE user_id = :user_id AND picture_id = :picture_id",
            user_id=session["user_id"],
            picture_id=pixel_art_id,
        )
        return jsonify(pixel_art)
    # If request is not post, all the users pixel art is fetched
    else:
        user_pixel_art = select_data(
            "SELECT * FROM pictures WHERE user_id = :id", id=session["user_id"]
        )
        return jsonify(user_pixel_art)


# Check if a pixel art with specific title exists in database
@data_handling.route("/api/check_data", methods=["GET", "POST"])
@login_required
def check_data():
    title = request.get_json()
    pixel_art = select_data(
        "SELECT * FROM pictures WHERE user_id = :user_id AND title = :title",
        user_id=session["user_id"],
        title=title,
    )
    if pixel_art:
        return jsonify(True)
    else:
        return jsonify(False)


# Update data for an existing piece of pixel art in the database
@data_handling.route("/api/update_data", methods=["GET", "POST"])
@login_required
def replace_data():
    data = request.get_json()
    DATE = date.today()
    title = data["title"]
    gridSize = data["gridSize"]
    pixel_data = data["pixelData"]
    pixel_data_str = json.dumps(pixel_data)

    update_db(
        "UPDATE pictures SET pixeldata=:pixelData, gridsize=:gridSize, date=:date WHERE user_id=:user_id AND title=:title",
        pixelData=pixel_data_str,
        gridSize=gridSize,
        date=DATE,
        user_id=session["user_id"],
        title=title,
    )
    return jsonify("pixel art updated")
