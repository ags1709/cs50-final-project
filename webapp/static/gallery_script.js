let canvasSize = 600;
let galleryContainer = document.querySelector("#gallery-container");
galleryContainer.style.gridTemplateColumns = `repeat(2, ${canvasSize}px)`;
galleryContainer.style.gap = "100px 10vw";

let arrayOfCanvas = Array.from(document.querySelectorAll(".canvas"))
let deleteButtons = document.querySelectorAll(".delete-button")
let editButtons = document.querySelectorAll(".edit-button")

deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        deleteCanvas(e)
    })
})

editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        canvas = e.target.parentNode.previousElementSibling;
        pixelArtId = canvas.id;
        window.location.href = `/?pixelArtId=${pixelArtId}`
    })
})


fetchData(setUpPage)



// Get all the user's pixelart data and use it to setup the gallery
function fetchData(processDataFunction) {
    fetch('/api/fetch_data')
        .then(response => response.json())
        .then(data => {
            // Process the data
            processDataFunction(data)
        })
        .catch(error => {
            console.error(error);
        })
}

// Loads all the users pictures into canvasses
function setUpPage(data) {
    galleryContainer.style.gridTemplateRows = `repeat(${data.length / 2}, ${canvasSize}px)`;
    // loop through all canvasses, configure them and load pixel art into them
    for (let i = 0; i < arrayOfCanvas.length; i++) {
        canvas = arrayOfCanvas[i];
        // Set id of canvas to equal pixel arts id, for use in deleteCanvas function
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


function loadPixelArt(canvas, pixelData) {
    for (let j = 0; j < pixelData.length; j++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");
        pixel.style.backgroundColor = `${pixelData[j]}`;
        canvas.appendChild(pixel);
    }
}


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
            // console.log(responseData)
            location.reload()
        })
        // Handle errors
        .catch(error => {
            console.error('Error', error)
        })
}


