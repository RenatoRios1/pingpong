// https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
// Board Stuff Here
const board = document.querySelector("#board");
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
//Allows for drawing things
const contextVariable = board.getContext("2d");
const boardWidth = board.width;
const boardHeight = board.height;
const boardBackground = "black";

//Players Stuff Here
const widthVar = 25; //Player width
const heightVar = 100; //Player height
const player1Color = "black";
const player2Color = "black";
const playerBorder = "#00FF00";
const playerSpeed = 60; //in px (i think lol) how much they moove per keypress
let pace;
let player1Score = 0;
let player2Score = 0;
//calls the function is event "keydown" is heard
window.addEventListener("keydown", changeDirection);

//writing with object initializer for players
let player1 = {
  width: widthVar,
  height: heightVar,
  x: 0,
  y: 0,
};
let player2 = {
  width: player1.width,
  height: player1.height,
  x: boardWidth - player1.width,
  y: boardHeight - player1.height,
};

//Ball Stuff here
const ballColor = "transparent";
const ballBorderColor = "#00FF00";
const ballRadius = 15;
const initialSpeed = 2;
let ballSpeed;
let ballXPosition = boardWidth / 2;
let ballYPosition = boardHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;

//score and newgamebutton
const scoreTally = document.querySelector("#scoreTally");
const newGame = document.querySelector("#newGame");
newGame.addEventListener("click", resetGame);

function updateScore() {
  //changing part of some text
  //https://www.w3schools.com/jsref/prop_node_textcontent.asp
  scoreTally.textContent = `${player2Score} vs ${player1Score}`;
}
function resetGame() {
  //reset all information
  player1Score = 0;
  player2Score = 0;
  player1 = {
    width: widthVar,
    height: heightVar,
    x: 0,
    y: 0,
  };
  player2 = {
    width: player1.width,
    height: player1.height,
    x: boardWidth - player1.width,
    y: boardHeight - player1.height,
  };
  //reset all values
  ballSpeed = initialSpeed;
  ballXPosition = 0;
  ballYPosition = 0;
  ballXDirection = 0;
  ballYDirection = 0;
  updateScore();
  //I dont want the timeout from before
  //https://developer.mozilla.org/en-US/docs/Web/API/clearInterval
  clearInterval(pace);
  start();
}

function bounceSound() {
  var audio = new Audio("Bounce.mp3");
  audio.play();
}

function looseSound() {
  var audio = new Audio("R2d2.mp3");
  audio.play();
}
//to play fun music
var x = document.getElementById("myAudio");

// function getVolume() {
//   document.getElementById("demo").innerHTML = x.volume;
// }
// function setHalfVolume() {
//   x.volume = 0.2;
// }

//starts automatically
start();
function start() {
  createBall();
  nextFrame();
}
function nextFrame() {
  //using set timeout function
  //https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
  //im running all of these functions once every 9 milliseconds?
  pace = setTimeout(() => {
    clearBoard(); //remove old stuff on board
    drawPlayers(); //add new position of players
    moveBall(); //move ball
    drawBall(ballXPosition, ballYPosition);
    bounce();
    nextFrame();
  }, 9);
}
function clearBoard() {
  contextVariable.fillStyle = boardBackground;
  //drawign rectangles
  //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
  contextVariable.clearRect(0, 0, boardWidth, boardHeight);
}
function drawPlayers() {
  contextVariable.strokeStyle = playerBorder;
  contextVariable.fillStyle = player1Color;
  contextVariable.clearRect(
    player1.x,
    player1.y,
    player1.width,
    player1.height
  );
  contextVariable.strokeRect(
    player1.x,
    player1.y,
    player1.width,
    player1.height
  );

  contextVariable.fillStyle = player2Color;
  contextVariable.clearRect(
    player2.x,
    player2.y,
    player2.width,
    player2.height
  );
  contextVariable.strokeRect(
    player2.x,
    player2.y,
    player2.width,
    player2.height
  );
}
function createBall() {
  ballSpeed = initialSpeed; //initial speed of ball
  //How to use randomizers for true or false, random inside random
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  //randomizer
  //Left or right randomizer (in X directions)
  //The other answers don't account for the perfectly reasonable parameters of 0 and ///1. Instead you should use the round instead of ceil or floor:
  //https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
  if (Math.round(Math.random()) == 1) {
    ballXDirection = -1; //moves left
  } else {
    ballXDirection = 1; //moves right
  }
  //Up or down randomizer (in X directions)
  if (Math.round(Math.random()) == 1) {
    ballYDirection = Math.random() * 1; //moves up
  } else {
    ballYDirection = Math.random() * -1; //moves down
  }
  //initial position of ball in the middle of board
  ballXPosition = boardWidth / 2;
  ballYPosition = boardHeight / 2;
  //Passing the newly calculated ball information to the drawBall function that
  //draws them using the Canvas API
  drawBall(ballXPosition, ballYPosition);
}

