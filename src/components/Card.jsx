import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CARD_TYPES } from "../constants/cardTypes";

export default function Card({ card, onDelete, showDelete = true }) {
  const type = CARD_TYPES[card.type];
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: type.color, borderColor: type.accent + "33" },
      ]}
    >
      {showDelete && (
        <TouchableOpacity
          onPress={() => onDelete(card.id)}
          style={styles.deleteBtn}
        >
          <Text style={{ color: "white", fontSize: 14, lineHeight: 16 }}>
            ×
          </Text>
        </TouchableOpacity>
      )}
      <Text style={{ fontSize: 28, marginBottom: 8 }}>{type.emoji}</Text>
      <Text style={[styles.cardLabel, { color: type.accent }]}>
        {type.label.toUpperCase()}
      </Text>
      <Text style={styles.cardTitle}>{card.title}</Text>
      {card.subtitle ? (
        <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
      ) : null}
      {card.note ? (
        <View
          style={[styles.noteDivider, { borderTopColor: type.accent + "44" }]}
        >
          <Text style={styles.cardNote}>"{card.note}"</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
  },
  cardLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 4,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "Georgia",
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 26,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  noteDivider: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
  },
  cardNote: {
    fontSize: 13,
    fontFamily: "Georgia",
    fontStyle: "italic",
    color: "#555",
    lineHeight: 20,
  },
  deleteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff4444",
    borderRadius: 11,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
