document.addEventListener("DOMContentLoaded", () => {
  //define canvas element
  const canvasEl = document.getElementById("game-field");
  // get canvas context for drawing
  const canvasCtx = canvasEl.getContext("2d");

  //draw deviding line
  const devidingLineY = 700;
  function drawDeviningLine() {
    canvasCtx.moveTo(0, devidingLineY);
    canvasCtx.lineTo(600, devidingLineY);
    canvasCtx.lineWidth = 4;
    canvasCtx.strokeStyle = "#acaccf";
    canvasCtx.stroke();
  }
  drawDeviningLine();

  // define an array to store all created letters
  const lettersArray = [];

  // Generate random letter width between predefined min and max letter size values
  const pickRandomLetterSize = () => {
    // Maximum and minimum letter square width/height
    const minLetterSize = 20;
    const maxLetterSize = 90;
    return Math.floor(
      Math.random() * (maxLetterSize - minLetterSize) + minLetterSize
    );
  };

  // Generate a random color from predefined value array
  const pickRandomColor = () => {
    const collorPalette = [
      "6d3b47",
      "453a49",
      "282f44",
      "191d32",
      "00607a",
      "005066",
      "004052",
      "00303d",
      "002029",
      "2a454b",
    ];
    return collorPalette[Math.floor(Math.random() * collorPalette.length)];
  };

  // Generate a random letter between A and E
  const pickRandomLetter = () => {
    const possibleLetters = ["A", "B", "C", "D", "E"];
    return possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
  };

  // Generate a random coordinate within the boundries of the canvas
  const generateLetterCoordinate = (letterSize, coordinate) => {
    const roundedNumber = (num) => Math.round(num);
    const max =
      coordinate === "x"
        ? roundedNumber(canvasEl.width) - letterSize
        : devidingLineY - letterSize;
    return Math.floor(Math.random() * (max - 0) + 0);
  };

  // class definition of LetterSquare object
  class LetterSquare {
    constructor() {
      this.value = pickRandomLetter();
      this.bckColor = pickRandomColor();
      this.size = pickRandomLetterSize();
      this.x = generateLetterCoordinate(this.size, "x");
      this.y = generateLetterCoordinate(this.size, "y");
      this.isInLowerHalf = false;
      this.id = `${this.value}-${this.x}-${this.y}-${this.size}-${this.bckColor}`;
    }
  }

  //function to create a new instance of a LetterSquare object and push it to the array of allLetters
  function createNewLetterInstance() {
    const letterSquare = new LetterSquare();
    lettersArray.push(letterSquare);
  }

  // set interval to create new letter instance, every 1s
  setInterval(createNewLetterInstance, 1000);

  // move all letters down
  const moveInterval = setInterval(moveLetters, 300);

  function moveLetters() {
    // clear canavas, so that every letter can be redrawn again with new y coordinates
    clearCanvas();

    // filtering of letteres that are in the lower half of the board (unclearable letters)
    const loosingCount = lettersArray.filter((i) => i.isInLowerHalf);
    // stop the game if more that 20 letters accumulated in the bottom
    if (loosingCount.length > 19) {
      clearInterval(moveInterval);
      clearCanvas();
      alert(`Game over. Your score is: ${score}`);
    }

    // check if letter is below the bottom line and therefor, still removable or not
    lettersArray.forEach((i) => {
      if (i.y + i.size + 10 < devidingLineY) {
        i.y += 10;
      } else {
        i.y = canvasEl.height - i.size;
        i.isInLowerHalf = true;
      }
      drawLetter(i);
    });
  }

  // method to draw a single letter on the canvas
  function drawLetter(letterSquare) {
    // draw letter
    canvasCtx.fillStyle = "#" + letterSquare.bckColor;
    canvasCtx.fillRect(
      letterSquare.x,
      letterSquare.y,
      letterSquare.size,
      letterSquare.size
    );
    // add text to the letter
    canvasCtx.font = `${letterSquare.size * 0.85}px Roboto`;
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "middle";
    canvasCtx.fillStyle = "white";
    canvasCtx.fillText(
      letterSquare.value,
      letterSquare.x + letterSquare.size / 2,
      letterSquare.y + letterSquare.size / 1.7
    );
  }

  // method that clears canvas and adds the deviding line
  function clearCanvas() {
    canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    drawDeviningLine();
  }

  // method to remove letters from the board, when the keyboard key is pressed
  function removeLetters(val) {
    //filter all instances of the pressed letter and check if the letter is in the upper half of the board
    const filteredLetters = lettersArray.filter(
      (item) => item.value === val && !item.isInLowerHalf
    );
    
    //remove the pressed letters from the letter array
    filteredLetters.forEach((f) => {
      lettersArray.splice(
        lettersArray.findIndex((e) => e.id === f.id),
        1
      );
    });
    updateScore(filteredLetters.length);
    clearCanvas();
    drawAllLetters();
  };

  function drawAllLetters() {
    lettersArray.forEach((i) => {
      drawLetter(i);
    });
  }

  // event listener to log when a keyboard key is pressed
  document.addEventListener("keyup", logKey);
  function logKey(key) {
    switch (key.code) {
      case "KeyA":
        removeLetters("A");
        break;
      case "KeyB":
        removeLetters("B");
        break;
      case "KeyC":
        removeLetters("C");
        break;
      case "KeyD":
        removeLetters("D");
        break;
      case "KeyE":
        removeLetters("E");
        break;
      default:
    }
  }

  // game score keeping

  // get score element
  const scoreEl = document.getElementById("score");
  // define initial score
  let score = 0;

  // function to update the score number
  function updateScore(num) {
    score += num;
    scoreEl.innerHTML = score;
  }
  updateScore(0);
});
