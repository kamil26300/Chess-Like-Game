import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import Board from "./components/Board";
import GameControls from "./components/GameControls";
import { Button } from "./components/Buttons";

function App() {
  const [gameId, setGameId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [win, setWin] = useState(null);

  useEffect(() => {
    socket.on("gameCreated", (id, game) => {
      setGameId(id);
      setGameState(game);
    });
    socket.on("gameStart", (game, id) => {
      setGameId(id);
      setGameState(game);
    });
    socket.on("initUpdate", (state) => setGameState(state));
    socket.on("moveUpdate", (state) => setGameState(state));
    socket.on("gameWon", (won) => setWin(won));
    socket.on("error", (msg) => alert(msg));

    return () => {
      socket.off("gameCreated");
      socket.off("initUpdate");
      socket.off("moveUpdate");
      socket.off("gameStart");
      socket.off("gameWon");
      socket.off("error");
    };
  }, []);

  const createGame = () => socket.emit("createGame");
  const joinGame = (id) => socket.emit("joinGame", id);
  const makeMove = (selected, move) =>
    socket.emit("makeMove", gameId, selected, move);
  const submitInit = (selectInitChar) =>
    socket.emit("initChar", gameId, selectInitChar);

  const player = gameState?.players[socket.id];

  const handleCopy = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      alert("Failed to copy text: ", err);
    }
  };
  
  const reset = () => {
    setGameId(null)
    setCopied(null)
    setGameState(null)
    setWin(null)
  }

  return (
    <div className="App w-full items-center justify-center flex flex-col p-8 gap-8">
      <h1 className="text-3xl">Chess Like Game</h1>
      {!win ? (
        !gameState ? (
          <GameControls createGame={createGame} joinGame={joinGame} />
        ) : gameState.status !== "waiting" ? (
          <Board
            gameState={gameState}
            makeMove={makeMove}
            submitInit={submitInit}
          />
        ) : (
          gameId && (
            <div className="flex flex-col gap-2 justify-center items-center">
              <p className="text-3xl">Another player yet to join</p>
              <div className="flex gap-2 items-center">
                <p className="w-min flex">{}</p>
                <Button onClick={() => handleCopy(gameId)}>
                  {copied ? "Copied " : `Game ID: ${gameId}`}
                </Button>
              </div>
            </div>
          )
        )
      ) : (
        <div className="flex flex-col justify-center items-center gap-2">
          <p className="text-green-500 text-2xl">
            <span className="text-4xl font-bolder">
              {win === player ? "You" : win}
            </span>{" "}
            won!
          </p>
          <p className="text-red-500 text-2xl">
            <span className="text-4xl font-bolder">
              {win !== player ? "You" : win === "A" ? "B" : "A"}
            </span>{" "}
            lost!
          </p>
          <Button onClick={reset}>Re Play</Button>
        </div>
      )}
    </div>
  );
}

export default App;
