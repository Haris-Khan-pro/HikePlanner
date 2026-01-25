import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";

export default function ProfileInformationModal() {
  const router = useRouter();
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordModalStep, setPasswordModalStep] = useState<1 | 2 | 3 | null>(
    null,
  );

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [user]);

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
          onPress: () => {
            Alert.alert("Deleted", "Your account has been deleted.");
            router.push("/(auth)/welcome" as any);
          },
        },
      ],
    );
  };

  const handleSave = () => {
    Alert.alert("Success", "Profile information saved!");
  };

  const handleChangeEmail = () => {
    Alert.prompt(
      "Change Email",
      "Enter your new email address",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Change",
          onPress: (newEmailValue: string | undefined) => {
            if (newEmailValue && newEmailValue.includes("@")) {
              setEmail(newEmailValue);
              Alert.alert("Success", "Email changed successfully!");
            } else {
              Alert.alert("Error", "Please enter a valid email address");
            }
          },
        },
      ],
      "plain-text",
    );
  };

  const handleChangePassword = () => {
    setPasswordModalStep(1);
  };

  const handlePasswordStepNext = () => {
    if (passwordModalStep === 1) {
      if (!currentPassword) {
        Alert.alert("Error", "Please enter your current password");
        return;
      }
      setPasswordModalStep(2);
    } else if (passwordModalStep === 2) {
      if (!newPassword || newPassword.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters");
        return;
      }
      setPasswordModalStep(3);
    }
  };

  const handlePasswordConfirm = () => {
    if (confirmPassword !== newPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    Alert.alert("Success", "Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordModalStep(null);
  };

  const closePasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordModalStep(null);
  };

  return (
    <SafeScreen className="bg-white flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 ml-4">
            Profile Information
          </Text>
        </View>

        {/* Profile Picture Section */}
        <View className="px-5 mb-8 items-center">
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

        {/* PUBLIC INFORMATION Section */}
        <View className="mb-8">
          <Text className="text-xs font-semibold text-gray-500 px-5 mb-4 uppercase">
            PUBLIC INFORMATION
          </Text>

          {/* Your Name */}
          <View className="px-5 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="person" size={20} color="#6B7280" />
              <Text className="text-gray-700 font-medium ml-3">Your name</Text>
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
              <Text className="text-gray-700 font-medium ml-3">Website</Text>
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
              numberOfLines={3}
              className="border-b border-gray-300 py-3 px-0 text-gray-900"
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* PRIVATE INFORMATION Section */}
        <View className="mb-8">
          <Text className="text-xs font-semibold text-gray-500 px-5 mb-4 uppercase">
            PRIVATE INFORMATION
          </Text>

          {/* Email */}
          <TouchableOpacity
            onPress={handleChangeEmail}
            className="px-5 mb-6 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1">
              <Ionicons name="mail" size={20} color="#6B7280" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-600 text-xs">Email address</Text>
                <Text className="text-gray-900 font-medium mt-1">{email}</Text>
              </View>
            </View>
            <Text className="text-green-600 font-semibold text-xs">
              Tap to change
            </Text>
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity
            onPress={handleChangePassword}
            className="px-5 mb-6 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="lock-closed" size={20} color="#6B7280" />
              <Text className="text-gray-900 font-medium ml-3">
                Change password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* ADDITIONAL INFORMATION Section */}
        <View className="mb-8">
          <Text className="text-xs font-semibold text-gray-500 px-5 mb-4 uppercase">
            ADDITIONAL INFORMATION
          </Text>

          <View className="px-5 mb-6">
            <Text className="text-gray-600 text-xs mb-2">My ID</Text>
            <Text className="text-gray-900 font-medium">5437896242429</Text>
          </View>
        </View>

        {/* Delete Account Button */}
        <View className="px-5 mb-8">
          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="bg-red-50 rounded-full py-4 border-2 border-red-300 items-center justify-center"
          >
            <Text className="text-red-600 font-bold text-center text-lg">
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
        <View className="h-8" />
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={passwordModalStep !== null} transparent={true}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-lg p-6 w-5/6 max-w-sm">
            {passwordModalStep === 1 && (
              <>
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Enter Current Password
                </Text>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Current password"
                  placeholderTextColor="#D1D5DB"
                  secureTextEntry={true}
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-6 text-gray-900"
                />
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={closePasswordModal}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg items-center"
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handlePasswordStepNext}
                    className="flex-1 py-2 px-4 bg-green-600 rounded-lg items-center"
                  >
                    <Text className="text-white font-semibold">Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {passwordModalStep === 2 && (
              <>
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Enter New Password
                </Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password (min 6 characters)"
                  placeholderTextColor="#D1D5DB"
                  secureTextEntry={true}
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-6 text-gray-900"
                />
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setPasswordModalStep(1)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg items-center"
                  >
                    <Text className="text-gray-700 font-semibold">Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handlePasswordStepNext}
                    className="flex-1 py-2 px-4 bg-green-600 rounded-lg items-center"
                  >
                    <Text className="text-white font-semibold">Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {passwordModalStep === 3 && (
              <>
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Confirm Password
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="#D1D5DB"
                  secureTextEntry={true}
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-6 text-gray-900"
                />
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setPasswordModalStep(2)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg items-center"
                  >
                    <Text className="text-gray-700 font-semibold">Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handlePasswordConfirm}
                    className="flex-1 py-2 px-4 bg-green-600 rounded-lg items-center"
                  >
                    <Text className="text-white font-semibold">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}
