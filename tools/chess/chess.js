/* Tiny Chess v0.1
 * Copyright (c) 2017 Eugene Y. Q. Shen.
 *
 * Tiny Chess is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version
 * 3 of the License, or (at your option) any later version.
 *
 * Tiny Chess is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */


// global variables

let state;                          // state of a board at a given turn;
let history;                        // history of all states of the board
let white_turn;                     // true = white, false = black
let selection;                      // ex. {piece: "P", row: 3, col: 5}
let error;                          // ex. {row: 0, col: 7}


// constants

const ROWS = 8;
const COLS = 8;
const WHITE_PIECES = "PNBRQK";
const BLACK_PIECES = "pnbrqk";
const INITIAL_CASTLE = {0: {0: true, 7: true}, 7: {0: true, 7: true}};
const FINAL_CASTLE = {0: {0: false, 7: false}, 7: {0: false, 7: false}};
const INITIAL_BOARD = [
  "R", "N", "B", "K", "Q", "B", "N", "R",
  "P", "P", "P", "P", "P", "P", "P", "P",
  "",  "",  "",  "",  "",  "",  "",  "",
  "",  "",  "",  "",  "",  "",  "",  "",
  "",  "",  "",  "",  "",  "",  "",  "",
  "",  "",  "",  "",  "",  "",  "",  "",
  "p", "p", "p", "p", "p", "p", "p", "p",
  "r", "n", "b", "k", "q", "b", "n", "r",
];
const INITIAL_STATE = {
  board: INITIAL_BOARD,
  current_turn: 0,
  en_passant_column: -1,
  can_castle: INITIAL_CASTLE,
};


// convert row and col to cell number

function toCell(row, col) {
  return row * COLS + col;
}


// get the CSS class of a piece

function getClass(piece, row, col) {
  const result = ["cell"];
  if (selection && selection.row === row && selection.col === col) {
    result.push("active");
  }
  if (error && error.row === row && error.col === col) {
    result.push("error");
  }
  if (piece) {
    if (WHITE_PIECES.indexOf(piece) !== -1) {
      result.push("white");
    } else if (BLACK_PIECES.indexOf(piece) !== -1) {
      result.push("black");
    }
  }
  return result.join(" ");
}


// get the representation of a piece

function getIcon(piece) {
  switch (piece) {
  case "K": return "\u2654"; case "k": return "\u265A";
  case "Q": return "\u2655"; case "q": return "\u265B";
  case "R": return "\u2656"; case "r": return "\u265C";
  case "B": return "\u2657"; case "b": return "\u265D";
  case "N": return "\u2658"; case "n": return "\u265E";
  case "P": return "\u2659"; case "p": return "\u265F";
  default: return piece;
  }
}


/* return true iff the player can castle with the rook in the given position
 * requires:
 *  - 0 <= selection.row, row < ROWS
 *  - 0 <= selection.col, col < COLS
 */

function canCastle(selection, row, col) {
  let rook_col;
  if (col === 1) {
    rook_col = 0;
  } else if (col === 5) {
    rook_col = 7;
  } else {
    return false;
  }
  if (!isEmpty("orthogonal", selection.row, selection.col, row, rook_col)) {
    return false;
  }
  if (row !== 0 && row !== 7) {
    return false;
  }
  return state.can_castle[row][rook_col];
}


/* return true iff all the squares between start and end exclusive are empty
 *  - e.g. to move a bishop from (0,0) to (2,2), only (1,1) must be empty
 * requires:
 *  - direction = "orthogonal" or "diagonal"
 *  - 0 <= start_row, end_row < ROWS
 *  - 0 <= start_col, end_col < COLS
 */

