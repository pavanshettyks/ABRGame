import React from "react";
import "../css/GameLobby.css";

const GameLobby = ({ gameId, players, isHost, onStartGame}) => {
  const basePath = window.location.pathname.endsWith("/") 
    ? window.location.pathname 
    : window.location.pathname + "/";

  const gameUrl = `${window.location.origin}${basePath}?gameId=${gameId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameUrl);
  };

  return (
    <div className="game-lobby-container">
      <h2>Game Lobby</h2>
      <p>Game URL: {gameUrl}</p>
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