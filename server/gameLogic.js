const createGame = (player1) => {
  return {
    board: initializeBoard(),
    currentPlayer: "A",
    players: { [player1]: "A" },
    status: "waiting",
    A: { init: false },
    B: { init: false },
  };
};

const initializeBoard = () => {
  // Create an empty 5x5 board
  return Array(5)
    .fill(null)
    .map(() => Array(5).fill(null));
};

const directions = (player, i) => {
  if (player === "A")
    return {
      straight: { L: [-i, 0], R: [i, 0], F: [0, i], B: [0, -i] },
      diagonal: { FL: [-2, 2], FR: [2, 2], BL: [-2, -2], BR: [2, -2] },
    };
  else
    return {
      straight: { L: [-i, 0], R: [i, 0], F: [0, -i], B: [0, i] },
      diagonal: { FL: [-2, -2], FR: [2, -2], BL: [-2, 2], BR: [2, 2] },
    };
};

function anyWon(board) {
  let currentPlayer = null;

  for (let row of board) {
    for (let cell of row) {
      if (cell !== null) {
        if (currentPlayer === null) {
          currentPlayer = cell.player;
        } else if (cell.player !== currentPlayer) {
          return false;
        }
      }
    }
  }

  return currentPlayer;
}

const togglePlayer = (player) => (player === "A" ? "B" : "A");

module.exports = { createGame, togglePlayer, directions, anyWon };
