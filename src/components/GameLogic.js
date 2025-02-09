export const initializeGame = (roundNumber, playerMap) => {
  const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
  const deck = createDeck(2); // Two decks including jokers
  const shuffledDeck = shuffleDeck(deck);
  const playerList = [];
  Object.entries(playerMap).forEach(([name, value]) => {
     playerList.push(name);
    });
  const numPlayers = playerList.length;

  const playersToCardMap = new Map();
  // Initialize empty hands for each player
  for (let i = 0; i < numPlayers; i++) {
    playersToCardMap.set(i, []);
  }

  // Distribute cards one by one to each player in a round-robin fashion
  for (let i = 0; i < roundNumber; i++) {
    for (let j = 0; j < numPlayers; j++) {
      playersToCardMap.get(j).push(shuffledDeck.pop());
    }
  }

  const playersToCard = {};
  playersToCardMap.forEach((value,key) => {
    playersToCard[key] = value;
  })

  // Determine cutter card based on round number
  const cutterCard = suits[(roundNumber - 1) % suits.length];

  return {
    roundNumber,
    numPlayers,
    playersToCard,
    currentPlayerTurn: (roundNumber - 1) % numPlayers,
    cutterCard,
  };
};

export const createDeck = (deckCount) => {
  const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  let deck = [];

  for (let i = 0; i < deckCount; i++) {
    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        deck.push({ suit, rank });
      });
    });
    deck.push({ suit: "Joker", rank: "Black" });
    deck.push({ suit: "Joker", rank: "Red" });
  }

  return deck;
};

export const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};
