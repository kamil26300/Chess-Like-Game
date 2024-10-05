const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const gameLogic = require("./gameLogic");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  path: "/api/socket",
  cors: {
    origin: "https://heros-quest.vercel.app/",
    methods: ["GET", "POST"],
  },
});

const games = new Map();

io.on("connection", (socket) => {
  // console.log(`${socket.id} connected`);

  socket.on("createGame", () => {
    const gameId = Math.random().toString(36).substring(7);
    games.set(gameId, gameLogic.createGame(socket.id));
    socket.join(gameId);
    socket.emit("gameCreated", gameId, games.get(gameId));
  });

  socket.on("initChar", (gameId, arr) => {
    const game = games.get(gameId);
    if (game.players[socket.id] === "A") {
      const playerA = arr.map((char) => ({ player: "A", char: char }));
      game.board[0] = playerA;
    } else {
      const playerB = arr.map((char) => ({ player: "B", char: char }));
      game.board[4] = playerB;
    }
    game[game.players[socket.id]].init = true;
    io.emit("initUpdate", game);
  });

  socket.on("joinGame", (gameId) => {
    const game = games.get(gameId);
    if (game && !game.players[socket.id]) {
      socket.join(gameId);
      game.players[socket.id] = "B";
      game.status = "joined";
      if (game.players[[socket.id]]) {
        io.emit("gameStart", game, gameId);
      }
    } else {
      io.to(socket.id).emit("error", "Game not found or full");
    }
  });

  const makeMove = (game, selected, move, direction, i) => {
    const [dx, dy] = gameLogic.directions(selected.player, i)[direction][move];
    const [x, y] = [selected.x, selected.y];
    let { board, currentPlayer } = game;
    if (dx + x > 4 || dx + x < 0 || dy + y > 4 || dy + y < 0) {
      io.to(socket.id).emit("error", "Move out of bound. Try Again!");
    } else if (board[dy + y][dx + x]?.player === selected.player) {
      io.to(socket.id).emit("error", "Cannot kill your own character.");
    } else {
      game.currentPlayer = gameLogic.togglePlayer(currentPlayer);
      if (i === 1) board[y][x] = null;
      else {
        board[y][x] = null;
        board[dy / 2 + y][dx / 2 + x] = null;
      }
      board[dy + y][dx + x] = {
        player: selected.piece.player,
        char: selected.piece.char,
      };
      io.emit("moveUpdate", game);
    }
    if (gameLogic.anyWon(board)) {
      io.emit("gameWon", gameLogic.anyWon(board));
    }
  };

  socket.on("makeMove", (gameId, selected, move) => {
    const game = games.get(gameId);

    if (selected.piece.char === "H2") {
      makeMove(game, selected, move, "diagonal", 2);
    } else if (selected.piece.char === "H1") {
      makeMove(game, selected, move, "straight", 2);
    } else {
      makeMove(game, selected, move, "straight", 1);
    }
  });
  // socket.on("disconnect", () => {
  //   console.log(`${socket.id} disconnected`);
  // });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
