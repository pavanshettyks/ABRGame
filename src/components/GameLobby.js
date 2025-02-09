import React from "react";
import "../css/GameLobby.css";

const GameLobby = ({ gameId, players, isHost, onStartGame}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameId);
  };

  return (
    <div className="game-lobby-container">
      <h2>Game Lobby</h2>
      <p>Game ID: {gameId}</p>
      <button className="copy-button" onClick={copyToClipboard}>
          Copy
      </button>
      <div className="player-list">
        {players.map((player) => (
          <div key={player.id} className="player-item">
            {player.id}. {player.name}
          </div>
        ))}
      </div>
      {isHost && <button className="start-game-button" onClick={onStartGame}>Start Game</button>}
    </div>
  );
};

export default GameLobby;