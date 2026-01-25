import { useSignUp } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SocialOAuthButton } from "./components/_SocialOAuthButton"; // Add this import

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;

    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await signUp.create({
        emailAddress: email,
        password,
        firstName: name.split(" ")[0],
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // DO NOT just show alert and stop
      router.push("./verifyEmail");

      Alert.alert(
        "Check your email",
        "We've sent you a verification code. Please check your email.",
        [{ text: "OK" }],
      );
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="pt-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Create Account
            </Text>
            <Text className="text-gray-600 mt-1">
              Join our adventure community
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="mt-8">
          {/* Name Field */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Name</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
              <Ionicons name="person-outline" size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Field */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
              <Ionicons name="mail-outline" size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Field */}
          <View className="mb-8">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              Must be at least 8 characters long
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-full"
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Social Login - UPDATED */}
        <SocialOAuthButton provider="google" />
        <SocialOAuthButton provider="apple" />

        {/* Footer */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text className="text-blue-500 font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}