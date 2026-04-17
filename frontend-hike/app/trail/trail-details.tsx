import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrailDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("map");
  const [isSaved, setIsSaved] = useState(false);

  // Trail data from params
  const trail = {
    id: params.id as string,
    name: params.name || "View of Rawal Dam from Trail 3 loop from Saidpur",
    difficulty: params.difficulty || "Hard",
    rating: params.rating || "5.0",
    reviews: params.reviews || "23",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    description:
      "Export hike. Good fitness required. Sure-footedness, sturdy shoes and alpine experience required.",
    duration: "3h 31m",
    length: "7.12 km",
    elevationGain: "520 m",
    elevationLoss: "520 m",
    type: "Loop",
    activity: "Hiking",
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="relative">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 z-10 bg-white rounded-full p-2"
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity className="absolute top-4 right-16 z-10 bg-white rounded-full p-2">
            <Ionicons name="share-social" size={24} color="#333" />
          </TouchableOpacity>

          {/* More Button */}
          <TouchableOpacity className="absolute top-4 right-4 z-10 bg-white rounded-full p-2">
            <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
          </TouchableOpacity>

          {/* Trail Image */}
          <Image source={{ uri: trail.image }} className="w-full h-64" />

          {/* Difficulty Badge */}
          <View className="absolute bottom-4 left-4 bg-red-500 px-4 py-2 rounded-full">
            <Text className="text-white font-bold text-sm">
              {trail.difficulty}
            </Text>
          </View>
        </View>

        {/* Trail Info */}
        <View className="p-4">
          {/* Title and Rating */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {trail.name}
          </Text>

          <View className="flex-row items-center mb-4">
            <Ionicons name="star" size={18} color="#F59E0B" />
            <Text className="font-bold text-gray-800 ml-1">{trail.rating}</Text>
            <Text className="text-gray-500 ml-1">({trail.reviews})</Text>
            <View className="ml-4 flex-row items-center">
              <Ionicons name="repeat" size={16} color="#666" />
              <Text className="text-gray-600 ml-1 text-sm">{trail.type}</Text>
            </View>
            <View className="ml-4 flex-row items-center">
              <Ionicons name="walk" size={16} color="#666" />
              <Text className="text-gray-600 ml-1 text-sm">
                {trail.activity}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-gray-700 mb-4 leading-5">
            {trail.description}
          </Text>

          {/* Alert Box */}
          <View className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 rounded">
            <View className="flex-row items-start">
              <Ionicons name="warning" size={20} color="#D97706" />
              <View className="flex-1 ml-2">
                <Text className="text-gray-800 font-semibold mb-1">
                  Includes segments that may be dangerous
                </Text>
                <Text className="text-gray-600 text-xs">1.91 km in total</Text>
              </View>
            </View>
            <TouchableOpacity className="mt-3">
              <Text className="text-amber-600 font-semibold text-sm">
                See all alerts {">"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Save Offline */}
          <View className="flex-row items-center justify-between mb-6 bg-gray-100 p-4 rounded-lg">
            <View className="flex-row items-center">
              <Ionicons name="download" size={20} color="#333" />
              <Text className="ml-2 text-gray-800 font-semibold">
                Save offline
              </Text>
            </View>
            <View className="w-12 h-6 bg-gray-400 rounded-full" />
          </View>

          {/* Stats */}
          <View className="grid grid-cols-2 gap-4 mb-6">
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-gray-500 text-sm mb-2">Duration</Text>
              <Text className="text-gray-900 font-bold text-lg">
                {trail.duration}
              </Text>
            </View>
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-gray-500 text-sm mb-2">Length</Text>
              <Text className="text-gray-900 font-bold text-lg">
                {trail.length}
              </Text>
            </View>
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-gray-500 text-sm mb-2">Elevation Gain</Text>
              <Text className="text-gray-900 font-bold text-lg">
                {trail.elevationGain}
              </Text>
            </View>
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-gray-500 text-sm mb-2">Elevation Loss</Text>
              <Text className="text-gray-900 font-bold text-lg">
                {trail.elevationLoss}
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View className="border-b border-gray-200 mb-6 flex-row">
            {["map", "tips", "waypoints", "elevation"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`pb-3 mr-6 ${
                  activeTab === tab
                    ? "border-b-2 border-green-600"
                    : "border-b-2 border-transparent"
                }`}
              >
                <Text
                  className={`font-semibold capitalize ${
                    activeTab === tab ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {tab === "tips"
                    ? "Tips & Info"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === "map" && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">Map</Text>
              <Image
                source={{
                  uri: "https://via.placeholder.com/400x250?text=Trail+Map",
                }}
                className="w-full h-40 rounded-lg bg-gray-200"
              />
              <TouchableOpacity className="mt-4 bg-green-600 p-4 rounded-lg">
                <Text className="text-white font-bold text-center">
                  Get directions
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "tips" && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Tips & Info
              </Text>

              <View className="mb-6">
                <Text className="text-gray-900 font-bold mb-3">Difficulty</Text>
                <View className="flex-row items-center">
                  <Ionicons name="triangle" size={16} color="#EF4444" />
                  <Ionicons name="triangle" size={16} color="#EF4444" />
                  <Ionicons name="triangle" size={16} color="#EF4444" />
                </View>
              </View>

              <View>
                <Text className="text-gray-900 font-bold mb-3">
                  Fitness Level
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="triangle" size={16} color="#D1D5DB" />
                  <Ionicons name="triangle" size={16} color="#D1D5DB" />
                  <Ionicons name="triangle" size={16} color="#D1D5DB" />
                </View>
              </View>
            </View>
          )}

          {activeTab === "waypoints" && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Waypoints
              </Text>
              <View className="bg-green-50 border-l-4 border-green-600 p-4 rounded mb-3">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-green-600 items-center justify-center">
                    <Text className="text-white text-xs font-bold">A</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-bold text-gray-900">
                      Starting Point
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      Trail 3 Parking
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-gray-100 p-4 rounded mb-3">
                <Image
                  source={{
                    uri: "https://via.placeholder.com/300x150?text=Parking",
                  }}
                  className="w-full h-24 rounded mb-2"
                />
                <Text className="text-gray-600 text-sm">Trail 3 Parking</Text>
                <Text className="text-gray-500 text-xs">Starting Point</Text>
              </View>
            </View>
          )}

          {activeTab === "elevation" && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Elevation
              </Text>
              <Image
                source={{
                  uri: "https://via.placeholder.com/400x200?text=Elevation+Chart",
                }}
                className="w-full h-32 rounded-lg bg-gray-200 mb-4"
              />

              <View className="grid grid-cols-3 gap-3 mb-4">
                <View className="bg-gray-50 p-3 rounded text-center">
                  <View className="flex-row items-center justify-center mb-1">
                    <Ionicons name="arrow-up" size={16} color="#059669" />
                  </View>
                  <Text className="text-gray-900 font-bold text-sm">520 m</Text>
                  <Text className="text-gray-500 text-xs">Uphill</Text>
                </View>
                <View className="bg-gray-50 p-3 rounded text-center">
                  <View className="flex-row items-center justify-center mb-1">
                    <Ionicons name="arrow-down" size={16} color="#EF4444" />
                  </View>
                  <Text className="text-gray-900 font-bold text-sm">520 m</Text>
                  <Text className="text-gray-500 text-xs">Downhill</Text>
                </View>
                <View className="bg-gray-50 p-3 rounded text-center">
                  <View className="flex-row items-center justify-center mb-1">
                    <Text className="text-base">⏱</Text>
                  </View>
                  <Text className="text-gray-900 font-bold text-sm">
                    2 km/h
                  </Text>
                  <Text className="text-gray-500 text-xs">Est. speed</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row gap-3 p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={() => setIsSaved(!isSaved)}
          className={`flex-1 py-4 rounded-lg flex-row items-center justify-center ${
            isSaved ? "bg-green-600" : "bg-green-600"
          }`}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={20}
            color="white"
          />
          <Text className="text-white font-bold ml-2">Save</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 py-4 rounded-lg bg-amber-100 flex-row items-center justify-center">
          <Ionicons name="navigate" size={20} color="#92400E" />
          <Text className="text-amber-900 font-bold ml-2">Navigate</Text>
        </TouchableOpacity>

        <TouchableOpacity className="px-4 py-4 rounded-lg bg-gray-200">
          <Ionicons name="pencil" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
