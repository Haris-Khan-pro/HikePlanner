// frontend-hike/app/(auth)/components/_SocialOAuthButton.tsx

import { useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Image, Text, TouchableOpacity } from "react-native";
import { syncUserToMongoDB } from "@/services/userService";

WebBrowser.maybeCompleteAuthSession();

interface SocialOAuthButtonProps {
  provider: "google" | "apple";
}

export const SocialOAuthButton = ({ provider }: SocialOAuthButtonProps) => {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: `oauth_${provider}` as any });

  const handleSignIn = async () => {
    try {
      const result = await startOAuthFlow();
      const { createdSessionId, setActive } = result;
      const signUp = (result as any).signUp;

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });

        // Save Google/Apple user to MongoDB
        if (signUp?.createdUserId && signUp?.emailAddress) {
          await syncUserToMongoDB({
            clerkId: signUp.createdUserId as string,
            email: signUp.emailAddress as string,
            name: `${signUp.firstName ?? ""} ${signUp.lastName ?? ""}`.trim(),
            profileImage: signUp.imageUrl ?? "",
            authProvider: provider,
          });
        }

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
          isImage: true,
        };
      case "apple":
        return {
          icon: <Ionicons name="logo-apple" size={20} color="white" />,
          text: "Continue with Apple",
          bgColor: "bg-black",
          textColor: "text-white",
          borderColor: "border-black",
          isImage: false,
        };
      default:
        return {
          icon: null,
          text: "",
          bgColor: "",
          textColor: "",
          borderColor: "",
          isImage: false,
        };
    }
  };

  const config = getButtonConfig();

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center ${config.bgColor} border ${config.borderColor} py-3 rounded-full mb-3`}
      onPress={handleSignIn}
    >
      {config.isImage ? (
        <Image source={config.icon as any} className="w-5 h-5" />
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