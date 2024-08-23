const {
  DB_MIN,
  DB_MAX,
  FREQ_MIN,
  FREQ_MAX,
  FREQ_LOG_SCALES,
  FREQ_UNITS,
  NUM_FREQ_UNITS,
} = require("./../utils/global-variables");

const canvasWidth = 700;
const canvasHeight = 400;
const graphCanvasScale = 100;
const graphCanvasMargin = 40;
const canvasBorderWidth = 1; // from css

const plotCanvasBgClr = "#0b0b0b";
const graphCanvasBgClr = "#0f0f0f";
const canvasTextClr = "#424242";

function makeCanvasElement(usedFFT, canvasWidth, canvasHeight) {
  const spectrumsContainer = document.getElementById("spectrumsContainer");
  const graphContainer = document.createElement("div");
  graphContainer.classList.add("graph-container");
  const canvasBox = document.createElement("div");
  canvasBox.classList.add("canvas-box");

  const graphCanvas = document.createElement("canvas");
  graphCanvas.setAttribute("id", `${usedFFT}GraphCanvas`);

  graphCanvas.width = canvasWidth + graphCanvasScale;
  graphCanvas.height = canvasHeight + graphCanvasScale;
  graphCanvas.style.width = `${canvasWidth + graphCanvasScale}px`;
  graphCanvas.style.height = `${canvasHeight + graphCanvasScale}px`;
  graphCanvas.style.margin = `-${graphCanvasMargin}px -${graphCanvasMargin}px 0 0 `;
  graphCanvas.style.position = "absolute";

  const plotCanvas = document.createElement("canvas");
  plotCanvas.setAttribute("id", `${usedFFT}PlotCanvas`);
  plotCanvas.width = canvasWidth;
  plotCanvas.height = canvasHeight;
  plotCanvas.style.width = `${canvasWidth}px`;
  plotCanvas.style.height = `${canvasHeight}px`;
  plotCanvas.style.zIndex = "1";

  const canvasElName = document.createElement("h2");
  canvasElName.innerHTML = usedFFT;

  canvasBox.appendChild(graphCanvas);
  canvasBox.appendChild(plotCanvas);
  graphContainer.appendChild(canvasElName);
  graphContainer.appendChild(canvasBox);
  spectrumsContainer.appendChild(graphContainer);
}
//-----------------------------------------------------------------------------------

function drawTemplateGraph(usedFFT, canvasWidth, canvasHeight) {
  canvas = document.getElementById(`${usedFFT}GraphCanvas`);
  ctx = canvas.getContext("2d");

  const fontSize = 12;
  const fontSizeOffset = fontSize / 2 - 1;
  // outer canvas bg color
  ctx.fillStyle = graphCanvasBgClr;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // units color
  ctx.fillStyle = canvasTextClr;
  ctx.font = `${fontSize}px Arial`;

  let dbUnitYPosition = graphCanvasMargin;
  let unitXPosition = graphCanvasScale - graphCanvasMargin - canvasBorderWidth;

  // Y axis / dB
  const dbRange = DB_MAX - DB_MIN;
  const numDBUnits = dbRange / 5 + 1;
  const dBUnitSize = canvasHeight / (numDBUnits - 1);

  for (let i = 0; i < numDBUnits; i++) {
    ctx.fillRect(unitXPosition - 5, dbUnitYPosition, 5, 1);

    ctx.textAlign = "right";
    ctx.fillText(
      `-${i * 5}dB`,
      unitXPosition - 10,
      dbUnitYPosition + fontSizeOffset
    );

    dbUnitYPosition += dBUnitSize;
  }
  dbUnitYPosition = graphCanvasMargin;

  // X axis / freq

  let freqUnitYPosition = canvasHeight + graphCanvasMargin;

  const freqUnitSize = canvasWidth / (NUM_FREQ_UNITS - 1);

  for (let i = 0; i < NUM_FREQ_UNITS; i++) {
    ctx.fillRect(unitXPosition, freqUnitYPosition, 1, 5);

    ctx.textAlign = "left";
    if (FREQ_UNITS[i] < 1000) {
      ctx.fillText(`${FREQ_UNITS[i]}hz`, unitXPosition, freqUnitYPosition + 20);
    } else {
      freqUnitsKhz = FREQ_UNITS.map((unit) => unit / 1000);
      ctx.fillText(
        `${freqUnitsKhz[i]}khz`,
        unitXPosition,
        freqUnitYPosition + 20
      );
    }
    unitXPosition += freqUnitSize;
  }
  unitXPosition = graphCanvasScale - graphCanvasMargin;

  // add bg color to inner canvas
  plotCanvas = document.getElementById(`${usedFFT}PlotCanvas`);
  plotCtx = plotCanvas.getContext("2d");
  plotCtx.fillStyle = plotCanvasBgClr;
  plotCtx.fillRect(0, 0, plotCanvas.width, plotCanvas.height);
}

//------------------------------------------------------------
function createSpectrum(fftName, canvasWidth, canvasHeight) {
  makeCanvasElement(fftName, canvasWidth, canvasHeight);
  drawTemplateGraph(fftName, canvasWidth, canvasHeight);
}

createSpectrum("test1", canvasWidth, canvasHeight);
createSpectrum("test2", canvasWidth, canvasHeight);
