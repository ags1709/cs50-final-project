from flask import Blueprint, render_template, request, flash, redirect
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint("auth", __name__)

@auth.route("/login")
def login():
    return render_template("login.html")

@auth.route("/register")
def route():
    return render_template("register.html")

@auth.route("/logout")
def logout():
    return "This will log you out"