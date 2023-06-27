from webapp import create_app

# Create app to run our application
app = create_app()

# Only run app if this file is run directly
if __name__ == "__main__":
    app.run(debug=True)