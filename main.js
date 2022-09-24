// 1 state adalah snapshot papan
const State = class {
  /**
   * Constructor for State Class
   * @param {Int[][]} board 3*3 array containing puzzle board
   * @param {Int} zeropos_x x position of tile 0
   * @param {Int} zeropos_y y position of tile 0
   * @param {String} step step taken from parent
   * @param {State} parent parent state
   */
  constructor(board, zeropos_x, zeropos_y, step, parent) {
    this.board = board;
    this.zeropos_x = zeropos_x;
    this.zeropos_y = zeropos_y;
    this.step = step;
    this.parent = parent;
    if (parent == undefined) this.g = 0;
    else this.g = parent.g + 1;
  }

  /**
   * method to calculate F score
   * @param {Int[][]} goalBoard 3*3 array containing goal board
   * @returns f score
   */
  calculateF(goalBoard) {
    let f = this.g;
    for (let i = 0; i < goalBoard.length; i++) {
      for (let j = 0; j < goalBoard.length; j++) {
        if (this.board[i][j] != goalBoard[i][j]) {
          f++;
        }
      }
    }
    return f;
  }
};

const dimensiBoard = 3;
var inputsDom = [
  [-1, -1, -1],
  [-1, -1, -1],
  [-1, -1, -1],
];
var goalsDom = [
  [-1, -1, -1],
  [-1, -1, -1],
  [-1, -1, -1],
];
var swapAmount = undefined;
var domInputSwapAmount = undefined;

var maxEpoch = undefined;
var domInputMaxEpoch = undefined;

var printArray = [];
var showAll = true;
var pointerStep = 0;

/**
 * Init func to prepare variables
 */
function init() {
  // pake traktor
  for (let i = 0; i < Math.pow(dimensiBoard, 2); i++) {
    const y = Math.floor(i / 3);
    const x = i % 3;
    const input = document.getElementById("input_" + (i + 1));
    inputsDom[y][x] = input;
    const goal = document.getElementById("goal_" + (i + 1));
    goalsDom[y][x] = goal;
    if (input == 0) zeropos = [y, x];
  }
  domInputSwapAmount = document.getElementById("inputSwapAmount");
  swapAmount = domInputSwapAmount.value;
  domInputMaxEpoch = document.getElementById("inputMaxEpoch");
  maxEpoch = domInputMaxEpoch.value;
}

function onChangeSwapAmount() {
  swapAmount = domInputSwapAmount.value;
}

function onChangeMaxEpoch() {
  maxEpoch = domInputMaxEpoch.value;
}

/**
 * randomly generate start and goal matrix
 */
function randomMatrix() {
  randomInputMatrix();
  randomGoalMatrix();
  console.log("RandomMatrix");
}

/**
 * randomly generate start matrix
 */
function randomInputMatrix() {
  // karena kita random input matrix
  // maka board awal yang akan digunakan
  // adalah dari matrix goals supaya
  // solusinya pasti ada
  console.log("random input");
  let board = getMatrixFromDom(goalsDom);
  console.table(board);
  let zeropos_x = undefined,
    zeropos_y = undefined;
  for (let i = 0; i < dimensiBoard; i++) {
    for (let j = 0; j < dimensiBoard; j++) {
      if (goalsDom[i][j].value == 0) {
        zeropos_x = j;
        zeropos_y = i;
        break;
      }
    }
    if (zeropos_x != undefined && zeropos_y != undefined) break;
  }
  let lastSwapDirection = undefined;
  for (let i = 0; i < swapAmount; i++) {
    let isSwapped = false;
    do {
      const swapDirection = random(0, 3); //random 0 - 3
      // 0 = atas
      // 1 = kanan
      // 2 = bawah
      // 3 = kiri
      if (isOppositeDirection(lastSwapDirection, swapDirection)) continue;
      else if (swapDirection == 0 && zeropos_y > 0) {
        board = swap(board, zeropos_y, zeropos_x, zeropos_y - 1, zeropos_x);
        isSwapped = true;
        zeropos_y--;
        lastSwapDirection = swapDirection;
        console.table(board);
      } else if (swapDirection == 1 && zeropos_x < 2) {
        board = swap(board, zeropos_y, zeropos_x, zeropos_y, zeropos_x + 1);
        isSwapped = true;
        zeropos_x++;
        lastSwapDirection = swapDirection;
        console.table(board);
      } else if (swapDirection == 2 && zeropos_y < 2) {
        board = swap(board, zeropos_y, zeropos_x, zeropos_y + 1, zeropos_x);
        isSwapped = true;
        zeropos_y++;
        lastSwapDirection = swapDirection;
        console.table(board);
      } else if (swapDirection == 3 && zeropos_x > 0) {
        board = swap(board, zeropos_y, zeropos_x, zeropos_y, zeropos_x - 1);
        isSwapped = true;
        zeropos_x--;
        lastSwapDirection = swapDirection;
        console.table(board);
      }
    } while (isSwapped == false);
  }
  for (let i = 0; i < inputsDom.length; i++) {
    for (let j = 0; j < inputsDom[i].length; j++) {
      inputsDom[i][j].value = board[i][j];
    }
  }

  //TEST
  // inputsDom[0][0].value = 0;
  // inputsDom[0][1].value = 1;
  // inputsDom[0][2].value = 2;
  // inputsDom[1][0].value = 3;
  // inputsDom[1][1].value = 4;
  // inputsDom[1][2].value = 5;
  // inputsDom[2][0].value = 6;
  // inputsDom[2][1].value = 7;
  // inputsDom[2][2].value = 8;
}

