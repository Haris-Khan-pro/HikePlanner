// components/activity/ActivityCard.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Activity } from "@/hooks/useActivities";
import {
  formatDistance,
  formatDuration,
  formatDate,
  formatTime,
} from "@/utils/formatters";

interface ActivityCardProps {
  activity: Activity;
  onPress?: (activity: Activity) => void;
}

export default function ActivityCard({ activity, onPress }: ActivityCardProps) {
  const durationMinutes = Math.floor(activity.duration / 60);

  return (
    <TouchableOpacity
      onPress={() => onPress?.(activity)}
      className="bg-gray-800 rounded-2xl p-4 mb-3"
      activeOpacity={0.7}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-green-500/20 rounded-full items-center justify-center mr-3">
            <Ionicons name="walk" size={24} color="#22c55e" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              {activity.trail_name || "Outdoor Activity"}
            </Text>
            <Text className="text-gray-400 text-sm">
              {formatDate(activity.start_time)} •{" "}
              {formatTime(activity.start_time)}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>

      {/* Stats Row */}
      <View className="flex-row justify-between pt-3 border-t border-gray-700">
        <View className="items-center">
          <Text className="text-gray-400 text-xs mb-1">Distance</Text>
          <Text className="text-white font-bold text-base">
            {formatDistance(activity.distance)}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-gray-400 text-xs mb-1">Duration</Text>
          <Text className="text-white font-bold text-base">
            {formatDuration(durationMinutes)}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-gray-400 text-xs mb-1">Elevation</Text>
          <Text className="text-white font-bold text-base">
            {activity.elevation_gain.toFixed(0)}m
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-gray-400 text-xs mb-1">Calories</Text>
          <Text className="text-white font-bold text-base">
            {activity.calories.toFixed(0)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
