import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to welcome screen
  return <Redirect href="/(auth)/welcome" />;
}