/**
 * randomly generate goal matrix
 */
function randomGoalMatrix() {
  // karena kita random input matrix
  // maka board awal yang akan digunakan
  // adalah dari matrix inputs supaya
  // solusinya pasti ada
  console.log("random goal");
  let board = getMatrixFromDom(inputsDom);
  console.table(board);
  let zeropos_x = undefined,
    zeropos_y = undefined;
  for (let i = 0; i < dimensiBoard; i++) {
    for (let j = 0; j < dimensiBoard; j++) {
      if (inputsDom[i][j].value == 0) {
        zeropos_x = j;
        zeropos_y = i;
        break;
      }
    }
    if (zeropos_x != undefined && zeropos_y != undefined) break;
  }
  let lastSwapDirection = undefined;
  for (let i = 0; i < swapAmount; i++) {
    let isSwapped = false;
    do {
      const swapDirection = random(0, 3); //random 0 - 3
      // 0 = atas
      // 1 = kanan
      // 2 = bawah
      // 3 = kiri
      if (isOppositeDirection(lastSwapDirection, swapDirection)) continue;
      else if (swapDirection == 0 && zeropos_y > 0) {
        board = swap(board, zeropos_y, zeropos_x, zeropos_y - 1, zeropos_x);
        zeropos_y--;
        isSwapped = true;
        lastSwapDirection = swapDirection;
        console.table(board);
      } else if (swapDirection == 1 && zeropos_x < 2) {
        board = swap(board, zeropos_y, zeropos_x, zeropos_y, zeropos_x + 1);
        zeropos_x++;
        isSwapped = true;
        lastSwapDirection = swapDirection;
        console.table(board);
      } else if (swapDirection == 2 && zeropos_y < 2) {
        board = swap(board, zeropos_y, zeropos_x, zeropos_y + 1, zeropos_x);
        zeropos_y++;
        isSwapped = true;
        lastSwapDirection = swapDirection;
        console.table(board);
      } else if (swapDirection == 3 && zeropos_x > 0) {
        board = swap(board, zeropos_y, zeropos_x, zeropos_y, zeropos_x - 1);
        zeropos_x--;
        isSwapped = true;
        lastSwapDirection = swapDirection;
        console.table(board);
      }
    } while (isSwapped == false);
  }
  for (let i = 0; i < goalsDom.length; i++) {
    for (let j = 0; j < goalsDom[i].length; j++) {
      goalsDom[i][j].value = board[i][j];
    }
  }

  //TEST
  // goalsDom[0][0].value = 1;
  // goalsDom[0][1].value = 2;
  // goalsDom[0][2].value = 5;
  // goalsDom[1][0].value = 3;
  // goalsDom[1][1].value = 4;
  // goalsDom[1][2].value = 8;
  // goalsDom[2][0].value = 6;
  // goalsDom[2][1].value = 7;
  // goalsDom[2][2].value = 0;
}

function isOppositeDirection(first, second) {
  return (
    (first == 0 && second == 2) ||
    (first == 2 && second == 0) ||
    (first == 1 && second == 3) ||
    (first == 3 && second == 1)
  );
}

/**
 * Return matrix of value from the input element
 * @param {HTML_Input_Dom[][]} doms the input element <input>
 * @returns {Int[][]} matrix of doms value
 */