function isEmpty(direction, start_row, start_col, end_row, end_col) {
  switch (direction) {
  case "orthogonal":
    if (start_row === end_row) {
      if (start_col < end_col) {
        for (let col = start_col + 1; col < end_col; col++) {
          if (state.board[toCell(start_row, col)]) {
            return false;
          }
        }
        return true;
      } else if (start_col > end_col) {
        for (let col = start_col - 1; col > end_col; col--) {
          if (state.board[toCell(start_row, col)]) {
            return false;
          }
        }
        return true;
      }
    } else if (start_col === end_col) {
      if (start_row < end_row) {
        for (let row = start_row + 1; row < end_row; row++) {
          if (state.board[toCell(row, start_col)]) {
            return false;
          }
        }
        return true;
      } else if (start_row > end_row) {
        for (let row = start_row - 1; row > end_row; row--) {
          if (state.board[toCell(row, start_col)]) {
            return false;
          }
        }
        return true;
      }
    }
    break;
  case "diagonal":
    if (start_row - end_row === start_col - end_col) {
      if (start_row < end_row) {
        for (let row = start_row + 1, col = start_col + 1;
            row < end_row && col < end_col; row++, col++) {
          if (state.board[toCell(row, col)]) {
            return false;
          }
        }
        return true;
      } else if (start_row > end_row) {
        for (let row = start_row - 1, col = start_col - 1;
            row > end_row && col > end_col; row--, col--) {
          if (state.board[toCell(row, col)]) {
            return false;
          }
        }
        return true;
      }
    } else if (start_row - end_row === end_col - start_col) {
      if (start_row < end_row) {
        for (let row = start_row + 1, col = start_col - 1;
            row < end_row && col > end_col; row++, col--) {
          if (state.board[toCell(row, col)]) {
            return false;
          }
        }
        return true;
      } else if (start_row > end_row) {
        for (let row = start_row - 1, col = start_col + 1;
            row > end_row && col < end_col; row--, col++) {
          if (state.board[toCell(row, col)]) {
            return false;
          }
        }
        return true;
      }
    }
    break;
  }
  return false;
}


/* return true iff the given selection can move to the given cell
 * requires:
 *  - the piece at (row, col) is not a friendly piece
 *  - 0 <= selection.row, row < ROWS
 *  - 0 <= selection.col, col < COLS
 */

function canMove(selection, row, col) {
  switch (selection.piece.toLowerCase()) {
  case "p":
    // TODO: promotion
    if (col === selection.col) {
      // cannot capture given cell
      const direction = white_turn ? 1 : -1;
      if (isEmpty("orthogonal",
          selection.row, selection.col, row + direction, col)) {
        // normal move
        return row === selection.row + direction
        // first move
            || (white_turn && selection.row === 1 && row === 3)
            || (!white_turn && selection.row === 6 && row === 4);
      }
    } else if ((col === selection.col + 1 || col === selection.col - 1)
        && isEmpty("diagonal", selection.row, selection.col, row, col)) {
      // capturing move
      return ((white_turn && row === selection.row + 1)
              || (!white_turn && row === selection.row - 1))
          && (state.board[toCell(row, col)]
              || (((white_turn && row === 5) || (!white_turn && row === 2))
                  && col === state.en_passant_column));
    }
    break;
  case "n":
    return ((col === selection.col + 2 || col === selection.col - 2)
            && (row === selection.row + 1 || row === selection.row - 1))
        || ((col === selection.col + 1 || col === selection.col - 1)
            && (row === selection.row + 2 || row === selection.row - 2));
    break;
  case "b":
    return isEmpty("diagonal", selection.row, selection.col, row, col);
    break;
  case "r":
    return isEmpty("orthogonal", selection.row, selection.col, row, col);
    break;
  case "q":
    return isEmpty("diagonal", selection.row, selection.col, row, col)
        || isEmpty("orthogonal", selection.row, selection.col, row, col);
    break;
  case "k":
    return ((col === selection.col + 1 || col === selection.col
            || col === selection.col - 1)
        && (row === selection.row + 1 || row === selection.row
            || row === selection.row - 1))
    // castling, TODO: check
        || (row === selection.row && canCastle(selection, row, col)
            && (col === selection.col + 2 || col === selection.col - 2));
    break;
  }
  return false;
}


