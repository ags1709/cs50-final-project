let gridSize = 32;
let canvasSize = 600;
let pixelSize = canvasSize / gridSize;
let pixelData = [] // Array to store pixeldata for saving

let canvas = document.querySelector("#canvas");
let saveButton = document.querySelector("#save-button");

// check for search paramaters
let urlParams = new URLSearchParams(window.location.search)
let pixelArtIdToLoad = urlParams.get("pixelArtId")


// Define metadata
let title = "myPixelArt";

// Configure canvas 
canvas.style.width = `${canvasSize}px`
canvas.style.height = `${canvasSize}px`
canvas.style.gridTemplateRows = `repeat(${gridSize}, ${pixelSize}px)`
canvas.style.gridTemplateColumns = `repeat(${gridSize}, ${pixelSize}px)`

// Add pixels to canvas
addPixels()

// if the pixelArtId was present in the URL, we load the pixel art
if (pixelArtIdToLoad) {
    loadPixelArt(pixelArtIdToLoad)
}

saveButton.addEventListener("click", savePixelArt);

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

// Define function to fill canvas with pixels
function addPixels() {
    canvas.replaceChildren();
    pixelData = []; // Reset pixel data

    for (let i = 0; i < gridSize ** 2; i++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");
        // pixelData.push("#FFFFFF");
        canvas.appendChild(pixel);
    }
}


function savePixelArt() {
    // Put the color of each pixel into a pixelData array
    pixels = document.querySelectorAll(".pixel")
    pixels.forEach((pixel) => {
        pixelColor = pixel.style.backgroundColor
        pixelData.push(pixelColor)
    })
    // Define data to send to server
    const dataToSend = {
        title: title,
        gridSize: gridSize,
        pixelData: pixelData
    };
    // send HTTP request to URL
    fetch("/api/save_data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(responseData => {
        // Handle server response
        console.log(responseData)
    })
    .catch(error => {
        // Handle errors
        console.error('Error', error);
    });
}

function loadPixelArt(pixelArtId) {
    fetch("/api/fetch_data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pixelArtId)
    })
        .then(response => response.json())
        .then(responseData => {
            // Handle data
            handleLoadData(responseData)
        })
}

function handleLoadData(data) {
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