import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import SafeScreen from "../../components/SafeScreen";

type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export default function NotificationsModal() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "likes",
      label: "Likes & Comments",
      description: "Get notified when someone likes or comments on your posts",
      enabled: true,
    },
    {
      id: "followers",
      label: "New Followers",
      description: "Get notified when someone starts following you",
      enabled: true,
    },
    {
      id: "messages",
      label: "Messages",
      description: "Get notified when you receive a new message",
      enabled: true,
    },
    {
      id: "activity",
      label: "Activity Updates",
      description: "Get notified about activities from people you follow",
      enabled: false,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif,
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
            Notifications
          </Text>
        </View>

        <View className="px-5">
          {notifications.map((notif, index) => (
            <View
              key={notif.id}
              className={`flex-row items-center justify-between py-4 ${
                index !== notifications.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  {notif.label}
                </Text>
                <Text className="text-sm text-gray-600">
                  {notif.description}
                </Text>
              </View>
              <Switch
                value={notif.enabled}
                onValueChange={() => toggleNotification(notif.id)}
                trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
                thumbColor={notif.enabled ? "#16a34a" : "#F3F4F6"}
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
