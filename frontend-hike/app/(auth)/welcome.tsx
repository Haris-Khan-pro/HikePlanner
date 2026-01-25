import { useRouter } from "expo-router";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  // Remove navigation prop
  const router = useRouter(); // Use useRouter hook

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 mt-8">
        {/* Logo/Image Section - Takes 60% of screen */}
        <View className="flex-1.5 justify-end items-center">
          <Image
            source={require("@/assets/images/Adventure logo.jpg")}
            className="w-80 h-80"
            resizeMode="contain"
          />
        </View>

        {/* Text Content Section */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
            Adventure Awaits You!
          </Text>
          <Text className="text-gray-600 text-center text-lg mb-10">
            Discover amazing places and create{"\n"}unforgettable memories
            🌲🛣️🚶
          </Text>

          {/* Buttons */}
          <View className="w-full space-y-4 mt-12">
            <TouchableOpacity
              className="bg-blue-600 py-5 rounded-full mb-6"
              onPress={() => router.push("/(auth)/signup")}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Create Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-5 rounded-full border border-blue-400"
              onPress={() => router.push("/(auth)/login")}
            >
              <Text className="text-gray-800 text-center font-semibold text-lg">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer with Terms */}
        <View className="pt-6 pb-8">
          <Text className="text-center text-gray-500 text-xs leading-5">
            By continuing, you agree to our{" "}
            <Text
              className="text-blue-500"
              onPress={() => handleOpenLink("https://yourapp.com/terms")}
            >
              Terms
            </Text>
            {", "}
            <Text
              className="text-blue-500"
              onPress={() => handleOpenLink("https://yourapp.com/privacy")}
            >
              Privacy Policy
            </Text>
            {" and "}
            {"\n"}
            <Text
              className="text-blue-500"
              onPress={() => handleOpenLink("https://yourapp.com/cookies")}
            >
              Cookies Use
            </Text>
            .
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
