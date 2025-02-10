import React, { useState, useEffect } from "react";
import Card from "./Card";
import "../css/Hand.css";

const Hand = ({ initialCards, currentTurnPlayer, currentPlayer, maxCardsAtHand, dropCard}) => {
    const [cards, setCards] = useState(initialCards);
    const [isCurrentPlayerTurn, setIsCurrentPlayerTurn] = useState(currentTurnPlayer === currentPlayer);

    useEffect(() => {
        setCards(initialCards);
    }, [initialCards]);

    // Remove card from hand
    const handleRemoveCard = (index) => {
        // console.log("Remove one card: ", isCurrentPlayerTurn);
        console.log("Remove one card: ", cards.length+1, maxCardsAtHand);
        if (true && cards.length > maxCardsAtHand) {
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
