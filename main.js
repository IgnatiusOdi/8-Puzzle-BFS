// 1 state adalah snapshot papan
// bisa lebih bagus jika posisi 0 juga dicatat
const State = class {
  constructor(board, zeropos_x, zeropos_y, step, parent) {
    this.board = board;
    this.zeropos_x = zeropos_x;
    this.zeropos_y = zeropos_y;
    this.step = step;
    this.parent = parent;
  }
};

const dimensiBoard = 3
var inputsDom = [
  [-1, -1, -1],
  [-1, -1, -1],
  [-1, -1, -1],
]
var goalsDom = [
  [-1, -1, -1],
  [-1, -1, -1],
  [-1, -1, -1],
]

function init() {
  // pake traktor
  for (let i = 0; i < Math.pow(dimensiBoard, 2); i++) {
    const y = Math.floor(i / 3)
    const x = i % 3
    const input = document.getElementById("input_" + (i + 1))
    inputsDom[y][x] = input
    const goal = document.getElementById("goal_" + (i + 1))
    goalsDom[y][x] = goal
    if (input == 0) zeropos = [y, x]
  }
  console.log('inputsDom:',inputsDom)
  console.log('goalsDom:',goalsDom)
}

function randomInputMatrix() {
  const numbers = []
  let randomValue;
  for (let i = 0; numbers.length < Math.pow(dimensiBoard, 2); i++) {
    randomValue = Math.floor(Math.random() * Math.pow(dimensiBoard, 2))
    let isValid = true
    for (let j = 0; j < numbers.length; j++) {
      isValid &= !(randomValue == numbers[j])
    }
    if (isValid) numbers.push(randomValue)
  }
  for (let i = 0; i < dimensiBoard; i++) {
    for (let j = 0; j < dimensiBoard; j++) {
      inputsDom[i][j].value = numbers.shift()
    }
  }
}

function randomGoalMatrix() {
  const numbers = []
  let randomValue;
  for (let i = 0; numbers.length < Math.pow(dimensiBoard, 2); i++) {
    randomValue = Math.floor(Math.random() * Math.pow(dimensiBoard, 2))
    let isValid = true
    for (let j = 0; j < numbers.length; j++) {
      isValid &= !(randomValue == numbers[j])
    }
    if (isValid) numbers.push(randomValue)
  }
  for (let i = 0; i < dimensiBoard; i++) {
    for (let j = 0; j < dimensiBoard; j++) {
      goalsDom[i][j].value = numbers.shift()
    }
  }
}


function BFS() {
  let zeropos = []
  const inputs = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ]
  var goals = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ]
  // pake traktor
  for (let i = 0; i < Math.pow(dimensiBoard, 2); i++) {
    const y = Math.floor(i / 3)
    const x = i % 3
    const input = document.getElementById("input_" + (i + 1)).value
    inputs[y][x] = input
    const goal = document.getElementById("goal_" + (i + 1)).value
    goals[y][x] = goal
    if (input == 0) zeropos = [y, x]
  }

  // AI PHASE START
  // LINK SUTARUTO!!
  var start = new State(inputs, zeropos[1], zeropos[0], "Root", undefined);
  console.log('start:',start);
  var queue = new Queue();
  var done = new Array();
  queue.enqueue(start);
  let ctr = 0
  do {
    console.log(`Iterasi ke-${++ctr}`);
    var curr = queue.dequeue();
    console.log("sebelum swap");
    console.log("curr:", curr);
    console.table(curr.board)
    if (curr.zeropos_x < 2) {
      // bisa ke kanan
      console.log("kanan");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y,
        curr.zeropos_x + 1,
      );
      let newCurr = new State(newBoard, curr.zeropos_x + 1, curr.zeropos_y, "Right", curr);
      if (!isReccurant(newCurr.board,done)) queue.enqueue(newCurr);
    }
    if (curr.zeropos_x > 0) {
      // bisa ke kiri
      console.log("kiri");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y,
        curr.zeropos_x - 1,
      );
      let newCurr = new State(newBoard, curr.zeropos_x - 1, curr.zeropos_y, "Left", curr);
      if (!isReccurant(newCurr.board,done)) queue.enqueue(newCurr);
    }
    if (curr.zeropos_y < 2) {
      // bisa ke bawah
      console.log("bawah");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y + 1,
        curr.zeropos_x,
      );
      let newCurr = new State(newBoard, curr.zeropos_x, curr.zeropos_y + 1, "Down", curr);
      if (!isReccurant(newCurr.board,done)) queue.enqueue(newCurr);
    }
    if (curr.zeropos_y > 0) {
      // bisa ke atas
      console.log("atas");
      let newBoard = swap(
        curr.board,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y - 1,
        curr.zeropos_x,
      );
      let newCurr = new State(newBoard, curr.zeropos_x, curr.zeropos_y - 1, "Up", curr);
      if (!isReccurant(newCurr.board,done)) queue.enqueue(newCurr);
    }
    console.log("sesudah swap");
    console.log('curr:',curr);
    console.table(curr.board)
    if (ctr > 362880) {
      break
    };

    // add curr to done array
    done.push(curr);
  } while (!isFinish(curr.board) || queue.isEmpty);

  console.log("done");
  console.log("Solution:");
  printSolution(done[done.length-1]);
  console.log("Solution Board:");
  printSolutionBoard(done[done.length-1]);
}

/**
 * Function to check if the board is goal state
 * @param {Int[][]} board 
 * @returns {Boolean} True if board is goal state
 */
function isFinish(board) {
  return board[0][0] == 0 &&
    board[0][1] == 1 &&
    board[0][2] == 2 &&
    board[1][0] == 3 &&
    board[1][1] == 4 &&
    board[1][2] == 5 &&
    board[2][0] == 6 &&
    board[2][1] == 7 &&
    board[2][2] == 8
}

/**
 * Function to swap 2 element in 1 array
 * @param {Int[][]} inputArr 
 * @param {Int} i1 
 * @param {Int} j1 
 * @param {Int} i2 
 * @param {Int} j2 
 * @returns {Int[][]}
 */
function swap(inputArr, i1, j1, i2, j2) {
  const array = [
    new Array(3),
    new Array(3),
    new Array(3),
  ];
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
function isReccurant(board, done){
  for (let x = 0; x < done.length; x++) {
    let sameCtr = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (done[x].board[i][j] == board[i][j]){
          sameCtr++;
        }
      }
    }
    if (sameCtr == board.length * board[0].length){
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
    printSolution(state.parent)
  }
  console.log(state.step);
}

/**
 * function to print the solution board given an end state  
 * @param {State} state 
 */
function printSolutionBoard(state) {
  if (state.parent != undefined) {
    printSolutionBoard(state.parent)
  }
  console.table(state.board);
}