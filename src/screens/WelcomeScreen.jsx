import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function WelcomeScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({ email });
    setSent(true);
  };

  if (sent)
    return (
      <View>
        <Text>Check your email for a magic link ✉️</Text>
      </View>
    );

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
      <TextInput
        placeholder="Your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
        style={{
          marginTop: 16,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#e8e2d8",
          backgroundColor: "white",
          color: "#1a1a1a",
          fontSize: 16,
          fontFamily: "Georgia",
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      />
      <TouchableOpacity onPress={handleLogin}>
        <Text>Send magic link</Text>
      </TouchableOpacity>
    </div>
  );
}
