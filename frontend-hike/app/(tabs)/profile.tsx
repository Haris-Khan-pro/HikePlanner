import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Clipboard,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";

type SettingItem = { label: string; icon: string; onPress: () => void };

export default function ProfileScreen() {
  const [selectedTab, setSelectedTab] = useState<"about" | "timeline">("about");
  const [showShareModal, setShowShareModal] = useState(false);

  const { signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();

  // Instant — Clerk caches this on login, zero network calls
  const displayName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    clerkUser?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Hiker";

  const avatarUrl = clerkUser?.imageUrl || null;
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || "";

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch {
            Alert.alert("Error", "Failed to log out.");
          }
        },
      },
    ]);
  };

  const handleCopyLink = async () => {
    const link = `https://hikeplanner.app/profile/${displayName.toLowerCase().replace(/\s+/g, "-")}`;
    await Clipboard.setString(link);
    Alert.alert("Copied", "Profile link copied to clipboard!");
  };

  const handleShareProfile = async () => {
    const link = `https://hikeplanner.app/profile/${displayName.toLowerCase().replace(/\s+/g, "-")}`;
    await Share.share({ message: `Check out my HikePlanner profile: ${link}` });
  };

  const accountSettings: SettingItem[] = [
    {
      label: "Profile information",
      icon: "person-outline",
      onPress: () => router.push("/(modals)/profile-information" as any),
    },
    {
      label: "Notifications",
      icon: "notifications-outline",
      onPress: () => router.push("/(modals)/notifications" as any),
    },
    {
      label: "Home address",
      icon: "home-outline",
      onPress: () => router.push("/(modals)/address" as any),
    },
    {
      label: "Visibility and privacy",
      icon: "eye-outline",
      onPress: () => router.push("/(modals)/privacy" as any),
    },
  ];

  const appInfo: SettingItem[] = [
    {
      label: "Feedback & support",
      icon: "help-circle-outline",
      onPress: () => Alert.alert("Feedback", "support@hikeplanner.app"),
    },
    {
      label: "Legal",
      icon: "document-text-outline",
      onPress: () =>
        Alert.alert("Legal", "Terms of Service and Privacy Policy"),
    },
    { label: "Log out", icon: "log-out-outline", onPress: handleLogout },
  ];

  const SettingSection = ({
    title,
    items,
  }: {
    title: string;
    items: SettingItem[];
  }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            style={[
              styles.settingRow,
              index !== items.length - 1 && styles.settingRowBorder,
            ]}
          >
            <View style={styles.settingRowLeft}>
              <Ionicons
                name={item.icon as any}
                size={22}
                color="#6B7280"
                style={{ marginRight: 12 }}
              />
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#F9FAFB" }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setShowShareModal(true)}
              style={styles.iconBtn}
            >
              <Ionicons name="share-outline" size={22} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/settings" as any)}
              style={styles.iconBtn}
            >
              <Ionicons name="settings-outline" size={22} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card — shows instantly, no spinner */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <TouchableOpacity
              onPress={() =>
                router.push("/(modals)/profile-information" as any)
              }
              style={{ position: "relative" }}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={12} color="white" />
              </View>
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.displayName}>{displayName}</Text>
              <Text style={styles.emailText}>{userEmail}</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(modals)/profile-information" as any)
                }
                style={styles.editBtn}
              >
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Km Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0m</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab("about")}
            style={[
              styles.tabBtn,
              selectedTab === "about" && styles.tabBtnActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "about" && styles.tabTextActive,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab("timeline")}
            style={[
              styles.tabBtn,
              selectedTab === "timeline" && styles.tabBtnActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "timeline" && styles.tabTextActive,
              ]}
            >
              Timeline
            </Text>
          </TouchableOpacity>
        </View>

        {/* About Tab */}
        {selectedTab === "about" && (
          <View>
            <SettingSection title="Account" items={accountSettings} />
            <SettingSection title="App" items={appInfo} />
          </View>
        )}

        {/* Timeline Tab */}
        {selectedTab === "timeline" && (
          <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Activities Yet</Text>
              <Text style={styles.emptySubtitle}>
                Start recording hikes to see your timeline here
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Share Modal — plain View, no SafeAreaView */}
      <Modal
        visible={showShareModal}
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowShareModal(false)}>
              <Ionicons name="chevron-back" size={28} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Share Profile</Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.shareNameText}>{displayName}</Text>
            <Image
              source={{
                uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  `https://hikeplanner.app/profile/${displayName.toLowerCase().replace(/\s+/g, "-")}`,
                )}`,
              }}
              style={{ width: 200, height: 200, marginBottom: 32 }}
            />
            <TouchableOpacity onPress={handleCopyLink} style={styles.copyBtn}>
              <Ionicons name="link" size={20} color="#B45309" />
              <Text style={styles.copyBtnText}>Copy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShareProfile}
              style={styles.shareBtn}
            >
              <Ionicons name="share-social" size={20} color="#16a34a" />
              <Text style={styles.shareBtnText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 30, fontWeight: "bold", color: "#111827" },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  profileCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { color: "white", fontSize: 32, fontWeight: "bold" },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  displayName: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  emailText: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  editBtn: {
    marginTop: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  editBtnText: { fontSize: 12, color: "#374151", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 16 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  statLabel: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: "#E5E7EB" },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: { fontWeight: "600", fontSize: 14, color: "#6B7280" },
  tabTextActive: { color: "#111827" },
  sectionContainer: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    paddingHorizontal: 20,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  settingRowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  settingLabel: { fontSize: 16, color: "#111827", fontWeight: "500" },
  emptyState: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
  },
  emptySubtitle: { color: "#6B7280", textAlign: "center", marginTop: 8 },
  modalContainer: { flex: 1, backgroundColor: "white", paddingTop: 50 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 16,
  },
  modalBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  shareNameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 24,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF3C7",
    borderRadius: 99,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 12,
    width: "100%",
  },
  copyBtnText: { color: "#B45309", fontWeight: "600", marginLeft: 8 },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCFCE7",
    borderRadius: 99,
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: "100%",
  },
  shareBtnText: { color: "#16a34a", fontWeight: "600", marginLeft: 8 },
});
