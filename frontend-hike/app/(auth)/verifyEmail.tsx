import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#DBEAFE",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: 32,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 4,
    color: "#111827",
    backgroundColor: "white",
  },
  codeCounter: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  verifyButton: {
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  verifyButtonEnabled: {
    backgroundColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  verifyButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  resendText: {
    color: "#4B5563",
    fontSize: 14,
  },
  resendLink: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 20,
    flex: 1,
  },
});

export default function VerifyEmail() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyCode = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Wait a moment for Clerk to update auth state
        setTimeout(() => {
          router.replace("/(tabs)/explore");
        }, 100);
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      Alert.alert("Invalid code", err.errors?.[0]?.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      Alert.alert("Success", "Verification code sent to your email");
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to resend code");
    }
  };

  const isValidCode = code.length === 6 && /^\d+$/.test(code);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={32} color="#2563eb" />
          </View>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code we sent to your email address
          </Text>
        </View>

        {/* Code Input Section */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.codeInput}
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            placeholder="000000"
            placeholderTextColor="#D1D5DB"
            editable={!loading}
          />
          <Text style={styles.codeCounter}>{code.length}/6 digits entered</Text>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            isValidCode && !loading
              ? styles.verifyButtonEnabled
              : styles.verifyButtonDisabled,
          ]}
          onPress={verifyCode}
          disabled={!isValidCode || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <>
              <ActivityIndicator
                color="white"
                size="small"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.verifyButtonText}>Verifying...</Text>
            </>
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.verifyButtonText}>Verify Email</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Resend Code Link */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={resendCode}>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomSection}>
        <View style={styles.infoRow}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#6B7280"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            Check your spam folder if you don't see the email in your inbox
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
