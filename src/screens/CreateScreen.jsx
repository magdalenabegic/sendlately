import { router } from "expo-router";
import { useRef, useState } from "react";
import { Share } from "react-native";

import AddCardModal from "../components/AddCardModal";
import Card from "../components/Card";

import { supabase } from "../lib/supabase";

export default function CreateScreen() {
  const [cards, setCards] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [showSent, setShowSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const rotations = useRef([]);

  const addCard = (data) => {
    const newCard = { id: Date.now(), ...data };
    setCards((c) => [...c, newCard]);
    rotations.current = [...rotations.current, (Math.random() - 0.5) * 3];
  };

  const deleteCard = (id) => {
    const idx = cards.findIndex((c) => c.id === id);
    rotations.current = rotations.current.filter((_, i) => i !== idx);
    setCards((c) => c.filter((card) => card.id !== id));
  };

  const handleSend = async () => {
    if (cards.length === 0) return;
    setSaving(true);

    // 1. Get the currently logged in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2. Create the collage row in the database, mark it as sent immediately
    const { data: collage, error } = await supabase
      .from("collages")
      .insert({
        user_id: user.id,
        recipient_name: senderName,
        is_sent: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating collage:", error);
      setSaving(false);
      return;
    }

    // 3. Save every card linked to that collage
    const cardRows = cards.map((card, i) => ({
      collage_id: collage.id,
      type: card.type,
      title: card.title,
      subtitle: card.subtitle,
      note: card.note,
      position: i,
    }));

    await supabase.from("cards").insert(cardRows);

    // 4. Build the shareable link using the share_token
    //    Supabase auto-generated this when the collage row was created
    const link = `https://sendlately.com/c/${collage.share_token}`;

    setSaving(false);
    setShowSent(true);

    // 5. After the animation plays, open the native share sheet
    setTimeout(async () => {
      setShowSent(false);
      await Share.share({
        message: `Here's my Lately — ${link}`,
      });
    }, 1800);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f4ef",
        fontFamily: "Georgia, serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      {/* Sending animation overlay */}
      {showSent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 56 }}>✉️</div>
          <div
            style={{
              color: "white",
              fontSize: 22,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Lately sent!
          </div>
        </div>
      )}

      {/* Add card modal */}
      {showAdd && (
        <AddCardModal onAdd={addCard} onClose={() => setShowAdd(false)} />
      )}

      {/* Header */}
      <div
        style={{
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e8e2d8",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 28,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: "#1a1a1a",
              letterSpacing: "-0.02em",
            }}
          >
            lately.
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              color: "#999",
              letterSpacing: "0.1em",
            }}
          >
            catch up before you catch up
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your name"
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "1.5px solid #e0e0e0",
              fontSize: 14,
              fontFamily: "Georgia, serif",
              background: "white",
              color: "#1a1a1a",
              width: 120,
              outline: "none",
            }}
          />
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "1.5px solid #1a1a1a",
              background: "white",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "Georgia, serif",
            }}
          >
            + Add card
          </button>
          <button
            onClick={handleSend}
            disabled={saving || cards.length === 0}
            style={{
              padding: "10px 22px",
              borderRadius: 12,
              border: "none",
              background: saving ? "#888" : "#1a1a1a",
              color: "white",
              cursor: saving || cards.length === 0 ? "default" : "pointer",
              fontSize: 14,
              fontFamily: "Georgia, serif",
              fontWeight: 600,
              opacity: cards.length === 0 ? 0.5 : 1,
            }}
          >
            {saving ? "Saving..." : "Send →"}
          </button>
        </div>
      </div>

      {/* Intro text */}
      <div style={{ padding: "24px 32px 0", maxWidth: 600 }}>
        <div
          style={{
            fontSize: 13,
            fontFamily: "'DM Mono', monospace",
            color: "#888",
            lineHeight: 1.7,
          }}
        >
          This is{" "}
          <strong style={{ color: "#1a1a1a" }}>
            {senderName || "your"}'s lately
          </strong>{" "}
          — a little collage of what's been going on. Add cards, then send it to
          a friend before you meet up.
        </div>
      </div>

      {/* Card grid */}
      <div
        style={{
          padding: "24px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {cards.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            rotation={rotations.current[i] || 0}
            onDelete={deleteCard}
            showDelete={true}
          />
        ))}

        {/* Empty add card button */}
        <button
          onClick={() => setShowAdd(true)}
          style={{
            borderRadius: 16,
            border: "2px dashed #c8bfb0",
            background: "transparent",
            cursor: "pointer",
            minHeight: 160,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "#aaa",
            fontFamily: "Georgia, serif",
            fontSize: 14,
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#888";
            e.currentTarget.style.color = "#555";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#c8bfb0";
            e.currentTarget.style.color = "#aaa";
          }}
        >
          <span style={{ fontSize: 28 }}>+</span>
          <span>Add a card</span>
        </button>
      </div>

      {/* Preview button */}
      <div style={{ padding: "8px 32px 40px" }}>
        <button
          onClick={() => router.push("/preview")}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: "1.5px solid #c8bfb0",
            background: "white",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "'DM Mono', monospace",
            color: "#666",
          }}
        >
          Preview as recipient
        </button>
      </div>
    </div>
  );
}
