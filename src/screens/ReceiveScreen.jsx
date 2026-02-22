import { router } from "expo-router";
import { useEffect, useState } from "react";
import { CARD_TYPES } from "../constants/cardTypes";
import { supabase } from "../lib/supabase";

export default function ReceiveScreen({ token }) {
  const [collage, setCollage] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [reactions, setReactions] = useState({});

  // Fetch the collage and its cards when the screen loads
  useEffect(() => {
    const fetchCollage = async () => {
      const { data, error } = await supabase
        .from("collages")
        .select("*, cards(*)")
        .eq("share_token", token)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setCollage(data);
      // Sort cards by their position so they appear in the right order
      setCards(data.cards.sort((a, b) => a.position - b.position));
      setLoading(false);
    };

    if (token) fetchCollage();
  }, [token]);

  // Save the reaction to Supabase and update local state so the UI responds instantly
  const handleReact = async (cardId, emoji) => {
    setReactions((r) => ({ ...r, [cardId]: emoji }));
    await supabase.from("reactions").insert({ card_id: cardId, emoji });
  };

  const goNext = () => {
    if (current < cards.length - 1) {
      setFlipping(true);
      setTimeout(() => {
        setCurrent((c) => c + 1);
        setFlipping(false);
      }, 300);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setFlipping(true);
      setTimeout(() => {
        setCurrent((c) => c - 1);
        setFlipping(false);
      }, 300);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f4ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
          color: "#888",
          fontSize: 13,
        }}
      >
        Loading your Lately...
      </div>
    );
  }

  // If the token doesn't match any collage in the database
  if (notFound) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f4ef",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 48 }}>🤷</div>
        <div
          style={{
            fontSize: 20,
            fontFamily: "'Playfair Display', serif",
            color: "#1a1a1a",
          }}
        >
          Collage not found
        </div>
        <div
          style={{
            fontSize: 13,
            fontFamily: "'DM Mono', monospace",
            color: "#888",
          }}
        >
          This link may have expired or been mistyped.
        </div>
        <button
          onClick={() => router.push("/")}
          style={{
            marginTop: 8,
            padding: "12px 28px",
            borderRadius: 14,
            border: "none",
            background: "#1a1a1a",
            color: "white",
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "Georgia, serif",
          }}
        >
          Make your own Lately →
        </button>
      </div>
    );
  }

  const card = cards[current];
  const type = CARD_TYPES[card.type];
  const reacted = reactions[card.id];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f4ef",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      <div style={{ maxWidth: 420, width: "100%" }}>
        {/* Sender name header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontSize: 13,
              fontFamily: "'DM Mono', monospace",
              color: "#888",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Lately from
          </div>
          <div
            style={{
              fontSize: 32,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            {collage.recipient_name || "A friend"}
          </div>
        </div>

        {/* The card */}
        <div
          style={{
            background: type.color,
            borderRadius: 24,
            padding: 32,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            minHeight: 240,
            opacity: flipping ? 0 : 1,
            transform: flipping ? "scale(0.96)" : "scale(1)",
            transition: "opacity 0.3s, transform 0.3s",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>{type.emoji}</div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              color: type.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            {type.label}
          </div>
          <div
            style={{
              fontSize: 26,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            {card.title}
          </div>
          <div
            style={{
              fontSize: 14,
              fontFamily: "'DM Mono', monospace",
              color: "#666",
              marginBottom: 16,
            }}
          >
            {card.subtitle}
          </div>
          {card.note && (
            <div
              style={{
                fontSize: 15,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                color: "#444",
                borderTop: `1px solid ${type.accent}44`,
                paddingTop: 16,
                lineHeight: 1.6,
              }}
            >
              "{card.note}"
            </div>
          )}
        </div>

        {/* Reaction buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 20,
          }}
        >
          {["❤️", "😂", "😮"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(card.id, emoji)}
              style={{
                fontSize: 24,
                background: reacted === emoji ? "#1a1a1a" : "white",
                border: "2px solid",
                borderColor: reacted === emoji ? "#1a1a1a" : "#e0e0e0",
                borderRadius: 14,
                width: 52,
                height: 52,
                cursor: "pointer",
                transform: reacted === emoji ? "scale(1.15)" : "scale(1)",
                transition: "all 0.15s ease",
              }}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Prev / next navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          <button
            onClick={goPrev}
            disabled={current === 0}
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "1.5px solid #e0e0e0",
              background: "white",
              cursor: current === 0 ? "default" : "pointer",
              opacity: current === 0 ? 0.4 : 1,
              fontSize: 14,
            }}
          >
            ← prev
          </button>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: "#888",
            }}
          >
            {current + 1} / {cards.length}
          </div>
          <button
            onClick={goNext}
            disabled={current === cards.length - 1}
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "1.5px solid #e0e0e0",
              background: "white",
              cursor: current === cards.length - 1 ? "default" : "pointer",
              opacity: current === cards.length - 1 ? 0.4 : 1,
              fontSize: 14,
            }}
          >
            next →
          </button>
        </div>

        {/* Make your own CTA */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "12px 28px",
              borderRadius: 14,
              border: "none",
              background: "#1a1a1a",
              color: "white",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "Georgia, serif",
            }}
          >
            Make my own Lately →
          </button>
        </div>
      </div>
    </div>
  );
}
