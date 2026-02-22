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
    <View>
      <Text>lately.</Text>
      <TextInput
        placeholder="Your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity onPress={handleLogin}>
        <Text>Send magic link</Text>
      </TouchableOpacity>
    </View>
  );
}
