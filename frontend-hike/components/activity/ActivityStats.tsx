// components/activity/ActivityStats.tsx
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Activity } from "@/hooks/useActivities";
import {
  formatDistance,
  formatDuration,
  formatSpeed,
  formatCalories,
  formatPace,
} from "@/utils/formatters";

interface ActivityStatsProps {
  activity: Activity;
  layout?: "grid" | "list";
}

export default function ActivityStats({
  activity,
  layout = "grid",
}: ActivityStatsProps) {
  const durationMinutes = Math.floor(activity.duration / 60);

  const stats = [
    {
      icon: "navigate-outline" as const,
      label: "Distance",
      value: formatDistance(activity.distance),
      color: "#22c55e",
    },
    {
      icon: "time-outline" as const,
      label: "Duration",
      value: formatDuration(durationMinutes),
      color: "#3b82f6",
    },
    {
      icon: "trending-up-outline" as const,
      label: "Elevation Gain",
      value: `${activity.elevation_gain.toFixed(0)}m`,
      color: "#f59e0b",
    },
    {
      icon: "speedometer-outline" as const,
      label: "Avg Speed",
      value: formatSpeed(activity.avg_speed),
      color: "#8b5cf6",
    },
    {
      icon: "flash-outline" as const,
      label: "Max Speed",
      value: formatSpeed(activity.max_speed),
      color: "#ef4444",
    },
    {
      icon: "timer-outline" as const,
      label: "Avg Pace",
      value: formatPace(activity.avg_speed),
      color: "#06b6d4",
    },
    {
      icon: "flame-outline" as const,
      label: "Calories",
      value: formatCalories(activity.calories),
      color: "#f97316",
    },
    {
      icon: "location-outline" as const,
      label: "GPS Points",
      value: activity.path.length.toString(),
      color: "#84cc16",
    },
  ];

  if (layout === "grid") {
    return (
      <View className="bg-gray-800 rounded-2xl p-4">
        <Text className="text-white text-lg font-bold mb-4">Statistics</Text>
        <View className="flex-row flex-wrap -mx-2">
          {stats.map((stat, index) => (
            <View key={index} className="w-1/2 px-2 mb-4">
              <View className="bg-gray-700/50 rounded-xl p-3">
                <View className="flex-row items-center mb-2">
                  <Ionicons name={stat.icon} size={18} color={stat.color} />
                  <Text className="text-gray-400 text-xs ml-2">
                    {stat.label}
                  </Text>
                </View>
                <Text className="text-white font-bold text-lg">
                  {stat.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // List layout
  return (
    <View className="bg-gray-800 rounded-2xl p-4">
      <Text className="text-white text-lg font-bold mb-4">Statistics</Text>
      {stats.map((stat, index) => (
        <View
          key={index}
          className="flex-row items-center justify-between py-3 border-b border-gray-700"
          style={index === stats.length - 1 ? { borderBottomWidth: 0 } : {}}
        >
          <View className="flex-row items-center">
            <Ionicons name={stat.icon} size={20} color={stat.color} />
            <Text className="text-gray-400 ml-3">{stat.label}</Text>
          </View>
          <Text className="text-white font-semibold">{stat.value}</Text>
        </View>
      ))}
    </View>
  );
}
