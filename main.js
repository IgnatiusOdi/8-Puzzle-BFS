function main() {
  const dimensiBoard = 3;
  var input = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  var hasil = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  for (let i = 0; i < Math.pow(dimensiBoard, 2); i++) {
    console.log('i / 3:',i / 3);
    console.log('i % 3:',i % 3);
    input[Math.floor(i / 3)][i % 3] = document.getElementById("input_" + (i + 1)).value
    hasil[Math.floor(i / 3)][i % 3] = document.getElementById("hasil_" + (i + 1)).value
  }

  // 1 state adalah snapshot papan
  // bisa lebih bagus jika posisi 0 juga dicatat
  const State = class {
    constructor(board, zeropos_x, zeropos_y) {
      this.board = board;
      this.zeropos = zeropos;
    }
  };

  let zeropos = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (document.getElementById("hasil_1").value == 0) {
        zeropos = [0, 0];
      } else if (document.getElementById("hasil_2").value == 0) {
        zeropos = [0, 1];
      } else if (document.getElementById("hasil_3").value == 0) {
        zeropos = [0, 2];
      } else if (document.getElementById("hasil_4").value == 0) {
        zeropos = [1, 0];
      } else if (document.getElementById("hasil_5").value == 0) {
        zeropos = [1, 1];
      } else if (document.getElementById("hasil_6").value == 0) {
        zeropos = [1, 2];
      } else if (document.getElementById("hasil_7").value == 0) {
        zeropos = [2, 0];
      } else if (document.getElementById("hasil_8").value == 0) {
        zeropos = [2, 1];
      } else if (document.getElementById("hasil_9").value == 0) {
        zeropos = [2, 2];
      }
    }
  }
  //   console.log("Zeropos=",zeropos);

  var start = new State(input, zeropos[0], zeropos[1]);

  var queue = new Queue();
  queue.enqueue(start);
  //   console.log(queue);
  do {
    var curr = queue.dequeue();
    console.log("curr:", curr);
    console.log("curr zeropos y", curr.zeropos_y);

    if (curr.zeropos_y > 0) {
      // bisa ke kanan
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

// function BFS(input, hasil) {
// }
