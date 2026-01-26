import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import SafeScreen from "../../components/SafeScreen";

type SettingItem = {
  label: string;
  icon: string;
  onPress: () => void;
  isDangerous?: boolean;
};

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleNavigate = (screen: string) => {
    router.push(`/(modals)/${screen}` as any);
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/welcome" as any);
          } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };

  const accountSettings: SettingItem[] = [
    {
      label: "Notifications",
      icon: "notifications-outline",
      onPress: () => handleNavigate("notifications"),
    },
    {
      label: "Profile information",
      icon: "person-outline",
      onPress: () => handleNavigate("profile-information"),
    },
    {
      label: "Home address",
      icon: "home-outline",
      onPress: () => handleNavigate("address"),
    },
    {
      label: "Visibility and privacy",
      icon: "eye-outline",
      onPress: () => handleNavigate("privacy"),
    },
  ];

  const connectionSettings: SettingItem[] = [];

  const appInfo: SettingItem[] = [
    {
      label: "Feedback & support",
      icon: "help-circle-outline",
      onPress: () => handleNavigate("Feedback & support"),
    },
    {
      label: "Legal",
      icon: "document-text-outline",
      onPress: () => handleNavigate("Legal"),
    },
  ];

  const SettingSection = ({
    title,
    items,
  }: {
    title: string;
    items: SettingItem[];
  }) => (
    <View className="mb-6">
      {title && (
        <Text className="text-lg font-bold text-gray-900 px-5 mb-3">
          {title}
        </Text>
      )}
      <View className="bg-white rounded-2xl overflow-hidden">
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className={`flex-row items-center justify-between px-5 py-4 ${
              index !== items.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <View className="flex-row items-center flex-1">
              <Ionicons
                name={item.icon as any}
                size={24}
                color="#6B7280"
                style={{ marginRight: 12 }}
              />
              <Text className="text-base font-medium text-gray-900">
                {item.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeScreen className="bg-gray-50 flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 ml-4">
            Settings
          </Text>
        </View>

        {/* Account Section */}
        <SettingSection title="Account" items={accountSettings} />

        {/* Connections Section */}
        {connectionSettings.length > 0 && (
          <SettingSection title="Connections" items={connectionSettings} />
        )}

        {/* App Info Section */}
        <SettingSection title="App" items={appInfo} />

        {/* Beautiful Logout Button */}
        <View className="px-5 mb-8 mt-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 rounded-2xl py-4 border-2 border-red-400 active:bg-red-200"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={24} color="#DC2626" />
              <Text className="text-red-600 font-bold text-lg ml-3">
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View className="h-6" />
      </ScrollView>
    </SafeScreen>
  );
}