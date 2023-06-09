from flask import Blueprint, render_template, request, flash, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash
from .db import select_data, update_db
from datetime import date, datetime
from .helpers import login_required

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        user = select_data("SELECT * FROM users WHERE username = :username", username=username)[0]

        # Validate input
        if not username:
            # Throw error
            flash("Enter Username", category="error")
        elif not password:
            # Throw error
            flash("Enter Password", category="error")
        elif not user:
            # Throw error
            flash("User does not exist", category="error")
        elif not check_password_hash(password, user["hash"]):
            # Throw error
            flash("Incorrect password", category="error")
        else:
            session["user_id"] = user["id"]
            return redirect("/")
        redirect("/login")
    else:
        return render_template("login.html")


@auth.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        DATE = date.today()
        # Get data from form submission
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")
        password_hash = generate_password_hash(password)
        # Validate users input, and if invalid, throw error
        if not username:
            # Throw error
            flash("Please enter username", category="error")
        elif select_data(
            "SELECT * FROM users WHERE username = :username", username=username
        ):
            # Throw error
            flash("Username taken", category="error")
        elif not password:
            # Throw error
            flash("Please enter password", category="error")
        elif not confirmation:
            # Throw error
            flash("Please confirm password", category="error")
        elif password != confirmation:
            # Throw error
            flash("Confirmation does not match password", category="error")
        # Insert user into database
        else:
            update_db(
                "INSERT INTO users (username, hash, account_creation_date) VALUES(:username, :hash, :date)",
                username=username,
                hash=password_hash,
                date=DATE,
            )
            # Redirect user to homepage and flash success message
            flash("Account created", category="success")
            return redirect("/")
        # If error, redirect back to register page
        return redirect("/register")

    # Method was "GET" so render register page
    else:
        return render_template("register.html")


@auth.route("/logout")
def logout():
    return "This will log you out"
