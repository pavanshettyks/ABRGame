import React, { useState, useEffect } from "react";
import Peer from "peerjs";
import "./App.css";
import EntryScreen from "./components/EntryScreen";
import GameLobby from "./components/GameLobby";
import "./css/GameLobby.css";
import GameScreen from "./components/GameScreen";
import { initializeGame } from "./components/GameLogic";

function App() {
  const [gameId, setGameId] = useState(null);
  // const [players, setPlayers] = useState([]);
  const [playersDetails, setPlayersDetails] = useState({"players":[], "currentPlayerTurn": 0, "currentIterationCounter": 1, "isGamePaused": true});
  const [isHost, setIsHost] = useState(false);
  const [isInLobby, setIsInLobby] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [peer, setPeer] = useState(null);
  const [connections, setConnections] = useState({}); 
  const [playerMap, setPlayerMap] = useState({});

  const [currentRound, setCurrentRound] = useState(null);
  const [currentIteration, setCurrentIteration] = useState(null);  
  const [gameData, setGameData] = useState({});
  const [connectionToHost, setconnectionToHost] = useState(null);

  // const [isWaitToDropCard, setIsWaitToDropCard] = useState(false);

  useEffect(() => {
  if (isHost) {
    let newPeer = null;
    if (!peer){
        newPeer = new Peer();
        newPeer.on("open", (id) => {
        console.log("Host Peer ID:", id);
        setGameId(id); // Set gameId to the peer ID
      });
      setPeer(newPeer);
    } else {
      newPeer = peer;
    }
    newPeer.on("connection", (conn) => {
      // console.log("Player connected:", conn.peer);
      conn.on("data", (data) => {
        // console.log("Received data:", data);
        if (data.type === "join") {
            // setPlayers((prev) => {
            //   const team = prev.length % 2 === 0 ? "A" : "B";
            //   const updatedPlayers = [...prev, { id: prev.length + 1, name: data.playerName, team }];
            //   return updatedPlayers;
            // });
            // console.log(playersDetails);
            setPlayersDetails((prev) => {
              const team = prev.players.length % 2 === 0 ? "A" : "B";
              const updatedPlayers = [...prev.players, { id: prev.players.length + 1, name: data.playerName, team }];
              return {"players":updatedPlayers, "currentPlayerTurn":0, "currentIterationCounter": 1, "isGamePaused": true};
            });
            setPlayerMap((prev) => {
              const playerCount = Object.keys(prev).length;
              const team = playerCount % 2 === 0 ? "A" : "B";
              const updatedMap = {
                ...prev,
              [data.playerName]: { connection: conn, teamName: team }
              };
              // console.log("Updated player map:", updatedMap);
              setTimeout(() => broadCastPlayersData(updatedMap), 0);
              return updatedMap;
            });
            setConnections((prev) => {
              const updatedConnections = { ...prev, [conn.peer]: conn };
              // console.log("Current connections:", updatedConnections);
              return updatedConnections;
            });
          }
        if (data.type === "gameProgress") {
            // console.log(data.playersData);
            setPlayersDetails((prev) => {
              return data.playersData;
            });
            setCurrentIteration(data.playersData.currentIterationCounter);
          }
      });
    });
    // if (gameStarted) {
    //     broadCastGameData();
    // }
    setPeer(newPeer);
  }
}, [isHost, gameStarted]);

// Trigger update and broadcast players information which includes current dropped card and player turn
  useEffect(() => {
    console.log("recieved an update", isHost, playersDetails);
    if (isHost && gameStarted) {
      console.log("recieved an update", playersDetails);
      broadCastPlayersDataDuringGame(playersDetails);
    }
  }, [playersDetails]);  

// This will be used as a trigger to send game data for every round
useEffect(() => {
  if (isHost && currentRound) {
    setCurrentIteration(1);
    const gameData = initializeGame(currentRound, playerMap);
    broadCastGameData(gameData)
    // setIsWaitToDropCard(true);
    let updatePlayerDetails = playersDetails;
    updatePlayerDetails.isGamePaused = true;
    setPlayersDetails(updatePlayerDetails)
    // handleResetDroppedCards(gameData.currentPlayerTurn, 1, true);
  }
 }, [currentRound]);

 // This will be used to trigger update round after finishing all iterations in the prev round
 useEffect(() => {
  if (isHost && currentIteration && gameData ) {
    if (currentIteration > currentRound){
      setCurrentRound(currentRound+1);
      setCurrentIteration(1);
    } 
    if (currentIteration > 1) {
      let updatePlayerDetails = playersDetails;
      updatePlayerDetails.isGamePaused = true;
      setPlayersDetails(updatePlayerDetails)
      // handleResetDroppedCards(playersDetails.currentPlayerTurn, currentIteration, true)
    }
  }
 }, [currentIteration]);

 // This will wait for Host to reset the round/iteration
// useEffect(() => {
//   if (isHost && !isWaitToDropCard) {
//     handleResetDroppedCards(gameData.currentPlayerTurn, currentIteration);
//     setIsWaitToDropCard(false);
//   }
//  }, [isWaitToDropCard]);

// For non host to handle updates
  useEffect(() => {
    if (!isHost && isInLobby) {
      const newPeer = new Peer();
      newPeer.on("open", (id) => {
          // console.log("Player Peer ID:", id);
          const conn = newPeer.connect(gameId);
          conn.on("open", () => {
          console.log("Connected to host:", gameId, playerName);
          conn.send({ type: "join", playerName });
          setconnectionToHost(conn);
      });
      conn.on("data", (data) => {
        if (data.type === "playersData") {
          console.log("Recieved player data: ", data.playersData);
          setPlayersDetails(data.playersData);
        }
        if (data.type === "gameData") {
          // console.log("Game Data recieved", data)
          setGameStarted(data.data.isGame);
          setGameData(data.data.gameDetails); 
        }
      });
      setConnections((prev) => ({ ...prev, [gameId]: conn }));
    });
   setPeer(newPeer);
   setGameId(gameId);
    }
  }, [!isHost, isInLobby]);

  // send game details to all players
  const broadCastGameData = (gameData) => {
    // console.log(`Initial gameData:`, gameData);
    Object.entries(playerMap).forEach(([name, value]) => {
      if (value.connection && value.connection.open) {
        // console.log(`Broacasting game data to update Player: ${name}, team : ${value.teamName}`);
        value.connection.send({ type: "gameData", data: {isGame: true, gameDetails: gameData}});
      }
    });
    setGameData(gameData);
  };

  const broadCastPlayersDataDuringGame = (playersData) => {
    // console.log("Broadcasting the progress data during game", playerMap);
    Object.entries(playerMap).forEach(([name, value]) => {
      if (value.connection && value.connection.open) {
        // console.log(`Broacasting players data to Player: ${name}, team : ${value.teamName}`, playersData);
        value.connection.send({ type: "playersData", "playersData":playersData });
      }
    });
  };

  // can be removed
  const broadCastPlayersData = (updatedMap) => {
    // console.log(updatedMap);
    const players = Object.keys(updatedMap).map((playerName, index) => ({
      id: index + 1,  // id will be index + 1, since you want a sequence starting from 1
      name: playerName,
      team: updatedMap[playerName].teamName || "A"  // Default to "A" if teamName is not defined
    }));

    Object.entries(updatedMap).forEach(([name, value]) => {
      if (value.connection && value.connection.open) {
        // console.log(`Broacasting the update Player: ${name}, Peer ID: ${value.connection.peer}, team : ${value.teamName}`);
        value.connection.send({ type: "playersData", "playersData": { "players":players, "currentPlayerTurn":0, "currentIterationCounter": 1} });
      }
    });
  };

  // send turn update to host
  const broadCastUpdateToHost = (playersData) => {
    console.log("Sending the game progress to host");
    connectionToHost.send({ type: "gameProgress", "playersData":playersData});
  };

  const handleHostGame = (name) => {
    if (!name) {
      alert("Player name is required!");
      return;
   }
   setPlayerName(name);
    setPlayersDetails(
      {"players" : [{ id: 1, name: name, team: "A" }]});
      // { id: prev.length + 2, name: "name1", team: "B" },);
    setPlayerMap((prev) => {
      const updatedMap = {
        ...prev,
        [name]: { connection: null, teamName:  "A" }
      };
      // console.log("Updated player map:", updatedMap);
      return updatedMap;
    });
    setIsHost(true);
    setIsInLobby(true);
  };

  const handleJoinGame = (name, gameId) => {
    if (!name) {
    alert("Player name is required!");
    return;
   }
   if (!gameId) {
    alert("GameId is required!");
    return;
   }
   setPlayerName(name);
   setGameId(gameId);
   setIsHost(false);
   setIsInLobby(true);
   console.log("completed join game")
  };

  const handleStartGame = () => {
    setCurrentRound(1);
    setGameStarted(true); 
  };

  const handleResetDroppedCards = (currentPlayerTurn, currentIterationCounter, isGamePaused) => {
    const updatedPlayersData = [...playersDetails.players];
    for (let i = 0; i < updatedPlayersData.length; i++) {
        updatedPlayersData[i].droppedCard = null;
    }
    setPlayersDetails({"players":updatedPlayersData, "currentPlayerTurn": currentPlayerTurn,
      "currentIterationCounter": currentIterationCounter, "isGamePaused": isGamePaused
    });
  }

  const handleOnNextTurnButton = () => {
    if (isHost) {
      // handleResetDroppedCards(gameData.currentPlayerTurn, currentIteration);
      handleResetDroppedCards(gameData.currentPlayerTurn, currentIteration, false);
      // setIsWaitToDropCard(false);
    }
  }

  const handleDropCard = (card, indexOfCurrentPlayer) => {
    // console.log(indexOfCurrentPlayer, " triggered drop card", card);
    let currentIterationCounter = playersDetails.currentIterationCounter;
    const updatedPlayersData = [...playersDetails.players];
    if(!updatedPlayersData[indexOfCurrentPlayer].droppedCard) {
        updatedPlayersData[indexOfCurrentPlayer].droppedCard = {};
    }
    updatedPlayersData[indexOfCurrentPlayer].droppedCard = card;
    // console.log("Updated players data:", updatedPlayersData);
    const currentPlayerTurn = (indexOfCurrentPlayer + 1) % updatedPlayersData.length;
    // console.log("index of game", currentPlayerTurn);
    const isNextIteration = updatedPlayersData.every(obj => obj.droppedCard);
    let isGamePaused = false;
    if ( isNextIteration ) {
      currentIterationCounter = currentIterationCounter + 1;
      isGamePaused = true;
      // setCurrentIteration(currentIterationCounter);
    }
    setPlayersDetails({"players":updatedPlayersData, "currentPlayerTurn": currentPlayerTurn, 
      "currentIterationCounter": currentIterationCounter, "isGamePaused": isGamePaused});
    if (isHost) {
      // broadCastPlayersDataDuringGame({"players":updatedPlayersData, "currentPlayerTurn": currentPlayerTurn,
      //   "currentIterationCounter": currentIterationCounter
      // })
        setCurrentIteration(currentIterationCounter);
    } 
    if (!isHost) {
      broadCastUpdateToHost({"players":updatedPlayersData, "currentPlayerTurn": currentPlayerTurn,
        "currentIterationCounter": currentIterationCounter, "isGamePaused": isGamePaused
      });
    }
  }; 

  return (
    <div className="App">
      {playerName && <h2 className="player-name">Welcome, {playerName}!</h2>}
      {!gameId ? (
        <EntryScreen 
          onHostGame={handleHostGame} 
          onJoinGame={handleJoinGame} 
        />
      ) : !gameStarted ? (
        <GameLobby gameId={gameId} players={playersDetails.players} isHost={isHost} 
        onStartGame={handleStartGame}
        />
      ) : (
        <GameScreen playersDetails={playersDetails} currentPlayer={playerName} gameData={gameData}
            currentPlayerTurn={playersDetails.currentPlayerTurn} dropCard={handleDropCard}
            isHost={isHost} onNextTurnButton={handleOnNextTurnButton}/>
      )}
    </div>
  );
}

export default App;
