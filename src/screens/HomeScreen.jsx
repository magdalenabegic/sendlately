import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f4ef",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, serif",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 40,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          color: "#1a1a1a",
        }}
      >
        lately.
      </div>
      <div
        style={{
          fontSize: 13,
          fontFamily: "'DM Mono', monospace",
          color: "#999",
          letterSpacing: "0.1em",
        }}
      >
        catch up before you catch up
      </div>
      <button
        onClick={() => router.push("/create")}
        style={{
          marginTop: 16,
          padding: "14px 32px",
          borderRadius: 14,
          border: "none",
          background: "#1a1a1a",
          color: "white",
          cursor: "pointer",
          fontSize: 16,
          fontFamily: "Georgia, serif",
        }}
      >
        Create a Lately →
      </button>
    </div>
  );
}
