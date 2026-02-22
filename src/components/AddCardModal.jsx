import { useState } from "react";
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { CARD_TYPES } from "../constants/cardTypes";

export default function AddCardModal({ visible, onAdd, onClose }) {
  const [type, setType] = useState("moment");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [note, setNote] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({ type, title, subtitle, note });
    setTitle("");
    setSubtitle("");
    setNote("");
    setType("moment");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Add a card</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20 }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {Object.entries(CARD_TYPES).map(([key, val]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setType(key)}
                  style={[
                    styles.typeChip,
                    {
                      borderColor: type === key ? val.accent : "#e0e0e0",
                      backgroundColor: type === key ? val.color : "white",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: type === key ? val.accent : "#888",
                      fontSize: 12,
                    }}
                  >
                    {val.emoji} {val.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            placeholder="Subtitle (author, city, artist...)"
            value={subtitle}
            onChangeText={setSubtitle}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={[
              styles.input,
              { marginTop: 10, height: 80, textAlignVertical: "top" },
            ]}
            placeholder="A little note (optional)"
            value={note}
            onChangeText={setNote}
            multiline
            placeholderTextColor="#aaa"
          />

          <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text
                style={{ fontFamily: "Georgia", fontSize: 14, color: "#555" }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
              <Text
                style={{
                  fontFamily: "Georgia",
                  fontSize: 14,
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Add card
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  box: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
  },
  title: {
    fontSize: 22,
    fontFamily: "Georgia",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: "Georgia",
    backgroundColor: "#fafafa",
    color: "#1a1a1a",
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  addBtn: {
    flex: 2,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
  },
});
