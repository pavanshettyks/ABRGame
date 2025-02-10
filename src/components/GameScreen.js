import React, { useState, useEffect } from "react";
import "../css/GameScreen.css";
import Hand from "./Hand";
import Card from "./Card";

const GameScreen = ({ playersDetails, currentPlayer, gameData, dropCard, currentPlayerTurn, enableNextTurnButton, onNextTurnButton}) => {
  let currentTurnPlayerName = null;
  let currentPlayerHand = null;
  const cutterCard = gameData.cutterCard;
  const indexOfCurrentPlayer = playersDetails.players.findIndex(player => player.name === currentPlayer);

  if (gameData && gameData.playersToCard){
    currentTurnPlayerName = playersDetails.players[currentPlayerTurn].name;
    currentPlayerHand = gameData.playersToCard[indexOfCurrentPlayer];
  }

//   const handleNextTurn = () => {
//     setTurnIndex((prev) => (prev + 1) % players.length);
//     if ((turnIndex + 1) % players.length === 0) {
//     //   setRound((prev) => Math.min(prev + 1, 10));
//     }
//   };

  return (
    <div className="game-screen"> 
      <h2>Round {gameData.roundNumber}</h2> 
      <div className="player-circle"> 
        {playersDetails.players.map((player, index) => {
          const angle = (360 / playersDetails.players.length) * index;
          const playerCard = player.droppedCard;
          return (
            <div
              key={player.id}
              className={`player ${index === currentPlayerTurn ? "active" : ""} ${player.name === currentPlayer ? "current-player" : ""} ${player.team === "A" ? "team-a" : "team-b"}`}
              style={{ transform: `rotate(${angle}deg) translate(120px) rotate(-${angle}deg)` }}
            >
              {player.name}
              {playerCard && (
                    <div className="player-card" style={{ transform: `translate(20px, 20px)` }}>
                       <Card suit={playerCard.suit} rank={playerCard.rank} />
                    </div>
                )} 
            </div>
          );
        })}
      </div>
      <div className="current-player-view">
        {enableNextTurnButton && <button className="start-next-turn-button" onClick={onNextTurnButton}>Start Next Turn</button> }
        <h3>Cutter card is: {cutterCard}</h3>
        {currentTurnPlayerName && <h3>Player Turn: {currentTurnPlayerName}</h3> }
        {gameData && gameData.playersToCard   
            && <Hand initialCards={gameData.playersToCard[indexOfCurrentPlayer]} 
                     currentTurnPlayer = {currentPlayerTurn}
                     currentPlayer = {indexOfCurrentPlayer}
                     maxCardsAtHand = {gameData.roundNumber - playersDetails.currentIterationCounter}
                     dropCard={dropCard}
                />}
      </div>
    </div>
  );
};

export default GameScreen;