function main() {
  const dimensiBoard = 3
  let zeropos = []
  var inputs = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
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
    inputs[y][x] = document.getElementById("input_" + (i + 1)).value
    const goal = document.getElementById("goal_" + (i + 1)).value
    goals[y][x] = goal
    if (goal == 0) zeropos = [y, x]
  }

  // 1 state adalah snapshot papan
  // bisa lebih bagus jika posisi 0 juga dicatat
  const State = class {
    constructor(board, zeropos_x, zeropos_y) {
      this.board = board;
      this.zeropos_x = zeropos_x;
      this.zeropos_y = zeropos_y;
    }
  };

  var start = new State(inputs, zeropos[0], zeropos[1]);
  console.log('start:',start);
  var queue = new Queue();
  queue.enqueue(start);
  //   console.log(queue);
  let ctr = 0
  do {
    console.log(`Iterasi ke-${++ctr}`);
    var curr = queue.dequeue();
    console.log("curr:", curr);
    console.log("curr zeropos y", curr.zeropos_y[0]);

    if (curr.zeropos_y > 0) {
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
    if (curr.zeropos_y < 2) {
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
    if (curr.zeropos_x > 0) {
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
    if (curr.zeropos_x < 2) {
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
  } while (!isFinish(curr.board) || queue.isEmpty);

  console.log(queue.board);
}

function isFinish(board) {
  if (
    board[0][0] == 0 &&
    board[0][1] == 1 &&
    board[0][2] == 2 &&
    board[1][0] == 3 &&
    board[1][1] == 4 &&
    board[1][2] == 5 &&
    board[2][0] == 6 &&
    board[2][1] == 7 &&
    board[2][2] == 8
  )
    return true;
  else return false;
}

function swap(array, i1, j1, i2, j2) {
  let c = array[i1][j1];
  array[i1][j1] = array[i2][j2];
  array[i2][j2] = c;

  return array;
}

// function BFS(inputs, goals) {
// }
