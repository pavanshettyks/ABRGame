import React, { useState } from "react";
import Card from "./Card";
import "../css/Hand.css";

const Hand = ({ initialCards, currentTurnPlayer, currentPlayer, dropCard}) => {
    const [cards, setCards] = useState(initialCards);
    const [isCurrentPlayerTurn, setIsCurrentPlayerTurn] = useState(currentTurnPlayer === currentPlayer);

    // Remove card from hand
    const handleRemoveCard = (index) => {
        console.log("Remove one card: ", isCurrentPlayerTurn)
        if (true) {
            const droppedCard = cards[index];
            console.log("Dropped card", droppedCard)
            setCards(cards.filter((_, i) => i !== index));
            setIsCurrentPlayerTurn(false)
            dropCard(droppedCard, currentPlayer);
        }
    };

    return (
        <div className="hand">
            {cards.map((card, index) => (
                <Card key={index} suit={card.suit} rank={card.rank} onRemove={() => handleRemoveCard(index)} />
            ))}
        </div>
    );
};

export default Hand;
