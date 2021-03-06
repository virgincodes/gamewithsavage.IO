class Bolders {
  constructor(dimensions = [5, 10], position = [0, 4], speed = 1) {
    //dimensions [width,height]
    this.dimensions = dimensions;
    this.word = this.createArray(dimensions);
    this.speed = speed * 1000;
    this.players = {};
    // this.canvas = document.getElementById("root");
    // this.canvas.style.display = "inline";
  }

  startPlay() {
    this.playing = true
    this.word = this.createArray(this.dimensions);
    this.gamePLay = setInterval(() => {
      this.play();
    }, this.speed);
  }

  observer() {
    return this.word;
  }

  play() {
    console.clear();
    const newLine = new Array(this.dimensions[0]);
    this.word.unshift(this.createObstacles(newLine));
    this.word.pop();
    //chec new state and see if i colide
    // do tomorrow

    // this.draw();
  }

  createArray(dimensions) {
    var matrix = [];
    for (var i = 0; i < dimensions[1]; i++) {
      matrix[i] = new Array(dimensions[0]);
      this.createObstacles(matrix[i], i);
    }
    return matrix;
  }

  createObstacles(array, loc) {
    for (let i = 0; i < array.length; i++) {
      const rand = Math.random();
      if (rand > 0.2 || loc > this.dimensions[1] * 0.5) {
        array[i] = 0;
        continue;
      }
      array[i] = 1;
    }
    return array;
  }

  addPLayer(player, controler) {
    const p2 = this.getRandomizer(0, this.dimensions[0]) - 1;
    this.players[player] = {
      controler,
      position: [this.dimensions[1] - 1, p2],
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    };
  }

  playCMD(CMD, player) {
    const getPos = this.players[player].position[0];
    if (CMD === 1) {
      ///going  to the left
      if (getPos > 0) {
        this.players[player].position[0] = getPos - 1;
      } else {
        //gone out of boundary
        this.endGame();
        return -10;
      }
    } else {
      // going to th right
      if (getPos < this.dimensions[0] - 2) {
        this.players[player].position[0] = getPos + 1;
      } else {
        //gone out of boundary
        this.endGame();
        return -10;
      }
    }

    const lastLayer = this.word[this.word.length - 1];
    const Player = this.players[player];

    for (let i = 0; i < lastLayer.length; i++) {

    const cell = lastLayer[i];
    if (cell === 0)  continue;
      if (Player.position[1] === i) {
        ///most likely met a wall
        ///end game
        if (cell === 1) {
            this.endGame();
            return -10;
        }
        else{
            this.endGame();
            return 10;//gotten shit
        }
     }
    }

    return -2
  }

  getRandomizer(bottom, top) {
    return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
  }

  endGame() {
    console.log("game ended");
    // stop play
    clearInterval(this.gamePLay);
    this.playing = false
  }

  draw() {
    ///clear canvas
    this.canvas.innerHTML = "";
    for (let i = 0; i < this.dimensions[1]; i++) {
      const row = document.createElement("DIV");
      for (let j = 0; j < this.dimensions[1]; j++) {
        const cell = document.createElement("DIV");
        cell.id = `w${i}h${j}`;
        cell.style.width = `${500 / this.dimensions[0]}px`;

        cell.style.height = `${100 / this.dimensions[0]}px`;
        if (this.word[i][j] === 1) {
          cell.style.background = "black";
        }
        row.appendChild(cell);
      }
      row.style.display = "flex";
      this.canvas.appendChild(row);
    }

    const players = Object.keys(this.players);
    for (let i = 0; i < players.length; i++) {
      this.drawPlayer(this.players[players[i]]);
    }
  }

  drawPlayer(player) {
    const cell = document.getElementById(
      `w${player.position[0]}h${player.position[1]}`
    );

    try {
      cell.style.background = player.color;
    } catch (error) {
      console.log(error);
      console.log(cell);
      console.log(`w${player.position[0]}h${player.position[1]}`);
    }
  }
}

class Controler {
  constructor(game, name = "Computer") {
    this.name = name;
    this.game = game;
    this.game.addPLayer(this.name, this);
  }

  action(action) {
    return this.game.playCMD(action, this.name);
  }

  sendMSG(msg) {
    console.log("gotten msg " + msg);
  }
}

const bolders = new Bolders();
const machine = new Controler(bolders);
