const fireArray = [];
const fireWidth = 60;
const fireHeight = 70;
const canvasCellSize = 8
const fireSourceValue = 36
const isDebugActive = false
let windForce = 2
let maxDecay = 6

const canvas = getCanvasElement()
const globalCanvasContext = canvas.getContext("2d")

const fireColorsPalette = [{"red":7,"green":7,"blue":7,"alpha":255},{"red":31,"green":7,"blue":7,"alpha":255},{"red":47,"green":15,"blue":7,"alpha":255},{"red":71,"green":15,"blue":7,"alpha":255},{"red":87,"green":23,"blue":7,"alpha":255},{"red":103,"green":31,"blue":7,"alpha":255},{"red":119,"green":31,"blue":7,"alpha":255},{"red":143,"green":39,"blue":7,"alpha":255},{"red":159,"green":47,"blue":7,"alpha":255},{"red":175,"green":63,"blue":7,"alpha":255},{"red":191,"green":71,"blue":7,"alpha":255},{"red":199,"green":71,"blue":7,"alpha":255},{"red":223,"green":79,"blue":7,"alpha":255},{"red":223,"green":87,"blue":7,"alpha":255},{"red":223,"green":87,"blue":7,"alpha":255},{"red":215,"green":95,"blue":7,"alpha":255},{"red":215,"green":95,"blue":7,"alpha":255},{"red":215,"green":103,"blue":15,"alpha":255},{"red":207,"green":111,"blue":15,"alpha":255},{"red":207,"green":119,"blue":15,"alpha":255},{"red":207,"green":127,"blue":15,"alpha":255},{"red":207,"green":135,"blue":23,"alpha":255},{"red":199,"green":135,"blue":23,"alpha":255},{"red":199,"green":143,"blue":23,"alpha":255},{"red":199,"green":151,"blue":31,"alpha":255},{"red":191,"green":159,"blue":31,"alpha":255},{"red":191,"green":159,"blue":31,"alpha":255},{"red":191,"green":167,"blue":39,"alpha":255},{"red":191,"green":167,"blue":39,"alpha":255},{"red":191,"green":175,"blue":47,"alpha":255},{"red":183,"green":175,"blue":47,"alpha":255},{"red":183,"green":183,"blue":47,"alpha":255},{"red":183,"green":183,"blue":55,"alpha":255},{"red":207,"green":207,"blue":111,"alpha":255},{"red":223,"green":223,"blue":159,"alpha":255},{"red":239,"green":239,"blue":199,"alpha":255},{"red":255,"green":255,"blue":255,"alpha":255}]

function start() {
    initializeFireArray()
    initializeCanvas()
    createFireSource()
    addEventListenerToDOMInputs()

    setInterval(calculateFirePropagation, 50)
}

function initializeFireArray() {
    function getNumberOfPixels() {return fireWidth * fireHeight}

    const numberOfPixels = getNumberOfPixels();
    
    for (let i = 0; i < numberOfPixels; ++i) {
        fireArray.push(0);
    }
}

function initializeCanvas() {
    setCanvasSize(canvas)
    setCanvasFont(globalCanvasContext)
}

function createFireSource() {
    for (let i = 0; i < fireWidth; ++i) {
        const firstCellFromBottomLineIndex = (fireHeight-1) * fireWidth
        fireArray[firstCellFromBottomLineIndex + i] = fireSourceValue
    }
}

function addEventListenerToDOMInputs() {
    document.getElementById("fire_decay").addEventListener("change",
function() {maxDecay = this.value})
    document.getElementById("wind_force").addEventListener("change",
function() {windForce = this.value})
}

function getCanvasElement() {
    return document.querySelector("#canvas")
}

function setCanvasFont() {
    globalCanvasContext.font = `${canvasCellSize/2.5}px Arial`;
}

function setCanvasSize(canvas) {
    canvas.setAttribute("width", fireWidth * canvasCellSize);
    canvas.setAttribute("height", fireHeight * canvasCellSize);
}

function getFireArrayIndexFromXYPosition(positionX, positionY) {
    return positionY * fireWidth + positionX
}

function calculateFirePropagation() {
    for (let columnIndex = 0; columnIndex < fireWidth; ++columnIndex) {
        for (let rowIndex = 0; rowIndex < fireHeight-1; ++rowIndex) {
            updateFireCellValue(columnIndex, rowIndex)
        }
    }

    renderFire()
}

function updateFireCellValue(columnIndex, rowIndex) {
    const fireDecay = Math.floor(Math.random() * maxDecay)
    const windOffset = Math.floor(Math.random() * windForce)
    const currentFireCellIndex = getFireArrayIndexFromXYPosition(columnIndex, rowIndex)
    const fireCellBelowIndex = getFireArrayIndexFromXYPosition(columnIndex, rowIndex + 1)

    fireArray[currentFireCellIndex - windOffset] = 
    (fireArray[fireCellBelowIndex] - fireDecay >= 0) ? 
    fireArray[fireCellBelowIndex] - fireDecay
    :
    0
}

function renderFire() {
    for (let columnIndex = 0; columnIndex < fireWidth; ++columnIndex) {
        for (let rowIndex = 0; rowIndex < fireHeight; ++rowIndex) {
            const fireArrayIndex = getFireArrayIndexFromXYPosition(columnIndex, rowIndex)
            const colorIndex = fireArray[fireArrayIndex]
            const color = fireColorsPalette[colorIndex]
            drawFireCellOnCanvas(globalCanvasContext, columnIndex, rowIndex, color, isDebugActive)
        }
    }
}

function drawFireCellOnCanvas(canvasContext, cellX, cellY, color, isDebugEnabled = false) {
    function getCanvasDrawXorYPosition(cellXorY) {return cellXorY * canvasCellSize}
    function getCanvasTextXorYPosition(cellXorY) {return cellXorY * canvasCellSize + canvasCellSize/2}

    function drawCellBackground() {
        drawRectangleOnCanvas(canvasContext, 
            getCanvasDrawXorYPosition(cellX),
            getCanvasDrawXorYPosition(cellY),
            canvasCellSize, canvasCellSize,
            color)
    }

    function drawArrayIndexOnCell() {
        drawTextOnCanvas(
            canvasContext,
            getCanvasTextXorYPosition(cellX),
            getCanvasTextXorYPosition(cellY),
            getFireArrayIndexFromXYPosition(cellX, cellY).toString()
            )
    }

    drawCellBackground()
    if (isDebugEnabled) {
        drawArrayIndexOnCell()
    }
}

function drawRectangleOnCanvas(canvasContext, rectangleX, rectangleY, rectangleWidth, rectangleHeight, rectangleColor) {
    canvasContext.fillStyle = 
    `rgba(${rectangleColor.red},${rectangleColor.green},${rectangleColor.blue},${rectangleColor.alpha/255})`;
    canvasContext.fillRect(rectangleX, rectangleY, rectangleWidth, rectangleHeight);
}

function drawTextOnCanvas(canvasContext, textX, textY, textToBeDrawn) {
    canvasContext.textAlign = "center"
    canvasContext.fillStyle = "white"
    canvasContext.strokeStyle = "black"
    canvasContext.lineWidth = 0.5
    canvasContext.textBaseline = "middle"
    canvasContext.fillText(textToBeDrawn, textX, textY);
    canvasContext.strokeText(textToBeDrawn, textX, textY);
}

start()