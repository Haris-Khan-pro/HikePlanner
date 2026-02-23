import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, 
  View,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";

export default function ProfileInformationModal() {
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [customUsername, setCustomUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadCustomUsername = useCallback(async () => {
    if (!clerkUser?.id) return;
    try {
      setIsLoading(true);
      const API_URL =
        process.env.EXPO_PUBLIC_API_URL || "http://192.168.10.10:8000";
      const response = await fetch(`${API_URL}/api/users/${clerkUser.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const userData = await response.json();
        setCustomUsername(userData.custom_username || "");
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [clerkUser?.id]);

  useEffect(() => {
    if (isLoaded && clerkUser) {
      setFirstName(clerkUser.firstName || "");
      setLastName(clerkUser.lastName || "");
      loadCustomUsername();
    }
  }, [isLoaded, clerkUser, loadCustomUsername]);

  const email = clerkUser?.primaryEmailAddress?.emailAddress || "";
  const userId = clerkUser?.id || "";
  const avatarUrl = profileImage || clerkUser?.imageUrl || null;
  const displayInitial = (firstName || clerkUser?.username || "H")
    .charAt(0)
    .toUpperCase();

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow access to your photo library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!clerkUser) return;
    setIsSaving(true);
    try {
      // Update Clerk profile
      await clerkUser.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Update custom username in backend
      if (customUsername.trim()) {
        const API_URL =
          process.env.EXPO_PUBLIC_API_URL || "http://192.168.10.10:8000";
        const response = await fetch(`${API_URL}/api/users/${clerkUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            custom_username: customUsername.trim(),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || "Failed to update username");
        }
      }

      Alert.alert("Saved", "Profile updated successfully!");
      router.back();
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "Failed to save. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await clerkUser?.delete();
              router.replace("/(auth)/welcome" as any);
            } catch {
              Alert.alert("Error", "Failed to delete account.");
            }
          },
        },
      ],
    );
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeScreen>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={{ position: "relative" }}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{displayInitial}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.changePhotoBtn}
          >
            <Ionicons name="image-outline" size={18} color="#16a34a" />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>First Name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Last Name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Display Username</Text>
            <TextInput
              value={customUsername}
              onChangeText={(t) =>
                setCustomUsername(t.toLowerCase().replace(/\s/g, ""))
              }
              placeholder="your_username"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              editable={!isLoading}
            />
            <Text style={styles.fieldHint}>Lowercase, no spaces</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.readOnlyRow}>
              <Text style={styles.readOnlyValue} numberOfLines={1}>
                {email}
              </Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.fieldHint}>
              Email is managed through your account settings
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Account ID</Text>
            <Text style={styles.monoText} selectable>
              {userId || "—"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          style={[styles.saveBtn, isSaving && { opacity: 0.6 }]}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={styles.deleteBtn}
        >
          <Text style={styles.deleteBtnText}>Delete Account</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  avatarSection: { alignItems: "center", marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { color: "white", fontSize: 40, fontWeight: "bold" },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#16a34a",
  },
  changePhotoText: { color: "#16a34a", fontWeight: "600", fontSize: 14 },
  form: { paddingHorizontal: 20, gap: 20, marginBottom: 32 },
  field: { gap: 6 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  fieldHint: { fontSize: 12, color: "#9CA3AF" },
  readOnlyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: "#F9FAFB",
  },
  readOnlyValue: { fontSize: 16, color: "#6B7280", flex: 1, marginRight: 8 },
  verifiedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  verifiedText: { fontSize: 11, color: "#16a34a", fontWeight: "600" },
  monoText: { fontSize: 13, color: "#6B7280", fontFamily: "monospace" },
  saveBtn: {
    marginHorizontal: 20,
    backgroundColor: "#16a34a",
    borderRadius: 99,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  saveBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  deleteBtn: {
    marginHorizontal: 20,
    borderRadius: 99,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FECACA",
    backgroundColor: "#FFF5F5",
  },
  deleteBtnText: { color: "#DC2626", fontSize: 16, fontWeight: "700" },
});
