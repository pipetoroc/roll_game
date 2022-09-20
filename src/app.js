const canvas = document.querySelector("#game"); //Seleccionando el canvas en JS
const game = canvas.getContext("2d"); //se le da contexto a canvas de 2D;
//Seleccionando btns
const btnUp = document.querySelector(".up");
const btnDown = document.querySelector(".down");
const btnright = document.querySelector(".right");
const btnLeft = document.querySelector(".left");
//Otros
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

//Agregando eventos a botones
btnUp.addEventListener("click", moveUp);
btnDown.addEventListener("click", moveDown);
btnLeft.addEventListener("click", moveLeft);
btnright.addEventListener("click", moveRight);
window.addEventListener("keydown", moveKeyBoard); //evento para mover el jugador con el teclado

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let enemyPositions = [];

window.addEventListener("load", setCanvasSize); //a la ventana de html se le da el evento de load para iniciarlizar la funcion start game, nos aseguramos que nuestro html cargue completamente antes de iniciar el juego.
window.addEventListener("resize", setCanvasSize);

//function to start
function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementsSize = canvasSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}
function startGame() {
  game.font = `${elementsSize}px Verdana`;
  game.textAlign = "end";

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 1000);
    showRecord();
  }

  const mapRows = map.trim().split("\n"); //Creamos un arreglo por cada fila con trim eliminamos los espacios
  const mapRowCols = mapRows.map((row) => row.trim().split("")); //Se divide cada elemento del arreglo mapRows
  console.log({ map, mapRows, mapRowCols });

  showLives();

  enemyPositions = []; //Reiniciamos el array para no tener la posicion duplicada de la posicion de enemigos
  game.clearRect(0, 0, canvas.width, canvas.height); //Limpiamos el canvas para solo ver un jugador

  mapRowCols.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const emoji = emojis[column];
      const posX = elementsSize * (columnIndex + 1);
      const posY = elementsSize * (rowIndex + 1);

      if (column == "O") {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log({ playerPosition });
        }
      } else if (column == "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (column == "X") {
        enemyPositions.push({
          x: posX.toFixed(2),
          y: posY.toFixed(2),
        });
      }
      game.fillText(emoji, posX, posY);
    });
  });
  //   for (let row = 1; row <= 10; row++) {
  //     for (let column = 1; column <= 10; column++) {
  //       game.fillText(emojis[mapRowCols[row -1][column -1]], elementsSize*row , elementsSize*column);
  //     }
  //   }
  movePlayer();
}

//functions to move
function movePlayer() {
  const giftCollisionX =
    playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
  const giftCollisionY =
    playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    levelWin();
  }

  const enemyCollision = enemyPositions.find((enemy) => {
    const enemyCollisionX = enemy.x == playerPosition.x.toFixed(2);
    const enemyCollisionY = enemy.y == playerPosition.y.toFixed(2);
    return enemyCollisionX && enemyCollisionY;
  });
  if (enemyCollision) {
    levelFail();
  }

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}
function moveUp() {
  console.log("Me quiero mover para arriba");
  if (playerPosition.y - elementsSize < elementsSize) {
    console.log("OutS");
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveDown() {
  console.log("Me quiero mover para abajo");
  if (playerPosition.y + elementsSize > canvasSize) {
    console.log("OutS");
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}
function moveRight() {
  console.log("Me quiero mover para la derecha");
  if (playerPosition.x + elementsSize > canvasSize) {
    console.log("Out");
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveLeft() {
  console.log("Me quiero mover para la izquierda");
  if (playerPosition.x - elementsSize <= 0) {
    console.log("Out");
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveKeyBoard(event) {
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
//Cambio de nivel
function levelWin() {
  console.log("Subiste de nivel");
  level++;
  startGame();
}
//Juego terminado
function gameWin() {
  clearInterval(timeInterval);
  alert("Juego terminado");
  const recordTime = localStorage.getItem("record_time");
  const playerTime = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem("record_time", playerTime);
      pResult.innerHTML = "Conseguiste el mejor tiempo";
    } else {
      pResult.innerHTML = "No lograste el record";
    }
  } else {
    localStorage.setItem("record_time", playerTime);
    pResult.innerHTML =
      "Primera vez que juegas, repite e intenta superar el record";
  }
  console.log({ recordTime, playerTime });
}
function levelFail() {
  alert("Estas muerto");
  lives--;

  if (lives < 0) {
    alert("Perdiste vuelve a empezar");
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}
function showLives() {
  spanLives.innerHTML = emojis["HEART"].repeat(lives);
}
function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("record_time");
}
