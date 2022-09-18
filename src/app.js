const canvas = document.querySelector("#game"); //Seleccionando el canvas en JS
const game = canvas.getContext("2d"); //se le da contexto a canvas de 2D;

//Seleccionando btns
const btnUp = document.querySelector(".up");
const btnDown = document.querySelector(".down");
const btnright = document.querySelector(".right");
const btnLeft = document.querySelector(".left");

let canvasSize;
let elementsSize;

window.addEventListener("load", setCanvasSize); //a la ventana de html se le da el evento de load para iniciarlizar la funcion start game, nos aseguramos que nuestro html cargue completamente antes de iniciar el juego.
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementsSize = canvasSize / 10;

  startGame();
}

function startGame() {
  console.log({ canvasSize, elementsSize });

  game.font = `${elementsSize}px Verdana`;
  game.textAlign = "end";

  const map = maps[2];
  const mapRows = map.trim().split("\n"); //Creamos un arreglo por cada fila
  const mapRowCols = mapRows.map((row) => row.trim().split("")); //Se divide cada elemento del arreglo mapRows
  console.log({ map, mapRows, mapRowCols });

  mapRowCols.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const emoji = emojis[column];
      let posX = elementsSize * (columnIndex + 1);
      let posY = elementsSize * (rowIndex + 1);
      game.fillText(emoji, posX, posY);
    });
  });

  //   for (let row = 1; row <= 10; row++) {
  //     for (let column = 1; column <= 10; column++) {
  //       game.fillText(emojis[mapRowCols[row -1][column -1]], elementsSize*row , elementsSize*column);
  //     }
  //   }
}

btnUp.addEventListener("click", moveUp);
btnDown.addEventListener("click", moveDown);
btnLeft.addEventListener("click", moveLeft);
btnright.addEventListener("click", moveRight);

// function moveKeys () {
//   if ()
// }

function moveUp() {
  console.log("Me quiero mover para arriba");
}
function moveDown() {
  console.log("Me quiero mover para abajo");
}
function moveRight() {
  console.log("Me quiero mover para la derecha");
}
function moveLeft() {
  console.log("Me quiero mover para la izquierda");
}

window.addEventListener("keydown", keyBoard);
function keyBoard(event) {
  if (event.key === "ArrowUp") {
    moveUp();
  } else if (event.key === "ArrowDown") {
    moveDown();
  } else if (event.key === "ArrowLeft") {
    moveLeft();
  } else if (event.key === "ArrowRight") {
    moveRight();
  }
}
