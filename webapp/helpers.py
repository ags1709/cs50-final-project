from functools import wraps
from flask import session, redirect

# Decorator that checks if user is logged in, and if not, redirects them to /login
def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not session.get("user_id"):
            return redirect("/login")
        return f(*args, **kwargs)
    return wrapper