/* move the selected piece to the given cell
 * requires: the move is already validated by canMove
 * modifies: state
 */

function doMove(selection, row, col) {
  const piece = selection.piece.toLowerCase();
  state.board[toCell(row, col)] = selection.piece;
  state.board[toCell(selection.row, selection.col)] = "";

  // en passant
  if (piece === "p" && col !== selection.col
      && ((white_turn && row === 5) || (!white_turn && row === 2))
      && state.en_passant_column === col) {
    if (white_turn) {
      state.board[toCell(row - 1, col)] = "";
    } else {
      state.board[toCell(row + 1, col)] = "";
    }
  }
  if (piece === "p"
      && (row === selection.row + 2 || row === selection.row - 2)) {
    state.en_passant_column = col;
  } else {
    state.en_passant_column = -1;
  }

  // castling
  if (piece === "k") {
    if (col === selection.col + 2) {
      state.board[toCell(row, col - 1)] = state.board[toCell(row, COLS - 1)];
      state.board[toCell(row, COLS - 1)] = "";
    } else if (col === selection.col - 2) {
      state.board[toCell(row, col + 1)] = state.board[toCell(row, 0)];
      state.board[toCell(row, 0)] = "";
    } else {
      state.can_castle = JSON.parse(JSON.stringify(FINAL_CASTLE));
    }
  }
  if (piece === "r" && (selection.row === 0 || selection.row === 7)) {
    state.can_castle[selection.row][selection.col] = false;
  }
}


/* decide what to do when user clicks
 * requires: 0 <= row < ROWS, 0 <= col < COLS
 * modifies: state, selection, error
 */

function clickCell(row, col) {
  const cell = toCell(row, col);
  const piece = state.board[cell];
  if (selection) {
    if (selection.row === row && selection.col === col) {
      selection = null;
      error = null;
    } else if ((!piece || (white_turn && WHITE_PIECES.indexOf(piece) === -1)
            || (!white_turn && BLACK_PIECES.indexOf(piece) === -1))
        && canMove(selection, row, col)) {
      doMove(selection, row, col);
      selection = null;
      error = null;
      state.current_turn++;
      history.push(JSON.stringify(state));
      white_turn = !(state.current_turn % 2);
    } else {
      error = {row, col};
    }
  } else if (piece && ((white_turn && WHITE_PIECES.indexOf(piece) !== -1)
      || (!white_turn && BLACK_PIECES.indexOf(piece) !== -1))) {
    selection = {piece, row, col};
    error = null;
  } else {
    error = {row, col};
  }
  render();
}


// restore the board to its state at the given turn

function restoreBoard(turn) {
  history.splice(turn + 1);
  state = JSON.parse(history[turn]);
  white_turn = !(turn % 2);
  selection = null;
  render();
}


// render the board

function render() {
  const main_element = document.getElementById("main");
  let html = [];
  for (let row = 0; row < ROWS; row++) {
    html.push("<div class='row'>\n");
    for (let col = 0; col < COLS; col++) {
      const piece = state.board[toCell(row, col)];
      html.push(
				`  <div class="${getClass(piece, row, col)}">
					   <div class="piece">${getIcon(piece)}</div>
           </div>`
			);
    }
    html.push("</div>\n");
  }
  main_element.innerHTML = html.join("");

  // add event listeners
  const row_list = main_element.children;
  for (let row = 0; row < ROWS; row++) {
    const cell_list = main_element.children[row].children;
    for (let col = 0; col < COLS; col++) {
      cell_list[col].addEventListener("click", () => clickCell(row, col));
    }
  }
}


// undo the previous move

function undoMove() {
  restoreBoard(state.current_turn - 1);
}


// start the game

function startGame() {
  state = JSON.parse(JSON.stringify(INITIAL_STATE));
  history = [JSON.stringify(state)];
  white_turn = true;
  selection = null;
  error = null;
  render();
}


// add all event listeners when ready

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start").addEventListener("click", startGame);
  document.getElementById("undo").addEventListener("click", undoMove);
});
