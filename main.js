function main() {
  const dimensiBoard = 3
  let zeropos = []
  const inputs = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ]
  var goals = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  // pake traktor
  for (let i = 0; i < Math.pow(dimensiBoard, 2); i++) {
    const y = Math.floor(i / 3)
    const x = i % 3
    const input = document.getElementById("input_" + (i + 1)).value
    console.log('inputs[y][x] :',inputs[y][x]);
    console.log('y, x:',y, x);
    console.log('input:',input);
    console.log('inputs:',inputs);
    inputs[y][x] = input
    const goal = document.getElementById("goal_" + (i + 1)).value
    goals[y][x] = goal
    if (input == 0) zeropos = [y, x]
  }
  console.log('zeropos:',zeropos);

  // 1 state adalah snapshot papan
  // bisa lebih bagus jika posisi 0 juga dicatat
  const State = class {
    constructor(board, zeropos_x, zeropos_y) {
      this.board = board;
      this.zeropos_x = zeropos_x;
      this.zeropos_y = zeropos_y;
    }
  };

  var start = new State(inputs, zeropos[1], zeropos[0]);
  console.log('start:',start);
  var queue = new Queue();
  queue.enqueue(start);
  //   console.log(queue);
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
        curr.zeropos_x,
        curr.zeropos_y,
        curr.zeropos_x + 1,
        curr.zeropos_y
      );
      let newCurr = new State(newBoard, curr.zeropos_x + 1, curr.zeropos_y);
      queue.enqueue(newCurr);
    }
    if (curr.zeropos_x > 0) {
      // bisa ke kiri
      console.log("kiri");
      let newBoard = swap(
        curr.board,
        curr.zeropos_x,
        curr.zeropos_y,
        curr.zeropos_x - 1,
        curr.zeropos_y
      );
      let newCurr = new State(newBoard, curr.zeropos_x - 1, curr.zeropos_y);
      queue.enqueue(newCurr);
    }
    if (curr.zeropos_y < 2) {
      // bisa ke bawah
      console.log("bawah");
      let newBoard = swap(
        curr.board,
        curr.zeropos_x,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y + 1
      );
      let newCurr = new State(newBoard, curr.zeropos_x, curr.zeropos_y + 1);
      queue.enqueue(newCurr);
    }
    if (curr.zeropos_y > 0) {
      // bisa ke atas
      console.log("atas");
      let newBoard = swap(
        curr.board,
        curr.zeropos_x,
        curr.zeropos_y,
        curr.zeropos_x,
        curr.zeropos_y - 1
      );
      let newCurr = new State(newBoard, curr.zeropos_x, curr.zeropos_y - 1);
      queue.enqueue(newCurr);
    }
    console.log("sesudah swap");
    console.log('curr:',curr);
    console.table(curr.board)
    if (ctr > 100) {
      console.log("BERAKKKKKKK");
      break
    };
  } while (!isFinish(curr.board) || queue.isEmpty);

  console.log(queue.board);
}

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

function swap(inputArr, i1, j1, i2, j2) {
  const array = [
    new Array(3),
    new Array(3),
    new Array(3),
  ];
  for (let i = 0; i < inputArr.length; i++) {
    for (let j = 0; j < inputArr[i].length; j++) {
      console.log(i,j);
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