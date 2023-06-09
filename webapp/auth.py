from flask import Blueprint, render_template, request, flash, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash
from .db import select_data, update_db
from datetime import date, datetime
from .helpers import login_required

auth = Blueprint("auth", __name__)


# Route for logging users in.
@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Get data from form
        username = request.form.get("username")
        password = request.form.get("password")
        # Select the user if it exists
        user = select_data(
            "SELECT * FROM users WHERE username = :username", username=username
        )
        # Validate input
        if not username:
            flash("Enter Username", category="error")
        elif not password:
            flash("Enter Password", category="error")
        elif not user:
            flash("User does not exist", category="error")
        elif not check_password_hash(user[0]["hash"], password):
            flash("Incorrect password", category="error")
        else:
            # Log user in and redirect them
            flash("Logged in", category="success")
            session["user_id"] = user[0]["user_id"]
            return redirect("/")
        # If invalid input, redirect back to login
        return redirect("/login")
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
            flash("Please enter username", category="error")
        elif select_data(
            "SELECT * FROM users WHERE username = :username", username=username
        ):
            flash("Username taken", category="error")
        elif not password:
            flash("Please enter password", category="error")
        elif not confirmation:
            flash("Please confirm password", category="error")
        elif password != confirmation:
            flash("Confirmation does not match password", category="error")
        # Insert user into database
        else:
            update_db(
                "INSERT INTO users (username, hash, date) VALUES(:username, :hash, :date)",
                username=username,
                hash=password_hash,
                date=DATE,
            )
            # Redirect user to homepage and flash success message
            user = select_data(
                "SELECT * FROM users WHERE username=:username", username=username
            )
            flash("Account created", category="success")
            session["user_id"] = user[0]["user_id"]
            return redirect("/")
        # If error, redirect back to register page
        return redirect("/register")

    # Method was "GET" so render register page
    else:
        return render_template("register.html")


@auth.route("/logout")
def logout():
    # Clears session of users id
    session.clear()
    flash("Logged out", category="success")
    # Redirects user
    return redirect("/login")
