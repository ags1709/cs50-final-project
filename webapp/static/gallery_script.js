// Global variables
let canvasSize = 600;


// Implement functionality for delete buttons
let deleteButtons = document.querySelectorAll(".delete-button")
deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        deleteCanvas(e)
    })
})

// Implement functionality for edit buttons
let editButtons = document.querySelectorAll(".edit-button")
editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        canvas = e.target.parentNode.previousElementSibling;
        pixelArtId = canvas.id;
        window.location.href = `/?pixelArtId=${pixelArtId}`
    })
})

// Set up and load all the canvasses and the art to be displayed in them
let galleryContainer = document.querySelector("#gallery-container");
let arrayOfCanvas = Array.from(document.querySelectorAll(".canvas"))
fetchData(setUpPage)




// Get all the user's pixelart data and use it to setup the gallery
function fetchData(processDataFunction) {
    fetch('/api/fetch_data')
        .then(response => response.json())
        .then(data => {
            // Use fetched data to setup page
            processDataFunction(data)
        })
        .catch(error => {
            console.error(error);
        })
}


// Load and configure all canvasses and fill them with the users pixel art
function setUpPage(data) {
    // configures container that holds all canvasses
    if (arrayOfCanvas.length == 1) {
        galleryContainer.style.gridTemplateColumns = `repeat(1, ${canvasSize}px)`;    
    }
    else {
        galleryContainer.style.gridTemplateColumns = `repeat(2, ${canvasSize}px)`;
    }
    galleryContainer.style.gridTemplateRows = `repeat(${data.length / 2}, ${canvasSize}px)`;

    // loop through all canvasses, configure them and load pixel art into them
    for (let i = 0; i < arrayOfCanvas.length; i++) {
        canvas = arrayOfCanvas[i];
        // Set id of canvas to equal loaded pixel arts id, for use in other functions
        pixelArtId = data[i]["picture_id"]
        canvas.id = pixelArtId
        // Parse the necessary server data
        pixelData = JSON.parse(data[i]["pixeldata"]);
        gridSize = JSON.parse(data[i]["gridsize"])
        // Configure the canvas properly
        configureCanvas(canvas, gridSize);
        // Load pixel art into canvas
        loadPixelArt(canvas, pixelData);
    }
}


// Load a piece of pixelart into a canvas
function loadPixelArt(canvas, pixelData) {
    for (let j = 0; j < pixelData.length; j++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");
        pixel.style.backgroundColor = `${pixelData[j]}`;
        canvas.appendChild(pixel);
    }
}


// Configure a canvas depending on gridsize
function configureCanvas(canvas, gridsize) {
    pixelSize = (canvasSize - 2) / gridsize
    canvas.style.gridTemplateColumns = `repeat(${gridsize}, ${pixelSize}px)`
    canvas.style.gridTemplateRows = `repeat(${gridsize}, ${pixelSize}px)`
}


// Send id of pixel art to be deleted back to server
function deleteCanvas(e) {
    // Get id of the pixel art in the canvas associated with the pressed delete button
    canvas = e.target.parentNode.previousElementSibling;
    pixelArtId = canvas.id;
    // Send the id to server
    fetch("/api/delete_data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pixelArtId)
    })
        // Handle response from server
        .then(response => response.json())
        .then(responseData => {
            location.reload()
        })
        // Handle errors
        .catch(error => {
            console.error('Error', error)
        })
}