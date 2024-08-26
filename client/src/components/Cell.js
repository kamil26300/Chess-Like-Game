import React, { useEffect, useState } from "react";

function Cell({ x, y, piece, player, isSelected, onSelect, gameState }) {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (
      player === gameState.currentPlayer &&
      piece?.player === gameState.currentPlayer &&
      gameState.A.init &&
      gameState.B.init
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [gameState]);

  return (
    <button
      onClick={() => onSelect(x, y, piece)}
      disabled={disabled}
      className={`flex border border-black items-center justify-center font-bold disabled:cursor-not-allowed w-full h-full
        ${
          isSelected?.player === "A" &&
          isSelected?.x === x &&
          isSelected?.y === 4 - y
            ? "bg-yellow-200"
            : ""
        }
        ${
          isSelected?.player === "B" &&
          isSelected?.x === x &&
          isSelected?.y === y
            ? "bg-yellow-200"
            : ""
        }
        ${
          piece
            ? player === piece.player
              ? "bg-cyan-200"
              : "bg-red-200"
            : "bg-zinc-100"
        }
      `}
    >
      {piece?.player} - {piece?.char}
    </button>
  );
}

export default Cell;
