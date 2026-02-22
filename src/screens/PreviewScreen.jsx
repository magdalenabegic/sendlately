import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { CARD_TYPES } from "../constants/cardTypes";

export default function PreviewScreen() {
  const { cards: cardsParam, senderName } = useLocalSearchParams();
  const cards = JSON.parse(cardsParam || "[]");

  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [reactions, setReactions] = useState({});

  // If no cards were passed, show an empty state
  if (!cards.length) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 40 }}>🃏</Text>
        <Text style={styles.emptyTitle}>No cards yet</Text>
        <Text style={styles.emptySub}>Add some cards first then preview.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const card = cards[current];
  const type = CARD_TYPES[card.type];
  const reacted = reactions[card.id];

  const goNext = () => {
    if (current < cards.length - 1) {
      setFlipping(true);
      setTimeout(() => {
        setCurrent((c) => c + 1);
        setFlipping(false);
      }, 250);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setFlipping(true);
      setTimeout(() => {
        setCurrent((c) => c - 1);
        setFlipping(false);
      }, 250);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Preview badge */}
      <View style={styles.previewBadge}>
        <Text style={styles.previewBadgeText}>
          👀 PREVIEW — this is what your friend will see
        </Text>
      </View>

      {/* Sender name */}
      <View style={styles.senderHeader}>
        <Text style={styles.senderLabel}>LATELY FROM</Text>
        <Text style={styles.senderName}>{senderName || "You"}</Text>
      </View>

      {/* Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: type.color, opacity: flipping ? 0 : 1 },
        ]}
      >
        <Text style={{ fontSize: 40, marginBottom: 12 }}>{type.emoji}</Text>
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

      {/* Reactions — tappable but just for show in preview */}
      <View style={styles.reactions}>
        {["❤️", "😂", "😮"].map((emoji) => (
          <TouchableOpacity
            key={emoji}
            onPress={() => setReactions((r) => ({ ...r, [card.id]: emoji }))}
            style={[
              styles.reactionBtn,
              reacted === emoji && styles.reactionBtnActive,
            ]}
          >
            <Text style={{ fontSize: 24 }}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.nav}>
        <TouchableOpacity
          onPress={goPrev}
          disabled={current === 0}
          style={[styles.navBtn, current === 0 && { opacity: 0.3 }]}
        >
          <Text style={styles.navBtnText}>← prev</Text>
        </TouchableOpacity>

        <Text style={styles.navCounter}>
          {current + 1} / {cards.length}
        </Text>

        <TouchableOpacity
          onPress={goNext}
          disabled={current === cards.length - 1}
          style={[
            styles.navBtn,
            current === cards.length - 1 && { opacity: 0.3 },
          ]}
        >
          <Text style={styles.navBtnText}>next →</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.secondaryBtn}
        >
          <Text style={styles.secondaryBtnText}>← Edit cards</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.back();
            // Small delay so the user lands back on CreateScreen before send fires
            setTimeout(
              () =>
                router.push({
                  pathname: "/create",
                  params: { triggerSend: "true" },
                }),
              100,
            );
          }}
          style={styles.sendBtn}
        >
          <Text style={styles.sendBtnText}>Looks good — Send →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7f4ef",
  },
  content: {
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    alignItems: "center",
    paddingBottom: 48,
  },
  centered: {
    flex: 1,
    backgroundColor: "#f7f4ef",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  previewBadge: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  previewBadgeText: {
    color: "white",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  senderHeader: {
    alignItems: "center",
    marginBottom: 28,
  },
  senderLabel: {
    fontSize: 11,
    color: "#888",
    letterSpacing: 2,
    marginBottom: 6,
  },
  senderName: {
    fontSize: 32,
    fontFamily: "Georgia",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  card: {
    borderRadius: 24,
    padding: 28,
    width: "100%",
    minHeight: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 26,
    fontFamily: "Georgia",
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 32,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  noteDivider: {
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 4,
  },
  cardNote: {
    fontSize: 15,
    fontFamily: "Georgia",
    fontStyle: "italic",
    color: "#444",
    lineHeight: 22,
  },
  reactions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    justifyContent: "center",
  },
  reactionBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  reactionBtnActive: {
    borderColor: "#1a1a1a",
    backgroundColor: "#1a1a1a",
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
  },
  navBtn: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
  },
  navBtnText: {
    fontFamily: "Georgia",
    fontSize: 14,
    color: "#1a1a1a",
  },
  navCounter: {
    fontFamily: "Georgia",
    fontSize: 13,
    color: "#888",
  },
  bottomActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 36,
    width: "100%",
  },
  secondaryBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#1a1a1a",
    backgroundColor: "white",
    alignItems: "center",
  },
  secondaryBtnText: {
    fontFamily: "Georgia",
    fontSize: 13,
    color: "#1a1a1a",
  },
  sendBtn: {
    flex: 2,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
  },
  sendBtnText: {
    fontFamily: "Georgia",
    fontSize: 13,
    color: "white",
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Georgia",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  emptySub: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
  },
  ctaBtn: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: "#1a1a1a",
  },
  ctaBtnText: {
    fontFamily: "Georgia",
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
});
