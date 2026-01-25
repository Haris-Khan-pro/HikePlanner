import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";

export default function AddressModal() {
  const router = useRouter();
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleSave = () => {
    Alert.alert("Success", "Home address saved!");
  };

  return (
    <SafeScreen className="bg-white flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-6 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 ml-4">
            Home Address
          </Text>
        </View>

        <View className="px-5 mb-8">
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="location" size={20} color="#6B7280" />
              <Text className="text-gray-700 font-medium ml-3">Street</Text>
            </View>
            <TextInput
              value={street}
              onChangeText={setStreet}
              placeholder="Enter street address"
              placeholderTextColor="#D1D5DB"
              className="border-b border-gray-300 py-3 px-0 text-gray-900"
            />
          </View>

          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="business" size={20} color="#6B7280" />
              <Text className="text-gray-700 font-medium ml-3">City</Text>
            </View>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Enter city"
              placeholderTextColor="#D1D5DB"
              className="border-b border-gray-300 py-3 px-0 text-gray-900"
            />
          </View>

          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="map" size={20} color="#6B7280" />
              <Text className="text-gray-700 font-medium ml-3">State</Text>
            </View>
            <TextInput
              value={state}
              onChangeText={setState}
              placeholder="Enter state"
              placeholderTextColor="#D1D5DB"
              className="border-b border-gray-300 py-3 px-0 text-gray-900"
            />
          </View>

          <View className="mb-8">
            <View className="flex-row items-center mb-3">
              <Ionicons name="code" size={20} color="#6B7280" />
              <Text className="text-gray-700 font-medium ml-3">Zip Code</Text>
            </View>
            <TextInput
              value={zipCode}
              onChangeText={setZipCode}
              placeholder="Enter zip code"
              placeholderTextColor="#D1D5DB"
              className="border-b border-gray-300 py-3 px-0 text-gray-900"
            />
          </View>
        </View>

        <View className="px-5 mb-8">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-green-600 rounded-full py-4 items-center justify-center"
          >
            <Text className="text-white font-semibold text-lg">
              Save Address
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeScreen>
  );
}