//updates positions
function moveBall() {
  //position = old position + (direction * magnitude of speed)
  ballXPosition += ballSpeed * ballXDirection;
  ballYPosition += ballSpeed * ballYDirection;
}

function drawBall(ballXPosition, ballYPosition) {
  //Part of Canvas API
  contextVariable.fillStyle = ballColor;
  contextVariable.strokeStyle = ballBorderColor;
  contextVariable.lineWidth = 10;

  //https://www.w3schools.com/tags/canvas_beginpath.asp
  // The beginPath() method begins a path, or resets the current path.
  // Tip: Use moveTo(), lineTo(), quadricCurveTo(), bezierCurveTo(), arcTo(), and arc///(), to create paths.
  // Tip: Use the stroke() method to actually draw the path on the canvas.
  contextVariable.beginPath();
  //To draw circles using arc()
  //https://www.w3schools.com/tags/canvas_arc.asp
  contextVariable.arc(ballXPosition, ballYPosition, ballRadius, 0, 2 * Math.PI);
  contextVariable.stroke();
  contextVariable.fill();
}
function bounce() {
  //if ball bounces on bottom
  if (ballYPosition <= 0 + ballRadius) {
    //flip the y direction ie it bounces
    ballYDirection *= -1;
  }
  //if ball hits top
  if (ballYPosition >= boardHeight - ballRadius) {
    //flip the y direction ie it bounces
    ballYDirection *= -1;
  }
  //if ball "bounces on the left border"
  if (ballXPosition <= 0) {
    looseSound();
    player1Score += 1;
    updateScore();
    createBall();
    return;
  }
  //if ball "bounces on the left border"
  if (ballXPosition >= boardWidth) {
    looseSound();
    player2Score += 1;
    updateScore();
    createBall();
    return;
  }
  //bouncing off of player1
  //first if its in the correct x position
  if (ballXPosition <= player1.x + player1.width + ballRadius) {
    //then check if its in the correct window of the y postion of the player
    //ie is it hitting the vertical sides of the player
    if (
      ballYPosition < player1.y + player1.height &&
      ballYPosition > player1.y
    ) {
      bounceSound();
      ballXPosition = player1.x + player1.width + ballRadius;
      ballXDirection *= -1;
      ballSpeed += 0.5;
    }
  }
  if (ballXPosition >= player2.x - ballRadius) {
    if (
      ballYPosition > player2.y &&
      ballYPosition < player2.y + player2.height
    ) {
      bounceSound();
      ballXPosition = player2.x - ballRadius; // if ball gets stuck
      ballXDirection *= -1;
      ballSpeed += 0.5;
    }
  }
}
function changeDirection(event) {
  const keyPress = event.keyCode;
  const player1UpKey = 87;
  const player1DownKey = 83;
  const player2UpKey = 38;
  const player2DownKey = 40;

  switch (keyPress) {
    case player1UpKey:
      if (player1.y > 0) {
        player1.y -= playerSpeed;
      }
      break;
    case player1DownKey:
      if (player1.y < boardHeight - player1.height) {
        player1.y += playerSpeed;
      }
      break;
    case player2UpKey:
      if (player2.y > 0) {
        player2.y -= playerSpeed;
      }
      break;
    case player2DownKey:
      if (player2.y < boardHeight - player2.height) {
        player2.y += playerSpeed;
      }
      break;
  }
}
