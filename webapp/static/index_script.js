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


// if a pixelArtId is present in the URL, we load that pixel art, otherwise load empty canvas
if (pixelArtIdToLoad) {
    serverInteraction("/api/fetch_data", pixelArtIdToLoad, loadPixelArt)
}
else {
    addPixels()
}


// Saves art on click of save button
let titleField = document.querySelector("#title")
let saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", (e) => {
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



function serverInteraction(routeToCall, dataToPost, dataProcessingFunction) {
    // preFetchFunction()
    console.log(dataToPost)
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
    let pixelArtData = JSON.parse(data[0]["pixeldata"])
    // configure canvas to fit the loaded pixelArt
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


function saveOrUpdate(bool) {
    if (bool) {
        recordPixels()
        replacementData = {title: title, pixelData: pixelData}
        serverInteraction("/api/replace_data", replacementData, console.log)
    }
    else {
        recordPixels()
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


// Put pixels in pixel array for saving
function recordPixels() {
    pixelData = []
    pixels = document.querySelectorAll(".pixel")
    pixels.forEach((pixel) => {
        pixelColor = pixel.style.backgroundColor
        pixelData.push(pixelColor)
    })
    console.log("Pixels recorded")
}
