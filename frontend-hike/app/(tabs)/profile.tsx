import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";

type SettingItem = {
  label: string;
  icon: string;
  onPress: () => void;
};

export default function ProfileScreen() {
  const [selectedTab, setSelectedTab] = useState<"about" | "timeline">("about");
  const [showProfileInfoModal, setShowProfileInfoModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("Alone Survivor");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };

  const handleNavigate = (section: string) => {
    if (section === "Profile information") {
      setShowProfileInfoModal(true);
    } else {
      Alert.alert(section, `Navigate to ${section} settings`);
    }
  };

  const handleSelectProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error("Image picker error:", error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace("/(auth)/welcome" as any);
            } catch (error) {
              console.error("Failed to delete account:", error);
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const handleSaveProfileInfo = () => {
    console.log("Save profile information", {
      name,
      website,
      about,
      profileImage,
    });
    Alert.alert("Success", "Profile information saved!");
    setShowProfileInfoModal(false);
  };

  const handleCopyLink = async () => {
    const profileLink = `https://hikepanner.app/profile/${name.toLowerCase().replace(/\s+/g, "-")}`;
    await Clipboard.setString(profileLink);
    Alert.alert("Copied", "Profile link copied to clipboard!");
  };

  const handleShareProfile = async () => {
    try {
      const profileLink = `https://hikepanner.app/profile/${name.toLowerCase().replace(/\s+/g, "-")}`;
      await Share.share({
        message: `Check out my hikepanner profile: ${profileLink}`,
        title: "Share Profile",
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const accountSettings: SettingItem[] = [
    {
      label: "Notifications",
      icon: "notifications-outline",
      onPress: () => handleNavigate("Notifications"),
    },
    {
      label: "Profile information",
      icon: "person-outline",
      onPress: () => handleNavigate("Profile information"),
    },
    {
      label: "Home address",
      icon: "home-outline",
      onPress: () => handleNavigate("Home address"),
    },
    {
      label: "Visibility and privacy",
      icon: "eye-outline",
      onPress: () => handleNavigate("Visibility and privacy"),
    },
    {
      label: "Live Tracking",
      icon: "location-outline",
      onPress: () => handleNavigate("Live Tracking"),
    },
  ];

  const connectionSettings: SettingItem[] = [
    {
      label: "Google",
      icon: "logo-google",
      onPress: () => handleNavigate("Google"),
    },
    {
      label: "Facebook",
      icon: "logo-facebook",
      onPress: () => handleNavigate("Facebook"),
    },
  ];

  const appInfo: SettingItem[] = [
    {
      label: "What's new",
      icon: "star-outline",
      onPress: () => handleNavigate("What's new"),
    },
    {
      label: "Feedback & support",
      icon: "help-circle-outline",
      onPress: () => handleNavigate("Feedback & support"),
    },
    {
      label: "Write a review",
      icon: "thumbs-up-outline",
      onPress: () => handleNavigate("Write a review"),
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
      <Text className="text-lg font-bold text-gray-900 px-5 mb-3">{title}</Text>
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
              <Text className="text-base text-gray-900 font-medium">
                {item.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const stats = [
    { label: "Saved routes", value: "0", icon: "trail-sign" as const },
    { label: "Contributions", value: "0", icon: "create" as const },
    { label: "Completed activities", value: "0", icon: "flag" as const },
    { label: "Highlights", value: "0", icon: "sparkles" as const },
  ];

  return (
    <SafeScreen className="bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Actions */}
        <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-gray-900">Profile</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => setShowNotificationsModal(true)}
              className="w-11 h-11 bg-white rounded-full items-center justify-center border border-gray-200"
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#111827"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowShareModal(true)}
              className="w-11 h-11 bg-white rounded-full items-center justify-center border border-gray-200"
            >
              <Ionicons name="share-outline" size={22} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/settings" as any)}
              className="w-11 h-11 bg-white rounded-full items-center justify-center border border-gray-200"
            >
              <Ionicons name="settings-outline" size={22} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Header */}
        <View className="px-5 py-4">
          <View className="flex-row items-start">
            <View className="relative">
              <View className="w-24 h-24 bg-green-600 rounded-full items-center justify-center">
                <Ionicons name="person" size={48} color="#ffffff" />
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full items-center justify-center border-2 border-gray-50">
                <Ionicons name="create" size={16} color="#111827" />
              </TouchableOpacity>
            </View>

            <View className="flex-1 ml-4">
              <Text className="text-2xl font-bold text-gray-900">
                Alone Survivor
              </Text>

              {/* Followers/Following */}
              <View className="flex-row mt-2">
                <View className="mr-5">
                  <Text className="text-xl font-bold text-gray-900">0</Text>
                  <Text className="text-sm text-gray-600">Followers</Text>
                </View>
                <View>
                  <Text className="text-xl font-bold text-gray-900">0</Text>
                  <Text className="text-sm text-gray-600">Following</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row mt-4 space-x-2">
            <TouchableOpacity className="flex-1 bg-gray-100 rounded-xl py-3 items-center justify-center">
              <Ionicons name="search" size={20} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-100 rounded-xl py-3 items-center justify-center">
              <Ionicons name="person-add" size={20} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View className="px-5 border-b border-gray-200">
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setSelectedTab("about")}
              className={`flex-1 py-3 border-b-2 ${
                selectedTab === "about"
                  ? "border-gray-900"
                  : "border-transparent"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  selectedTab === "about" ? "text-gray-900" : "text-gray-500"
                }`}
              >
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab("timeline")}
              className={`flex-1 py-3 border-b-2 ${
                selectedTab === "timeline"
                  ? "border-gray-900"
                  : "border-transparent"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  selectedTab === "timeline" ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Timeline
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Tab Content */}
        {selectedTab === "about" && (
          <View className="px-5 py-5">
            {/* Saved Collections */}
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="items-center">
                <View className="w-full h-32 bg-green-100 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="bookmark" size={48} color="#16a34a" />
                  <Text className="text-gray-600 mt-2">-</Text>
                </View>
                <Text className="text-xl font-bold text-gray-900">
                  Saved Collections
                </Text>
              </View>
            </View>

            {/* Statistics Section */}
            <TouchableOpacity className="bg-white rounded-2xl p-5 mb-4 shadow-sm flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">
                Statistics
              </Text>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Stats Grid */}
            <View className="flex-row justify-between mb-4">
              <View className="bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm">
                <Text className="text-xl font-bold text-gray-900">
                  Activities
                </Text>
                <Text className="text-3xl font-bold text-gray-900 mt-1">0</Text>
              </View>
              <View className="bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm">
                <Text className="text-xl font-bold text-gray-900">
                  Distance
                </Text>
                <Text className="text-3xl font-bold text-gray-900 mt-1">
                  0 m
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
              <Text className="text-xl font-bold text-gray-900">Time</Text>
              <Text className="text-3xl font-bold text-gray-900 mt-1">0m</Text>
            </View>

            {/* Large Map Placeholder */}
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="w-full h-64 bg-gray-100 rounded-xl items-center justify-center">
                <Ionicons name="trail-sign" size={64} color="#9CA3AF" />
              </View>
            </View>

            {/* Maps Section */}
            <TouchableOpacity className="bg-white rounded-2xl p-5 mb-4 shadow-sm flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">Maps</Text>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Stats Cards */}
            <View className="flex-row flex-wrap -mx-1 mb-4">
              {stats.map((stat, index) => (
                <TouchableOpacity key={index} className="w-1/2 px-1 mb-2">
                  <View className="bg-white rounded-2xl p-4 shadow-sm">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </Text>
                      <Ionicons name={stat.icon} size={24} color="#9CA3AF" />
                    </View>
                    <Text className="text-sm text-gray-900">{stat.label}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#9CA3AF"
                      className="mt-1"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Collections */}
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Text className="text-xl font-bold text-gray-900">
                    Collections
                  </Text>
                  <Text className="text-xl ml-1">🏔️</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
              </View>
              <View className="flex-row">
                <View className="w-16 h-16 bg-gray-200 rounded-full mr-2" />
                <View className="flex-1 h-16 bg-green-100 rounded-xl items-center justify-center">
                  <Ionicons name="bookmark" size={32} color="#16a34a" />
                </View>
              </View>
            </View>

            {/* Add Button */}
            <TouchableOpacity className="bg-white rounded-2xl p-5 items-center justify-center border-2 border-dashed border-gray-300">
              <Ionicons name="add" size={32} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Timeline Tab Content */}
        {selectedTab === "timeline" && (
          <View className="px-5 py-5">
            <View
              className="bg-white rounded-2xl p-8 items-center justify-center"
              style={{ minHeight: 300 }}
            >
              <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
              <Text className="text-xl font-semibold text-gray-900 mt-4">
                No Activity Yet
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                Your hiking timeline will appear here once you start tracking
                activities
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Padding */}
        <View className="h-6" />
      </ScrollView>

      {/* Profile Information Modal */}
      <Modal
        visible={showProfileInfoModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowProfileInfoModal(false)}
      >
        <SafeScreen className="bg-white flex-1">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="px-5 pt-4 pb-6 flex-row items-center">
              <TouchableOpacity onPress={() => setShowProfileInfoModal(false)}>
                <Ionicons name="chevron-back" size={28} color="#111827" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-900 ml-4">
                Profile Information
              </Text>
            </View>

            {/* Profile Picture Section */}
            <View className="px-5 mb-8">
              <View className="items-center">
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                ) : (
                  <View className="w-24 h-24 bg-yellow-400 rounded-full items-center justify-center mb-4">
                    <Text className="text-5xl">A</Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={handleSelectProfilePicture}
                  className="flex-row items-center"
                >
                  <Ionicons name="image" size={20} color="#16a34a" />
                  <Text className="text-green-600 font-semibold ml-2">
                    Select profile picture
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Public Information Section */}
            <View className="mb-8">
              <Text className="text-sm font-semibold text-gray-600 px-5 mb-4">
                PUBLIC INFORMATION
              </Text>

              {/* Your Name */}
              <View className="px-5 mb-6">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="person" size={20} color="#6B7280" />
                  <Text className="text-gray-700 font-medium ml-3">
                    Your name
                  </Text>
                </View>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#D1D5DB"
                  className="border-b border-gray-300 py-3 px-0 text-gray-900"
                />
              </View>

              {/* Website */}
              <View className="px-5 mb-6">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="globe" size={20} color="#6B7280" />
                  <Text className="text-gray-700 font-medium ml-3">
                    Website
                  </Text>
                </View>
                <TextInput
                  value={website}
                  onChangeText={setWebsite}
                  placeholder="https://example.com"
                  placeholderTextColor="#D1D5DB"
                  className="border-b border-gray-300 py-3 px-0 text-gray-900"
                />
              </View>

              {/* About */}
              <View className="px-5 mb-6">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="document-text" size={20} color="#6B7280" />
                  <Text className="text-gray-700 font-medium ml-3">About</Text>
                </View>
                <TextInput
                  value={about}
                  onChangeText={setAbout}
                  placeholder="Tell us about yourself"
                  placeholderTextColor="#D1D5DB"
                  multiline
                  numberOfLines={4}
                  className="border border-gray-300 rounded-lg py-3 px-3 text-gray-900"
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Private Information Section */}
            <View className="mb-8">
              <Text className="text-sm font-semibold text-gray-600 px-5 mb-4">
                PRIVATE INFORMATION
              </Text>

              {/* Email */}   //TODO: This shows user email 'user email'
              <View className="px-5 mb-6">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="mail" size={20} color="#6B7280" />
                    <View className="ml-3 flex-1">
                      <Text className="text-gray-600 text-sm">
                        Email address
                      </Text>
                      <Text className="text-gray-900 font-medium mt-1">
                        harris11.games@gmail.com
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-green-600 font-semibold text-sm">
                      Tap to change
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Change Password */}
              <TouchableOpacity className="px-5 mb-6 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="lock-closed" size={20} color="#6B7280" />
                  <Text className="text-gray-900 font-medium ml-3">
                    Change password
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </TouchableOpacity>
            </View>

            {/* Additional Information Section */}
            <View className="mb-8">
              <Text className="text-sm font-semibold text-gray-600 px-5 mb-4">
                ADDITIONAL INFORMATION
              </Text>

              <View className="px-5 mb-6">
                <Text className="text-gray-600 text-sm mb-2">
                  Hike Planner ID
                </Text>
                <Text className="text-gray-900 font-medium">5437896242429</Text>  //TODO: Make this number to userId 
              </View>
            </View>

            {/* Delete Account Section */}
            <View className="px-5 mb-8">
              <TouchableOpacity
                onPress={handleDeleteAccount}
                className="bg-red-50 rounded-full py-4 border-2 border-red-300"
              >
                <Text className="text-red-600 font-bold text-center text-lg">
                  Delete Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Save Button */}
            <View className="px-5 mb-8">
              <TouchableOpacity
                onPress={handleSaveProfileInfo}
                className="bg-green-600 rounded-full py-4 items-center justify-center"
              >
                <Text className="text-white font-semibold text-lg">Save</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Padding */}
            <View className="h-6" />
          </ScrollView>
        </SafeScreen>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <SafeScreen className="bg-white flex-1">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="px-5 pt-4 pb-6 flex-row items-center">
              <TouchableOpacity
                onPress={() => setShowNotificationsModal(false)}
              >
                <Ionicons name="chevron-back" size={28} color="#111827" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-900 ml-4">
                Notifications
              </Text>
            </View>

            {/* Empty State */}
            <View className="flex-1 items-center justify-center px-5 py-20">
              <Ionicons
                name="notifications-outline"
                size={64}
                color="#D1D5DB"
              />
              <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
                No Notifications
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                You'll receive notifications about activities, comments, and
                messages here
              </Text>
            </View>

            {/* Bottom Padding */}
            <View className="h-6" />
          </ScrollView>
        </SafeScreen>
      </Modal>

      {/* Share Profile Modal */}
      <Modal
        visible={showShareModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowShareModal(false)}
      >
        <SafeScreen className="bg-white flex-1">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="px-5 pt-4 pb-6 flex-row items-center">
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <Ionicons name="chevron-back" size={28} color="#111827" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-900 ml-4">
                Share profile
              </Text>
            </View>

            {/* Share Content */}
            <View className="flex-1 items-center justify-center px-5 py-8">
              <Text className="text-gray-700 text-center text-base mb-8">
                People will receive a link to your hikepanner profile when they
                scan the QR code.
              </Text>

              {/* Profile Name */}
              <Text className="text-2xl font-bold text-gray-900 mb-6">
                {name}
              </Text>

              {/* QR Code */}
              <View className="bg-white rounded-2xl p-6 mb-8 border-2 border-green-600">
                <Image
                  source={{
                    uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://hikepanner.app/profile/${name.toLowerCase().replace(/\s+/g, "-")}`)}`,
                  }}
                  style={{ width: 250, height: 250 }}
                />
              </View>

              {/* Copy Link Button */}
              <TouchableOpacity
                onPress={handleCopyLink}
                className="flex-row items-center bg-yellow-100 rounded-full px-6 py-3 mb-4 w-full justify-center"
              >
                <Ionicons name="link" size={20} color="#B45309" />
                <Text className="text-yellow-700 font-semibold ml-2">
                  Copy link
                </Text>
              </TouchableOpacity>

              {/* Share Profile Button */}
              <TouchableOpacity
                onPress={handleShareProfile}
                className="flex-row items-center bg-green-100 rounded-full px-6 py-3 w-full justify-center"
              >
                <Ionicons name="share-social" size={20} color="#16a34a" />
                <Text className="text-green-700 font-semibold ml-2">
                  Share profile
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Padding */}
            <View className="h-6" />
          </ScrollView>
        </SafeScreen>
      </Modal>
    </SafeScreen>
  );
}