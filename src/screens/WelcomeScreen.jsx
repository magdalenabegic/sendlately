import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "../lib/supabase";

import { colors, fonts, radius, spacing } from "../constants/theme";

export default function WelcomeScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({ email });
    setSent(true);
  };

  if (sent) {
    return (
      <View style={styles.screen}>
        <View style={styles.centered}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>✉️</Text>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>We sent a magic link to {email}</Text>
          <TouchableOpacity
            onPress={() => setSent(false)}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>← Use a different email</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.centered}>
        <Text style={styles.logo}>lately.</Text>
        <Text style={styles.tagline}>catch up before you catch up</Text>

        <TextInput
          placeholder="Your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>Send magic link ✉️</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  logo: {
    fontSize: 48,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.text,
  },
  tagline: {
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 1.5,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  input: {
    width: "100%",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.serif,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sendBtn: {
    width: "100%",
    backgroundColor: colors.text,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  sendBtnText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.serif,
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.serif,
    color: colors.muted,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  backBtn: {
    padding: spacing.sm,
  },
  backBtnText: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: colors.muted,
  },
});
