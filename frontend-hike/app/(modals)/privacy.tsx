import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import SafeScreen from "../../components/SafeScreen";

type PrivacySetting = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export default function PrivacyModal() {
  const router = useRouter();
  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: "profile_public",
      label: "Public Profile",
      description: "Allow others to see your profile",
      enabled: true,
    },
    {
      id: "activities_visible",
      label: "Show Activities",
      description: "Make your activities visible to followers",
      enabled: true,
    },
    {
      id: "location_visible",
      label: "Show Location",
      description: "Share your location with friends",
      enabled: false,
    },
    {
      id: "search_visible",
      label: "Searchable Profile",
      description: "Allow profile to appear in search results",
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  return (
    <SafeScreen className="bg-white flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-6 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 ml-4">
            Privacy & Visibility
          </Text>
        </View>

        <View className="px-5">
          {settings.map((setting, index) => (
            <View
              key={setting.id}
              className={`flex-row items-center justify-between py-4 ${
                index !== settings.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  {setting.label}
                </Text>
                <Text className="text-sm text-gray-600">
                  {setting.description}
                </Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
                thumbColor={setting.enabled ? "#16a34a" : "#F3F4F6"}
                style={{ marginLeft: 12 }}
              />
            </View>
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeScreen>
  );
}
