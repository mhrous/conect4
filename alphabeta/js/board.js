class Board {
    constructor(game, field, player) {
      this.game = game;
      this.field = field;
      this.player = player;
    }

    isFinished(depth, score) {
      return (
        depth == 0 ||
        score == this.game.score ||
        score == -this.game.score ||
        this.isFull()
      );
    }

    place(column) {
      if (
        this.field[0][column] == null &&
        column >= 0 &&
        column < this.game.columns
      ) {
        for (let y = this.game.rows - 1; y >= 0; y--) {
          if (this.field[y][column] == null) {
            this.field[y][column] = this.player;
            break;
          }
        }
        this.player = this.game.switchRound(this.player);
        return true;
      } else {
        return false;
      }
    }

    scorePosition(row, column, delta_y, delta_x) {
      let human_points = 0;
      let computer_points = 0;

      this.game.winning_array_human = [];
      this.game.winning_array_cpu = [];

      for (let i = 0; i < ITEM_WIN; i++) {
        if (this.field[row][column] == 0) {
          this.game.winning_array_human.push([row, column]);
          human_points++;
        } else if (this.field[row][column] == 1) {
          this.game.winning_array_cpu.push([row, column]);
          computer_points++;
        }

        row += delta_y;
        column += delta_x;
      }

      if (human_points == ITEM_WIN) {
        this.game.winning_array = this.game.winning_array_human;
        return -this.game.score;
      } else if (computer_points == ITEM_WIN) {
        this.game.winning_array = this.game.winning_array_cpu;
        return this.game.score;
      } else {
        return computer_points;
      }
    }

    score() {
      let vertical_points = 0;
      let horizontal_points = 0;
      let diagonal_points1 = 0;
      let diagonal_points2 = 0;

      for (let row = 0; row < this.game.rows - (ITEM_WIN - 1); row++) {
        for (let column = 0; column < this.game.columns; column++) {
          let score = this.scorePosition(row, column, 1, 0);
          if (score == this.game.score) return this.game.score;
          if (score == -this.game.score) return -this.game.score;
          vertical_points += score;
        }
      }

      for (let row = 0; row < this.game.rows; row++) {
        for (
          let column = 0;
          column < this.game.columns - (ITEM_WIN - 1);
          column++
        ) {
          let score = this.scorePosition(row, column, 0, 1);
          if (score == this.game.score) return this.game.score;
          if (score == -this.game.score) return -this.game.score;
          horizontal_points += score;
        }
      }

      for (let row = 0; row < this.game.rows - (ITEM_WIN - 1); row++) {
        for (
          let column = 0;
          column < this.game.columns - (ITEM_WIN - 1);
          column++
        ) {
          let score = this.scorePosition(row, column, 1, 1);
          if (score == this.game.score) return this.game.score;
          if (score == -this.game.score) return -this.game.score;
          diagonal_points1 += score;
        }
      }

      for (let row = 3; row < this.game.rows; row++) {
        for (
          let column = 0;
          column < this.game.columns - (ITEM_WIN - 1);
          column++
        ) {
          let score = this.scorePosition(row, column, -1, +1);
          if (score == this.game.score) return this.game.score;
          if (score == -this.game.score) return -this.game.score;
          diagonal_points2 += score;
        }
      }

      return (
        horizontal_points + vertical_points + diagonal_points1 + diagonal_points2
      );
    }
    isFull() {
      for (let i = 0; i < this.game.columns; i++) {
        if (this.field[0][i] == null) {
          return false;
        }
      }
      return true;
    }
    copy() {
      const new_board = new Array();
      for (let i = 0; i < this.field.length; i++) {
        new_board.push(this.field[i].slice());
      }
      return new Board(this.game, new_board, this.player);
    }
  }






