import { useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Image, Text, TouchableOpacity } from "react-native";

WebBrowser.maybeCompleteAuthSession();

interface SocialOAuthButtonProps {
  provider: "google" | "apple";
}

export const SocialOAuthButton = ({ provider }: SocialOAuthButtonProps) => {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: `oauth_${provider}` });

  const handleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        // Give Clerk a moment to set the session
        setTimeout(() => {
          router.replace("/(tabs)/explore");
        }, 100);
      }
    } catch (err) {
      console.error("OAuth error:", err);
    }
  };

  const getButtonConfig = () => {
    switch (provider) {
      case "google":
        return {
          icon: require("@/assets/images/google.png"),
          text: "Continue with Google",
          bgColor: "bg-white",
          textColor: "text-gray-700",
          borderColor: "border-gray-300",
        };
      case "apple":
        return {
          icon: <Ionicons name="logo-apple" size={20} color="black" />,
          text: "Continue with Apple",
          bgColor: "bg-black",
          textColor: "text-white",
          borderColor: "border-black",
        };
      default:
        return {
          icon: null,
          text: "",
          bgColor: "",
          textColor: "",
          borderColor: "",
        };
    }
  };

  const config = getButtonConfig();

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center ${config.bgColor} border ${config.borderColor} py-3 rounded-full mb-3`}
      onPress={handleSignIn}
    >
      {provider === "google" ? (
        <Image source={config.icon} className="w-5 h-5" />
      ) : (
        config.icon
      )}
      <Text className={`${config.textColor} font-medium ml-2`}>
        {config.text}
      </Text>
    </TouchableOpacity>
  );
};

export default SocialOAuthButton;