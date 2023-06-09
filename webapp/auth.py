from flask import Blueprint, render_template, request, flash, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from .db import select_data, update_db
from datetime import date, datetime

auth = Blueprint("auth", __name__)


@auth.route("/login")
def login():
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
            "SELECT * FROM users WHERE USERNAME = :username", username=username
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
