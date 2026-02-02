const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const blockSelect = document.getElementById("blockType");
const gridSizeInput = document.getElementById("gridSize");
const resetButton = document.getElementById("reset");
const saveButton = document.getElementById("save");
const loadButton = document.getElementById("load");
const status = document.getElementById("status");

const colors = {
  empty: "#f5f8ff",
  grass: "#5bc85c",
  dirt: "#b47b4c",
  stone: "#9fa8bb",
  water: "#4aa3ff",
  wood: "#c98a4a",
};

let gridSize = Number(gridSizeInput.value);
let grid = createGrid(gridSize);
let hoverCell = null;
let displaySize = 0;

function createGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill("empty"));
}

function resizeCanvas(size) {
  const maxCanvas = Math.min(window.innerWidth * 0.8, 640);
  const dimension = Math.min(maxCanvas, size * 40);
  const ratio = window.devicePixelRatio || 1;

  displaySize = dimension;
  canvas.style.width = `${dimension}px`;
  canvas.style.height = `${dimension}px`;
  canvas.width = dimension * ratio;
  canvas.height = dimension * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawGrid() {
  ctx.clearRect(0, 0, displaySize, displaySize);
  const cellSize = displaySize / gridSize;

  for (let row = 0; row < gridSize; row += 1) {
    for (let col = 0; col < gridSize; col += 1) {
      const type = grid[row][col];
      ctx.fillStyle = colors[type];
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      ctx.strokeStyle = "rgba(31, 42, 68, 0.15)";
      ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }

  if (hoverCell) {
    ctx.strokeStyle = "rgba(31, 42, 68, 0.6)";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      hoverCell.col * cellSize + 1,
      hoverCell.row * cellSize + 1,
      cellSize - 2,
      cellSize - 2
    );
  }
}

function getCellFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const cellSize = rect.width / gridSize;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (row < 0 || col < 0 || row >= gridSize || col >= gridSize) {
    return null;
  }

  return { row, col };
}

function updateStatus(text) {
  status.textContent = text;
}

function placeBlock(cell, type) {
  grid[cell.row][cell.col] = type;
  updateStatus(`Поставлен блок: ${type}`);
  drawGrid();
}

function removeBlock(cell) {
  grid[cell.row][cell.col] = "empty";
  updateStatus("Блок убран");
  drawGrid();
}

function handlePointerMove(event) {
  hoverCell = getCellFromEvent(event);
  drawGrid();
}

function handleLeave() {
  hoverCell = null;
  drawGrid();
}

canvas.addEventListener("mousemove", handlePointerMove);
canvas.addEventListener("mouseleave", handleLeave);
canvas.addEventListener("contextmenu", (event) => event.preventDefault());

canvas.addEventListener("mousedown", (event) => {
  const cell = getCellFromEvent(event);
  if (!cell) return;

  if (event.button === 2) {
    removeBlock(cell);
  } else {
    placeBlock(cell, blockSelect.value);
  }
});

resetButton.addEventListener("click", () => {
  grid = createGrid(gridSize);
  updateStatus("Мир сброшен");
  drawGrid();
});

saveButton.addEventListener("click", () => {
  const payload = {
    grid,
    gridSize,
  };
  localStorage.setItem("mini-craft", JSON.stringify(payload));
  updateStatus("Мир сохранён в браузере");
});

loadButton.addEventListener("click", () => {
  const stored = localStorage.getItem("mini-craft");
  if (!stored) {
    updateStatus("Сохранение не найдено");
    return;
  }

  const data = JSON.parse(stored);
  gridSize = data.gridSize || gridSize;
  gridSizeInput.value = gridSize;
  grid = data.grid || createGrid(gridSize);
  resizeCanvas(gridSize);
  updateStatus("Сохранение загружено");
  drawGrid();
});

gridSizeInput.addEventListener("input", (event) => {
  gridSize = Number(event.target.value);
  grid = createGrid(gridSize);
  resizeCanvas(gridSize);
  updateStatus(`Размер мира: ${gridSize}×${gridSize}`);
  drawGrid();
});

resizeCanvas(gridSize);
drawGrid();

window.addEventListener("resize", () => {
  resizeCanvas(gridSize);
  drawGrid();
});
