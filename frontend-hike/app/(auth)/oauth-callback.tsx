import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function OAuthCallback() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.replace("/(tabs)/explore");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [isSignedIn, isLoaded]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 16, color: '#6B7280' }}>Completing sign in...</Text>
    </SafeAreaView>
  );
}