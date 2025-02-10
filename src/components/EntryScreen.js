import React, { useState, useEffect } from "react";
import "../css/EntryScreen.css";

const EntryScreen = ({ onHostGame, onJoinGame }) => {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameIdFromUrl = params.get("gameId");
    if (gameIdFromUrl) {
      setGameId(gameIdFromUrl);
    }
  }, []);

  return (
    <div className="entry-container">
      <h1>Enter Game</h1>
      <input
        type="text"
        className="input-field"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* <button className="button" onClick={handleSubmit}>Submit Name</button> */}
      <button className="button" onClick={() => onHostGame(name)}>Host Game</button>
      <input
        type="text"
        className="input-field"
        placeholder="Enter Game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      />
      <button className="button" onClick={() => onJoinGame(name, gameId)}>Join Game</button>
    </div>
  );
};

export default EntryScreen;