function getMatrixFromDom(doms) {
  const matrix = new Array(doms.length);
  for (let i = 0; i < doms.length; i++) {
    matrix[i] = new Array(doms[i].length);
    for (let j = 0; j < doms[i].length; j++) {
      matrix[i][j] = doms[i][j].value;
    }
  }
  return matrix;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function BFS() {
  let zeropos = [];
  const inputs = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ];
  var goals = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ];
  // pake traktor
  for (let i = 0; i < Math.pow(dimensiBoard, 2); i++) {
    const y = Math.floor(i / 3);
    const x = i % 3;
    const input = document.getElementById("input_" + (i + 1)).value;
    inputs[y][x] = input;
    const goal = document.getElementById("goal_" + (i + 1)).value;
    goals[y][x] = goal;
    if (input == 0) zeropos = [y, x];
  }

  // AI PHASE START
  // LINK SUTARUTO!!
  let message = `Loading...`;
  document.getElementById("iterCount").innerHTML = `<div>${message}</div>`;

  var start = new State(inputs, zeropos[1], zeropos[0], "Root", undefined);
  console.log("start:", start);
  var queue = new Queue();
  var done = new Array();
  queue.enqueue(start);
  let ctr = 0;
  do {
    ++ctr;
    message = `Selesai pada iterasi ke-${ctr}`;
    console.log(message);
    document.getElementById("iterCount").innerHTML = `<div>${message}</div>`;
    var curr = queue.dequeue();
    console.log("sebelum swap");
    console.log("curr:", curr);
    console.table(curr.board);
    if (curr.zeropos_x < 2) {
      // bisa ke kanan
      console.log("kanan");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y,
        curr.zeropos_x + 1
      );
      let newCurr = new State(
        newBoard,
        curr.zeropos_x + 1,
        curr.zeropos_y,
        "Right",
        curr
      );
      if (!isReccurant(newCurr.board, done)) queue.enqueue(newCurr);
    }
    if (curr.zeropos_x > 0) {
      // bisa ke kiri
      console.log("kiri");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y,
        curr.zeropos_x - 1
      );
      let newCurr = new State(
        newBoard,
        curr.zeropos_x - 1,
        curr.zeropos_y,
        "Left",
        curr
      );
      if (!isReccurant(newCurr.board, done)) queue.enqueue(newCurr);
    }
    if (curr.zeropos_y < 2) {
      // bisa ke bawah
      console.log("bawah");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y + 1,
        curr.zeropos_x
      );
      let newCurr = new State(
        newBoard,
        curr.zeropos_x,
        curr.zeropos_y + 1,
        "Down",
        curr
      );
      if (!isReccurant(newCurr.board, done)) queue.enqueue(newCurr);
    }
    if (curr.zeropos_y > 0) {
      // bisa ke atas
      console.log("atas");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y - 1,
        curr.zeropos_x
      );
      let newCurr = new State(
        newBoard,
        curr.zeropos_x,
        curr.zeropos_y - 1,
        "Up",
        curr
      );
      if (!isReccurant(newCurr.board, done)) queue.enqueue(newCurr);
    }
    console.log("sesudah swap");
    console.log("curr:", curr);
    console.table(curr.board);
    if (ctr >= maxEpoch) {
      message = `Sampai max epoch yang di tentukan (${ctr})`;
      console.log(message);
      document.getElementById("iterCount").innerHTML = `<div>${message}</div>`;
      break;
    }

    // add curr to done array
    done.push(curr);
  } while (!isFinish(curr.board, goals) || queue.isEmpty);
  console.log("done");
  console.log("Solution:");
  printSolution(done[done.length - 1]);

  // SHOW BUTTON
  document.getElementById("view").classList.remove("hidden");
  document.getElementById("view").innerHTML = "Show Steps";

  // CLEAN HTML SOLUTION BOARD
  document.getElementById("templateEpoch").removeAttribute("class");
  document.getElementById("templateEpoch").innerHTML = "";

  console.log("Solution Board:");
  printArray = [];
  printSolutionBoard(done[done.length - 1]);
  printHasil();
}

/**
 * solve board using A* algorithm
 */
