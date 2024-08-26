import React, { useState } from "react";
import { Button } from "./Buttons";

function GameControls({ createGame, joinGame }) {
  const [joinId, setJoinId] = useState("");

  return (
    <div className="flex flex-col gap-8 justify-center items-center p-4 border-4 border-black">
      <Button onClick={createGame}>Create New Game</Button>
      <div className="flex gap-2">
        <input
          type="text"
          className="border-2 border-black px-2"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
          placeholder="Enter Game ID"
        />
        <Button
          disabled={joinId ? false : true}
          onClick={() => joinGame(joinId)}
        >
          Join Game
        </Button>
      </div>
    </div>
  );
}

export default GameControls;
