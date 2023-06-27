// Global variables
let title = "";
let gridSize = 32;
let canvasSize = 600;
let pixelSize;
let pixelData = [] // Array to store pixeldata for saving


// Configure canvas 
let canvas = document.querySelector("#canvas");
configureCanvas()


// Check for search paramaters
let urlParams = new URLSearchParams(window.location.search)
let pixelArtIdToLoad = urlParams.get("pixelArtId")
// If a pixelArtId is present in the URL, load that pixel art, otherwise load empty canvas
if (pixelArtIdToLoad) {
    // Loads pixelArt into the canvas
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
        showAlert("alert-danger", "Please enter title for pixelArt")
    }
    else {
        // Save or update existing art depending on whether title exists in users gallery or not
        serverInteraction("/api/check_data", title, saveOrUpdate)
        // Show success messsage
        showAlert("alert-success", "Pixelart succesfully saved")
    }
});

// Enable color selection
let colorPicker = document.getElementById("colorPicker")
let drawingColor = colorPicker.value
colorPicker.addEventListener("change", (e) => {
    drawingColor = colorPicker.value
})
let drawMode = "color"

// Enable coloring pixels by clicking
canvas.addEventListener("mousedown", (e) => {
    e.preventDefault()
    if (e.target.classList.contains("pixel")) {
        drawPixel(e.target)
    }
})
// Enable continous painting
canvas.addEventListener("mouseover", (e) => {
    e.preventDefault()
    if (e.buttons === 1 && e.target.classList.contains("pixel")) {
        drawPixel(e.target)
    }
})

// Make draw modes mutually exclusive and set the draw-mode
let drawModeButtons = document.querySelectorAll(".draw-modes")
drawModeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        drawModeButtons.forEach((btn) => {
            btn.classList.remove("active")
        })
        e.target.classList.add("active")

        setDrawMode(e.target.id)
    })
})

//  Add functionality to toggle grid button
let grid = true
let toggleGridButton = document.getElementById("toggleGridButton")
toggleGridButton.addEventListener("click", (e) => {
    canvas.classList.toggle("grid-visible")
    toggleGridButton.classList.toggle("active")
    })


// Add functionality to reset button
let resetButton = document.getElementById("resetButton")
resetButton.addEventListener("click", (e) => {
    clearCanvas()
    titleField.value = ""
})

// Configure and add functionality to the grid size slider
let gridSizeSlider = document.getElementById("gridSizeSlider")
let gridSizeSliderText = document.getElementById("gridSizeSliderText")
gridSizeSlider.value = gridSize;
gridSizeSliderText.textContent = `Gridsize: ${gridSizeSlider.value} x ${gridSizeSlider.value}`
gridSizeSlider.addEventListener("input", (e) => {
    gridSizeSliderText.textContent = `Gridsize: ${gridSizeSlider.value} x ${gridSizeSlider.value}`
    gridSize = gridSizeSlider.value
    rebuildCanvas()
})


// Configure canvas depending on canvas size and gridsize
function configureCanvas() {
    canvas.replaceChildren()
    canvas.style.width = `${canvasSize}px`
    canvas.style.height = `${canvasSize}px`
    pixelSize = (canvasSize) / gridSize;
    canvas.style.gridTemplateRows = `repeat(${gridSize}, ${pixelSize}px)`
    canvas.style.gridTemplateColumns = `repeat(${gridSize}, ${pixelSize}px)`
}

// Rebuild the canvas
function rebuildCanvas() {
    configureCanvas()
    addPixels()
}

// Reset canvas
function clearCanvas() {
    pixels = document.querySelectorAll(".pixel")
    pixels.forEach(pixel => {
        pixel.style.backgroundColor = "#ffffff"
    })
}
// Change drawmode
function setDrawMode(mode) {
    drawMode = mode;
}
// Change pixel depending on drawmode
function drawPixel(pixel) {
    switch (drawMode) {
        case "color":
            colorPixel(pixel);
            break;
        case "erase":
            erasePixel(pixel);
            break;
        case "rainbow":
            rainbowPixel(pixel);
            break;
        default:
            break;
    }
}

// Color pixel selected color
function colorPixel(pixel) {
    pixel.style.backgroundColor = drawingColor;
}

// Color pixel white
function erasePixel(pixel) {
    pixel.style.backgroundColor = "#ffffff"
}

// Color pixel random color
function rainbowPixel(pixel) {
    color = getRandomColor()
    pixel.style.backgroundColor = color
}

// Generate random color
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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
    pixelSize = (canvasSize) / gridSize
    canvas.style.gridTemplateColumns = `repeat(${gridSize}, ${pixelSize}px)`
    canvas.style.gridTemplateRows = `repeat(${gridSize}, ${pixelSize}px)`
    // Configures grid size slider and its text
    gridSizeSlider.value = gridSize;
    gridSizeSliderText.textContent = `Gridsize: ${gridSizeSlider.value} x ${gridSizeSlider.value}`
    // Put title in title field
    title = data[0]["title"]
    titleField.value = title
    // load the pixel art into the canvas
    canvas.replaceChildren();
    for (let i = 0; i < pixelArtData.length; i++) {
        const pixel = document.createElement("div");
        pixel.style.backgroundColor = `${pixelArtData[i]}`
        pixel.classList.add("pixel")
        canvas.appendChild(pixel);
    }
}


// saves new pixelart or updates existing pixelart
function saveOrUpdate(bool) {
    if (bool) {
        updateData = {title: title, pixelData: pixelData, gridSize: gridSize}
        serverInteraction("/api/update_data", updateData, console.log)
    }
    else {
        saveData = { title: title, gridSize: gridSize, pixelData: pixelData }
        serverInteraction("/api/save_data", saveData, console.log)
    }
}


// Fill canvas with pixels
function addPixels() {
    // pixelData = []; // Reset pixel data
    
    canvas.replaceChildren();
    for (let i = 0; i < gridSize ** 2; i++) {
        const pixel = document.createElement("div");
        pixel.style.backgroundColor = "#ffffff"
        pixel.classList.add("pixel");
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

// Create pop-up alerts
function showAlert(category, message) {
    // Create elements
    alert = document.createElement("div")
    button = document.createElement("button")
    // Configure alert
    alert.setAttribute('class', `alert ${category} alert-dismissible fade show`)
    alert.setAttribute('role', 'alert')
    alert.textContent = message
    // Configure button
    button.setAttribute('type', 'button')
    button.setAttribute('class', 'btn-close')
    button.setAttribute('data-bs-dismiss', 'alert')
    button.setAttribute('aria-label', 'Close')
    
    body = document.querySelector("body")
    // contentContainer.appendChild(alert)
    body.appendChild(alert)
    alert.appendChild(button)
}