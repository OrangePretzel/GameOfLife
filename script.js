// Constants
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var TILE_SIZE = 8;
var GRID_X_SIZE = CANVAS_WIDTH / TILE_SIZE;
var GRID_Y_SIZE = CANVAS_HEIGHT / TILE_SIZE;

// Global variables
var c = document.getElementById("mainCanvas");
c.width = CANVAS_WIDTH;
c.height = CANVAS_HEIGHT;
var ctx = c.getContext("2d");

// Global variables - Input
var pauseButton = document.getElementById("pauseButton");
var fpsRange = document.getElementById("fpsRange");
var fpsNumber = document.getElementById("fpsNumber");

var fps = 8;
var data;
var frame = 0;
var paused = true;

// Setup Game
data = createData(GRID_X_SIZE, GRID_Y_SIZE);
c.addEventListener('click', handleInput, false)
gameLoop();

// Game Loop
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 1000 / fps);
}

// Update
function update() {
    // Pause check
    if (paused)
        return;
    frame++;

    // Game of Life Logic
    let newData = createData(GRID_X_SIZE, GRID_Y_SIZE);
    let count;
    for (let i = 0; i < GRID_X_SIZE; i++) {
        for (let j = 0; j < GRID_Y_SIZE; j++) {
            count = countAdjacent(i, j);
            if (data[i][j] !== 0) {
                // Underpopulation
                if (count < 2)
                    newData[i][j] = 0;
                // Next generation
                else if (count < 4)
                    newData[i][j] = 1;
                // Overpopulation
                else
                    newData[i][j] = 0;
            }
            else {
                // Reproduction
                if (count === 3)
                    newData[i][j] = 1;
            }
        }
    }
    data = newData;
}

// Drawing
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw a rect for each tile which is 'on'
    ctx.fillStyle = "#FFF";
    for (var i = 0; i < GRID_X_SIZE; i++)
        for (var j = 0; j < GRID_Y_SIZE; j++) {
            if (data[i][j] !== 0) {
                ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
}

// Helpers

function createData(xsize, ysize) {
    // Create a new [xsize, ysize] array of 0's
    return new Array(xsize).fill(0).map(x => Array(ysize).fill(0));
}

function countAdjacent(xPos, yPos) {
    let x, y, count = 0;
    for (let i = -1; i <= 1; i++)
        for (let j = -1; j <= 1; j++) {
            x = xPos + i;
            y = yPos + j;
            if ((x < 0 || y < 0)
                || (x >= GRID_X_SIZE || y >= GRID_Y_SIZE)
                || (x === xPos && y === yPos))
                continue;
            if (data[x][y] !== 0)
                count++;
        }
    return count;
}

// Input handling

function handleInput(ev) {
    // Get the click position and truncate to nearest tile position
    var xPos = Math.floor(ev.offsetX / TILE_SIZE);
    var yPos = Math.floor(ev.offsetY / TILE_SIZE);
    // Flip the bit
    data[xPos][yPos] = (data[xPos][yPos] + 1) % 2;
}

function onPauseButtonClicked() {
    paused = !paused;
    if (paused)
        pauseButton.value = "Unpause";
    else
        pauseButton.value = "Pause";
}

function onFPSChanged(isSlider) {
    if (isSlider) {
        fps = fpsRange.value;
        fpsNumber.value = fps;
    }
    else {
        fps = fpsNumber.value;
        fpsRange.value = fps;
    }
}

function onResetButtonClicked() {
    data = createData(GRID_X_SIZE, GRID_Y_SIZE);
    if (!paused)
        onPauseButtonClicked();
}