function Astar() {
  let zeropos = [];
  const inputs = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ];
  var goals = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ];
  // pake traktor
  for (let i = 0; i < Math.pow(dimensiBoard, 2); i++) {
    const y = Math.floor(i / 3);
    const x = i % 3;
    const input = document.getElementById("input_" + (i + 1)).value;
    inputs[y][x] = input;
    const goal = document.getElementById("goal_" + (i + 1)).value;
    goals[y][x] = goal;
    if (input == 0) zeropos = [y, x];
  }

  // A* start
  let message = `Loading...`;
  document.getElementById("iterCount").innerHTML = `<div>${message}</div>`;

  var start = new State(inputs, zeropos[1], zeropos[0], "Root", undefined);
  console.log("start:", start);
  var queue = new PriorityQueue();
  var done = new Array();
  queue.enqueue(start, start.calculateF(goals));
  let ctr = 0;
  do {
    ++ctr;
    message = `Selesai pada iterasi ke-${ctr}`;
    console.log(message);
    document.getElementById("iterCount").innerHTML = `<div>${message}</div>`;
    var curr = queue.dequeue();
    console.log("sebelum swap");
    console.log("curr:", curr);
    console.table(curr.board);
    if (curr.zeropos_x < 2) {
      // bisa ke kanan
      console.log("kanan");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y,
        curr.zeropos_x + 1
      );
      let newCurr = new State(
        newBoard,
        curr.zeropos_x + 1,
        curr.zeropos_y,
        "Right",
        curr
      );
      // if (!isReccurant(newCurr.board, done))
      queue.enqueue(newCurr, newCurr.calculateF(goals));
    }
    if (curr.zeropos_x > 0) {
      // bisa ke kiri
      console.log("kiri");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y,
        curr.zeropos_x - 1
      );
      let newCurr = new State(
        newBoard,
        curr.zeropos_x - 1,
        curr.zeropos_y,
        "Left",
        curr
      );
      // if (!isReccurant(newCurr.board, done))
      queue.enqueue(newCurr, newCurr.calculateF(goals));
    }
    if (curr.zeropos_y < 2) {
      // bisa ke bawah
      console.log("bawah");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y + 1,
        curr.zeropos_x
      );
      let newCurr = new State(
        newBoard,
        curr.zeropos_x,
        curr.zeropos_y + 1,
        "Down",
        curr
      );
      // if (!isReccurant(newCurr.board, done))
      queue.enqueue(newCurr, newCurr.calculateF(goals));
    }
    if (curr.zeropos_y > 0) {
      // bisa ke atas
      console.log("atas");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y - 1,
        curr.zeropos_x
      );
      let newCurr = new State(
        newBoard,
        curr.zeropos_x,
        curr.zeropos_y - 1,
        "Up",
        curr
      );
      // if (!isReccurant(newCurr.board, done))
      queue.enqueue(newCurr, newCurr.calculateF(goals));
    }
    console.log("sesudah swap");
    console.log("curr:", curr);
    console.table(curr.board);
    if (ctr >= maxEpoch) {
      message = `Sampai max epoch yang di tentukan (${ctr})`;
      console.log(message);
      document.getElementById("iterCount").innerHTML = `<div>${message}</div>`;
      break;
    }

    // add curr to done array
    done.push(curr);
  } while (!isFinish(curr.board, goals) || queue.isEmpty);
  console.log("done");
  console.log("Solution:");
  printSolution(done[done.length - 1]);

  // SHOW BUTTON
  document.getElementById("view").classList.remove("hidden");

  console.log("Solution Board:");
  printArray = [];
  printSolutionBoard(done[done.length - 1]);
  printHasil();
}

/**
 * Function to check if the board is goal state
 * @param {Int[][]} board
 * @returns {Boolean} True if board is goal state
 */
