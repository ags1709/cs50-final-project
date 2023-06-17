// global variables
let title = "";
let gridSize = 32;
let canvasSize = 600;
let pixelSize = canvasSize / gridSize;
let pixelData = [] // Array to store pixeldata for saving

// check for search paramaters
let urlParams = new URLSearchParams(window.location.search)
let pixelArtIdToLoad = urlParams.get("pixelArtId")

// Configure canvas 
let canvas = document.querySelector("#canvas");
canvas.style.width = `${canvasSize}px`
canvas.style.height = `${canvasSize}px`
canvas.style.gridTemplateRows = `repeat(${gridSize}, ${pixelSize}px)`
canvas.style.gridTemplateColumns = `repeat(${gridSize}, ${pixelSize}px)`


// if a pixelArtId is present in the URL, load that pixel art, otherwise load empty canvas
if (pixelArtIdToLoad) {
    // loads pixelArt into the canvas
    serverInteraction("/api/fetch_data", pixelArtIdToLoad, loadPixelArt)
}
else {
    // Load empty canvas
    addPixels()
}

// Save pixelart on button click
let titleField = document.querySelector("#title")
let saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", (e) => {
    // Store pixeldata of the pixelart
    recordPixels()
    // Make sure user inputted a title
    title = titleField.value
    if (!title) {
        // Throw error
    }
    else {
        // save or update existing art depending on whether title exists in users gallery or not
        serverInteraction("/api/check_data", title, saveOrUpdate)
    }
});

// Enable coloring pixels by clicking
canvas.addEventListener("mousedown", (e) => {
    e.preventDefault()
    if (e.target.classList.contains("pixel")) {
        e.target.style.backgroundColor = "#000000";
    }
})
// Enable continous painting
canvas.addEventListener("mouseover", (e) => {
    e.preventDefault()
    if (e.buttons === 1 && e.target.classList.contains("pixel")) {
        e.target.style.backgroundColor = "#000000";
    }
})


// Function to interact with the server
function serverInteraction(routeToCall, dataToPost, dataProcessingFunction) {
    fetch(routeToCall, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
    },
        body: JSON.stringify(dataToPost)
    })
        .then(response => response.json())
        .then(responseData => {
            dataProcessingFunction(responseData)
        })
        .catch(error => {
            console.error('Error', error)
        })
}


//Loads a piece of pixel art into the canvas
function loadPixelArt(data) {
    // Parse data
    let pixelArtData = JSON.parse(data[0]["pixeldata"])
    // configure canvas to fit the pixelArt
    gridSize = data[0]["gridsize"]
    pixelSize = (canvasSize - 2) / gridSize
    canvas.style.gridTemplateColumns = `repeat(${gridSize}, ${pixelSize}px)`
    canvas.style.gridTemplateRows = `repeat(${gridSize}, ${pixelSize}px)`
    // load the pixel art into the canvas
    canvas.replaceChildren();
    for (let i = 0; i < pixelArtData.length; i++) {
        const pixel = document.createElement("div");
        pixel.style.backgroundColor = `${pixelArtData[i]}`
        pixel.style.border = "1px solid black"
        pixel.classList.add("pixel")
        canvas.appendChild(pixel);
    }
}


// saves new pixelart or updates existing pixelart
function saveOrUpdate(bool) {
    if (bool) {
        updateData = {title: title, pixelData: pixelData}
        serverInteraction("/api/update_data", updateData, console.log)
    }
    else {
        saveData = { title: title, gridSize: gridSize, pixelData: pixelData }
        serverInteraction("/api/save_data", saveData, console.log)
    }
}


// Fill canvas with pixels
function addPixels() {
    canvas.replaceChildren();
    pixelData = []; // Reset pixel data

    for (let i = 0; i < gridSize ** 2; i++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");
        pixel.style.backgroundColor = "#FFFFFF"
        canvas.appendChild(pixel);
    }
}


// Store pixelData of the pixelArt
function recordPixels() {
    pixelData = []
    pixels = document.querySelectorAll(".pixel")
    pixels.forEach((pixel) => {
        pixelColor = pixel.style.backgroundColor
        pixelData.push(pixelColor)
    })
    console.log("Pixels recorded")
}