# PixelGallery

As the name of the project suggests, this project is a web application that lets users create pixel art and save it in a personal gallery. The app supports features like drawing in different colors, erasing, saving and editing pictures and more. All in all, the app is a simple drawing tool to make pixel art and save them in an easy to browse gallery.

## Video Demo:

TO DO

## Features

First of all, the app allows(and requires) users to register an account. Afterwards, the user can then login to access the apps functionality, and when done, log back out.

Secondly, Once a user is logged in, they have access to 2 main areas:

1. The drawing board
2. The gallery

#### **The drawing board**

The drawing board supports drawing both by clicking a pixel, or by holding the left mouse button and dragging the mouse across the board.  
There are 3 different supported drawing modes:
- Normal drawing
- Erasing
- Rainbow mode

It's worth noting however, that normal drawing supports drawing in any RBG color, through the color picker.

In addition to the above mentioned drawing features, the user can dynamically change the size of the drawing board as they please through a slider. The board defaults to 32x32 pixels, but can be changed to anywhere from 1x1, to 54x54. 

The drawing board also allows the user to clear their art at the click of a button. This will reset the board to all white, allowing the user to start over.

Last but not least, this page allows the user to save their pixel art. In order to do this, the user must input a name for the pixel art, and press the save button. This will then add the picture to the users gallery, where the art can be viewed.

#### **The gallery**

The gallery is the place you can go to look through the pixel art you have created and saved in the past. In addition to just viewing your pixel art, the gallery supports 2 main features:

- Deleting art
- Editing art

The delete functionality will simply remove the chosen pixel art from the users gallery, and reload the page to refresh the gallery.

As for the editing feature, this will redirect the user back to the drawing board, and will load the selected pixel art into the board.  
An important thing to note, is that whether your picture gets saved as a new picture in your gallery, or replaces an existing one, happens by virtue of the chosen name. If the name already exists in your gallery, that picture will be overwritten. If the name does not exist, a new picture will be added.

## Walkthrough of Project Files
Let's take a walkthrough of all the files and folder in the project, briefly outlining what they contain and what they do.  
*Note: We will be ignoring the files not created by me, such as \_\_pycache\_\_, etc.*

### Project folder
This is the main project folder that contains all directories and files related to our project. 
#### requirements.txt
This file which contains all the packages that needs to be installed in order for the project to function.
#### app.py
This file is where we create the app with flask that runs our application.
#### .gitignore
File that excludes certain files from git version control.
### webapp
The webapp folder contains all the files that are related to running and creating our application outside of the 2 beforementioned files. Additionally, the webapp folder is a python package, and as such contains an __init__.py file whose functions are available when one imports the webapp package.
#### webapp/\_\_init\_\_.py
In the webapp/\_\_init\_\_.py file we define the function to create our flask app. In this function we do some configurations of the app, and also we register flask blueprints. The use of blueprints is a design decision, that allows us to split up all the routes that we're gonna create into different files. The blueprints are then registered with the app to connect them.
One could get by without blueprints, but that would then mean having all our routes in the same file, which can quickly get out of hand.
#### webapp/db.py
In this file we first of all establish a connection with our database. After that, we define functions that allow us to interact with our database. Specifically we create a function to select data and return a list of dictionaries, and a function to do more or less all other interactions like updating, inserting, deleting etc. 
Note that we here have made some design decisions like using mySQL instead of sqlite3, and also the decision to use a non-local database. Not for any particular reasons other than to try something new, and learn other approaches/technologies
#### webapp/auth.py
In our auth.py file we create all the routes associated with registering users, logging in and logging out. Specifically we create the routes: /login, /register and /logout.
#### webapp/views.py
In this file we create the routes for simply rendering pages. Specifically the / and /gallery route.
#### webapp/data_handling.py
In data_handling.py we define all the routes that we need for handling data to make our frontend work. This is things like saving a pixel art picture to our database, deleting pixel art, getting the data for a specific pixel art from our database and send it to the frontend, checking if a specific pixel art exists in the database, and updating existing pixel art.
#### webapp/helpers.py
In this small file we define a helper function called login_required. The purpose is to use it as a decorator to ensure that certain routes can only be accessed by a user who is logged in. 
#### webapp/config.py
Here we define some sensitive data that is used in configuring our database and our app. 
### webapp/templates
In this folder we have all of our templates, meaning all the HTML files that we are using to display content.
#### webapp/templates/layout.html
This is the html template that contains the baseline for all other templates. In here we create the navbar and the pop/up messages.
#### webapp/templates/login.html
Template for the login screen. Here users can login
#### webapp/templates/register.html
Template for the registering page. Here users can register a new account.
#### webapp/templates/index.html
The template for the index page. This is the page with the core functionality of the app, namely all of the drawing functionality. Note that the functionality is not implemented in the template, but in the script for that template that we'll see later.
#### webapp/templates/gallery.html
This is the other template that contains core functionality of the app, the gallery. Here users can peruse their saved pixel art.
### webapp/static
This is the directory that contains first of all, all the styles for the templates, but also all of the scripts that we use to implement functionality on our pages. 
#### webapp/static/index_script.js
This is the meat of the application. This is the script sets up the drawing board, and implements all of the functionality of the index page, meaning all the drawing functionality and the saving/loading of pictures to and from gallery.
#### webapp/static/index_script.js
This is the other file of significant substance, the file that deals with the functionality of the gallery page. Things like defining the rows/columns in the gallery depending on amount of art the user has, loading the users art, deleting art, etc. 
#### webapp/static/auth_style.css
In this file we style both the login and register pages. Both of these pages are styled in 1 file because they're so similar, and they are supposed to look more or less the same.
#### webapp/static/gallery_style.css
The file to style the gallery page.
#### webapp/static/index_style.css
The file to style the index page.