function isFinish(board, goalMatrix) {
  for (let i = 0; i < dimensiBoard; i++) {
    for (let j = 0; j < dimensiBoard; j++) {
      if (board[i][j] != goalMatrix[i][j]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Function to swap 2 element in 1 array
 * @param {Int[][]} inputArr
 * @param {Int} i1
 * @param {Int} j1
 * @param {Int} i2
 * @param {Int} j2
 * @returns {Int[][]} swappedArray
 */
function swap(inputArr, i1, j1, i2, j2) {
  const array = [new Array(3), new Array(3), new Array(3)];
  for (let i = 0; i < inputArr.length; i++) {
    for (let j = 0; j < inputArr[i].length; j++) {
      array[i][j] = inputArr[i][j];
    }
  }
  // console.log("SWAP ===");
  // console.log('i1:',i1);
  // console.log('j1:',j1);
  // console.log('i2:',i2);
  // console.log('j2:',j2);
  // console.log('array sebelum:',array);
  // console.log('array[i1][j1]:',array[i1][j1]);
  // console.log('array[i2][j2]:',array[i2][j2]);
  const c = array[i1][j1];
  array[i1][j1] = array[i2][j2];
  array[i2][j2] = c;
  // console.log('array sesudah:',array);
  // console.log('array[i1][j1]:',array[i1][j1]);
  // console.log('array[i2][j2]:',array[i2][j2]);
  // console.log("END SWAP ===");
  return array;
}

/**
 * function to check if a state is a reccurent one given a history array
 * @param {Int[][]} board
 * @param {State[]} done
 * @returns {Boolean} True if state is a reccurent state
 */
function isReccurant(board, done) {
  for (let x = 0; x < done.length; x++) {
    let sameCtr = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (done[x].board[i][j] == board[i][j]) {
          sameCtr++;
        }
      }
    }
    if (sameCtr == board.length * board[0].length) {
      return true;
    }
  }
  return false;
}

/**
 * function to print the solution given an end state
 * @param {State} state
 */
function printSolution(state) {
  if (state.parent != undefined) {
    printSolution(state.parent);
  }
  console.log(state.step);
}

/**
 * function to print the solution board given an end state
 * @param {State} state
 */
function printSolutionBoard(state) {
  if (state.parent != undefined) {
    printSolutionBoard(state.parent);
  }
  console.table(state.board);

  var template = {
    board: state.board,
    step: state.step,
  };

  //ADD to printArray
  printArray.push(template);
}

/**
 * function to switch between show all and show steps
 *
 * **/
function changeShow() {
  showAll = !showAll;

  // CHANGE BUTTON TEXT
  showAll
    ? (document.getElementById("view").innerHTML = "Show Steps")
    : (document.getElementById("view").innerHTML = "Show All");

  // CLEAR TULISAN DI templateEpoch
  printHasil();
}

function printHasil() {
  document.getElementById("templateEpoch").innerHTML = "";
  if (showAll) {
    for (i = 0; i < printArray.length; i++) {
      //ADD h1
      let h1 = document.createElement("h1");
      h1.setAttribute("class", "font-medium text-lg");
      h1.innerHTML = printArray[i].step;
      //ADD table
      let table = document.createElement("table");
      table.setAttribute("class", "table-fixed text-xl");

      let tbody = document.createElement("tbody");
      table.append(tbody);
      for (let j = 0; j < 3; j++) {
        let tr = document.createElement("tr");
        tbody.append(tr);
        for (let k = 0; k < 3; k++) {
          let td = document.createElement("td");
          let div = document.createElement("div");
          td.setAttribute("class", "border border-gray-600");
          div.setAttribute("class", "text-center w-8 h-8");
          tr.append(td);
          td.append(div);
          div.innerHTML = printArray[i].board[j][k];
        }
      }

      document
        .getElementById("templateEpoch")
        .classList.remove("flex", "flex-col", "items-center");
      document.getElementById("templateEpoch").append(h1);
      document.getElementById("templateEpoch").append(table);
      document.getElementById("stepNavigation").classList.add("hidden");
    }
  } else {
    //ADD h1
    let h1 = document.createElement("h1");
    h1.setAttribute("class", "font-medium text-lg");
    h1.innerHTML = `Steps ${pointerStep}`;
    //ADD table
    let table = document.createElement("table");
    table.setAttribute("class", "table-fixed text-xl");

    let tbody = document.createElement("tbody");
    table.append(tbody);
    for (let j = 0; j < 3; j++) {
      let tr = document.createElement("tr");
      tbody.append(tr);
      for (let k = 0; k < 3; k++) {
        let td = document.createElement("td");
        let div = document.createElement("div");
        td.setAttribute("class", "border border-gray-600");
        div.setAttribute("class", "text-center w-8 h-8");
        tr.append(td);
        td.append(div);
        div.innerHTML = printArray[pointerStep].board[j][k];
      }
    }

    document
      .getElementById("templateEpoch")
      .setAttribute("class", "flex flex-col items-center");
    document.getElementById("templateEpoch").append(h1);
    document.getElementById("templateEpoch").append(table);
    document.getElementById("stepNavigation").classList.remove("hidden");
  }
}

function front() {
  pointerStep = 0;
  printHasil();
  console.log("FRONT");
}

function back() {
  if (pointerStep - 1 >= 0) {
    pointerStep--;
  }
  printHasil();
  console.log("BACK");
}

function next() {
  if (pointerStep + 1 < printArray.length) {
    pointerStep++;
  }
  printHasil();
  console.log("NEXT");
}

function rear() {
  pointerStep = printArray.length - 1;
  printHasil();
  console.log("REAR");
}
