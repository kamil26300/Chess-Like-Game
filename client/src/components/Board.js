import React, { useState } from "react";
import Cell from "./Cell";
import { socket } from "../socket";

function Board({ gameState, makeMove, submitInit }) {
  const [selectInitChar, setSelectInitChar] = useState([
    "P1",
    "P2",
    "P3",
    "H1",
    "H2",
  ]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isSelected, setIsSelected] = useState(null);
  const [displayMoves, setDisplayMoves] = useState(null);

  const moves = {
    straight: ["L", "R", "F", "B"],
    diagonal: ["FL", "FR", "BL", "BR"],
  };

  const player = gameState.players[socket.id];
  const displayRows =
    player !== "A" ? gameState.board : [...gameState.board].reverse();

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (index) => {
    const newOrder = [...selectInitChar];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    setSelectInitChar(newOrder);
    setDraggedIndex(null);
  };

  const onSelect = (x, y, piece) => {
    setIsSelected({ player, x, y: player === "A" ? 4 - y : y, piece });
    setDisplayMoves(piece.char === "H2" ? moves.diagonal : moves.straight);
  };

  const handleSubmit = () => {
    submitInit(selectInitChar);
  };

  const handleMove = (move) => {
    setIsSelected(null);
    setDisplayMoves(null);
    makeMove(isSelected, move);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p>Current Player: {gameState.currentPlayer}</p>
      <div className="grid gap-1 grid-rows-5 w-[400px] h-[400px] border border-black p-1">
        {displayRows.map((row, y) => (
          <div key={y} className="flex gap-1">
            {row.map((cell, x) => (
              <Cell
                key={`${x}-${y}`}
                x={x}
                y={y}
                piece={cell}
                gameState={gameState}
                onSelect={onSelect}
                isSelected={isSelected}
                player={player}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-1 flex-col text-red-500">
        {!gameState.A.init && (
          <p>{player === "A" ? "You are" : "A is"} yet to initialize.</p>
        )}
        {!gameState.B.init && (
          <p>{player === "B" ? "You are" : "B is"} yet to initialize.</p>
        )}
      </div>

      {displayMoves && (
        <>
          <div className="grid gap-2 grid-cols-4">
            {displayMoves.map((move, id) => {
              return (
                <button
                  key={id}
                  onClick={() => handleMove(move)}
                  className="p-3 border-2 border-black"
                >
                  {move}
                </button>
              );
            })}
          </div>
          <p className="text-blue-600">*Select your move*</p>
        </>
      )}

      {!gameState[player].init && (
        <>
          <div className="grid gap-2 grid-cols-5">
            {selectInitChar.map((char, id) => {
              return (
                <button
                  key={id}
                  draggable
                  onDragStart={() => handleDragStart(id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(id)}
                  className="p-3 border-2 border-black"
                >
                  {char}
                </button>
              );
            })}
          </div>
          <p className="text-blue-600">*Drag and arrange*</p>
          <button onClick={handleSubmit} className="p-3 border-2 border-black">
            Submit
          </button>
        </>
      )}
    </div>
  );
}

export default Board;
