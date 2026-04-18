import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Activity } from "@/hooks/useActivities";
import { formatDistance, formatDuration, formatDate } from "@/utils/formatters";

interface ActivityCardProps {
  activity: Activity;
  onPress?: (activity: Activity) => void;
}

export default function ActivityCard({ activity, onPress }: ActivityCardProps) {
  const durationMinutes = Math.floor(activity.duration / 60);

  return (
    <TouchableOpacity
      onPress={() => onPress?.(activity)}
      activeOpacity={0.75}
      style={{
        backgroundColor: "#242B3D",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}
    >
      {/* Top row */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF", marginBottom: 3 }}>
            {activity.trail_name || "Outdoor Activity"}
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7A99" }}>
            {formatDate(activity.start_time)}
          </Text>
        </View>
        <View style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: "#2A3347",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Ionicons name="git-compare-outline" size={18} color="#2ECC71" />
        </View>
      </View>

      {/* Stats row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 14, gap: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name="git-compare-outline" size={14} color="#2ECC71" />
          <Text style={{ fontSize: 13, color: "#B0BDDA", fontWeight: "600" }}>
            {formatDistance(activity.distance)}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name="arrow-up-outline" size={14} color="#2ECC71" />
          <Text style={{ fontSize: 13, color: "#B0BDDA", fontWeight: "600" }}>
            {activity.elevation_gain.toFixed(0)} m
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name="time-outline" size={14} color="#2ECC71" />
          <Text style={{ fontSize: 13, color: "#B0BDDA", fontWeight: "600" }}>
            {formatDuration(durationMinutes)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}