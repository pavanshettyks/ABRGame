import React, { useState } from "react";
import "../css/Card.css";

const Card = ({ suit, rank, onRemove }) => {
    const [selected, setSelected] = useState(false);
    let touchStartY = 0;

    // Handle click to toggle selection
    const handleClick = () => {
        setSelected(!selected);
    };

    // Handle touch start (finger down)
    const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
    };

    // Handle touch move (finger swipe)
    const handleTouchMove = (e) => {
        const touchEndY = e.touches[0].clientY;
        if (touchStartY - touchEndY > 50) {
            onRemove(); // Remove card if swiped up
        }
    };

    const suitSymbols = {
        Spades: "♠",
        Hearts: "♥",
        Diamonds: "♦",
        Clubs: "♣",
        Joker: "🃏"
    };

    const isRed = suit === "Hearts" || suit === "Diamonds";

    return (
        <div
            className={`card ${isRed ? "red" : "black"} ${selected ? "selected" : ""}`}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            <div className="card-content">
                <span className="card-rank">{rank}</span>
                <span className="card-suit">{suitSymbols[suit]}</span>
            </div>
        </div>
    );
};

export default Card;
