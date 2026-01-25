import { useSignIn } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SocialOAuthButton } from "./components/_SocialOAuthButton"; // Add this import

export default function LoginScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Invalid credentials");
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
              Login
            </Text>
            <Text className="text-gray-600 mt-1">
              Sign in to your account
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="mt-8">
          {/* Email Input */}
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

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Enter your password"
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
            
            <TouchableOpacity className="self-end mt-2">
              <Text className="text-blue-500 font-medium">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-full"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? "Signing In..." : "Sign In"}
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

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text className="text-blue-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}