let that;
class Game {
  constructor() {
    this.rows = ROWS;
    this.columns = COLS;
    this.status = 0;
    this.depth = DEPTH;
    this.score = 100000;
    this.round = 0;
    this.winning_array = [];
    this.iterations = 0;
    that = this;
    this.init();
  }

  init() {
    var game_board = new Array(that.rows);
    for (let i = 0; i < game_board.length; i++) {
      game_board[i] = new Array(that.columns);

      for (let j = 0; j < game_board[i].length; j++) {
        game_board[i][j] = null;
      }
    }

    this.board = new Board(this, game_board, 0);

    var game_board = '';
    for (var i = 0; i < that.rows; i++) {
      game_board += '<tr>';
      for (var j = 0; j < that.columns; j++) {
        game_board += "<td class='empty'></td>";
      }
      game_board += '</tr>';
    }

    document.getElementById('game_board').innerHTML = game_board;

    var td = document.getElementById('game_board').getElementsByTagName('td');

    for (var i = 0; i < td.length; i++) {
      if (td[i].addEventListener) {
        td[i].addEventListener('click', that.act, false);
      } else if (td[i].attachEvent) {
        td[i].attachEvent('click', that.act);
      }
    }
  }

  act(e) {
    var element = e.target || window.event.srcElement;

    if (that.round == 0) that.place(element.cellIndex);

    if (that.round == 1) that.generateComputerDecision();
  }

  place(column) {
    if (
      that.board.score() != that.score &&
      that.board.score() != -that.score &&
      !that.board.isFull()
    ) {
      for (var y = that.rows - 1; y >= 0; y--) {
        if (
          document.getElementById('game_board').rows[y].cells[column]
            .className == 'empty'
        ) {
          if (that.round == 1) {
            document.getElementById('game_board').rows[y].cells[
              column
            ].className = 'coin cpu-coin';
          } else {
            document.getElementById('game_board').rows[y].cells[
              column
            ].className = 'coin human-coin';
          }
          break;
        }
      }

      if (!that.board.place(column)) {
        return swal('Invalid move!', '', 'error');
      }

      that.round = that.switchRound(that.round);
      that.updateStatus();
    }
  }

  generateComputerDecision() {
    if (
      that.board.score() != that.score &&
      that.board.score() != -that.score &&
      !that.board.isFull()
    ) {
      that.iterations = 0;

      setTimeout(function() {

        var ai_move = that.maximizePlay(that.board, that.depth);



        that.place(ai_move[0]);

        document.getElementById('ai-column').innerHTML =
          'Column: ' + parseInt(ai_move[0] + 1);
        document.getElementById('ai-score').innerHTML = 'Score: ' + ai_move[1];
        document.getElementById('ai-iterations').innerHTML = that.iterations;
      }, 100);
    }
  }
  maximizePlay(board, depth, alpha, beta) {
    var score = board.score();

    if (board.isFinished(depth, score)) return [null, score];

    var max = [null, -99999];

    for (var column = 0; column < that.columns; column++) {
      var new_board = board.copy();

      if (new_board.place(column)) {
        that.iterations++;

        var next_move = that.minimizePlay(new_board, depth - 1, alpha, beta);

        if (max[0] == null || next_move[1] > max[1]) {
          max[0] = column;
          max[1] = next_move[1];
          alpha = next_move[1];
        }

        if (alpha >= beta) return max;
      }
    }

    return max;
  }
  minimizePlay(board, depth, alpha, beta) {
    var score = board.score();

    if (board.isFinished(depth, score)) return [null, score];

    var min = [null, 99999];

    for (var column = 0; column < that.columns; column++) {
      var new_board = board.copy();

      if (new_board.place(column)) {
        that.iterations++;

        var next_move = that.maximizePlay(new_board, depth - 1, alpha, beta);

        if (min[0] == null || next_move[1] < min[1]) {
          min[0] = column;
          min[1] = next_move[1];
          beta = next_move[1];
        }

        if (alpha >= beta) return min;
      }
    }
    return min;
  }
  switchRound(round) {
    return round ^ 1;
  }
  updateStatus() {
    if (that.board.score() == -that.score) {
      that.status = 1;
      that.markWin();
      swal('You have won!', '', 'success');
    }

    // Computer won
    if (that.board.score() == that.score) {
      that.status = 2;
      that.markWin();
      swal('You have lost!', '', 'error');
    }

    // Tie
    if (that.board.isFull()) {
      that.status = 3;
      swal('opps .. board full', '', 'info');
    }
  }
  markWin() {
    document.getElementById('game_board').className = 'finished';
    for (var i = 0; i < that.winning_array.length; i++) {
      var name = document.getElementById('game_board').rows[
        that.winning_array[i][0]
      ].cells[that.winning_array[i][1]].className;
      document.getElementById('game_board').rows[
        that.winning_array[i][0]
      ].cells[that.winning_array[i][1]].className = name + ' win';
    }
  }
}

function Start() {
  window.Game = new Game();
}

window.onload = function() {
  Start();
};
