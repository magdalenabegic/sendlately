import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Layout() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when app opens
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for login / logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.replace("/home"); // logged in → go to home
      } else {
        router.replace("/welcome"); // logged out → go to welcome
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a spinner while we check auth status
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f7f4ef",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#1a1a1a" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
