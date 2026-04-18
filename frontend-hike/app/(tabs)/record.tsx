import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import ActivityCard from "@/components/activity/ActivityCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { useRecording } from "@/hooks/useRecording";
import type { RecordingState } from "@/hooks/useRecording";
import { useActivities, useCreateActivity } from "@/hooks/useActivities";
import {
  formatDistance,
  formatDuration,
  formatSpeed,
  formatPace,
  formatCalories,
} from "@/utils/formatters";

export default function RecordScreen() {
  const { trailId, trailName } = useLocalSearchParams<{
    trailId?: string;
    trailName?: string;
  }>();

  const {
    isRecording,
    isPaused,
    duration,
    distance,
    currentSpeed,
    avgSpeed,
    elevationGain,
    calories,
    path,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useRecording();

  const { data: activities = [], isLoading } = useActivities();
  const createActivity = useCreateActivity();
  const [activeTab, setActiveTab] = useState<"record" | "history">("record");
  const [isSaving, setIsSaving] = useState(false);

  const handleStop = async () => {
    const finalState = stopRecording();
    await saveActivity(finalState);
  };

  const saveActivity = async (state: RecordingState) => {
    if (!state.startTime) return;
    try {
      setIsSaving(true);
      await createActivity.mutateAsync({
        trail_id: trailId,
        trail_name: trailName,
        start_time: state.startTime.toISOString(),
        end_time: new Date().toISOString(),
        distance: state.distance,
        duration: state.duration,
        elevation_gain: state.elevationGain,
        avg_speed: state.avgSpeed,
        max_speed: state.maxSpeed,
        calories: state.calories,
        path: state.path.map((p) => ({
          latitude: p.latitude,
          longitude: p.longitude,
        })),
      });
    } catch (error) {
      console.error("Error saving activity:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeScreen>
      {/* Header + Tab Switcher */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-3xl font-bold text-white mb-4">Activity</Text>
        <View className="flex-row bg-gray-800 rounded-xl p-1">
          {(["record", "history"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg ${activeTab === tab ? "bg-green-600" : ""}`}
            >
              <Text
                className={`text-center font-semibold capitalize ${activeTab === tab ? "text-white" : "text-gray-400"}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === "record" ? (
        <ScrollView className="flex-1 px-4">
          {/* Trail name banner — shown when launched from Start Hike */}
          {!!trailName && (
            <View className="bg-green-900/40 border border-green-700 rounded-2xl px-4 py-3 mt-4 flex-row items-center">
              <Ionicons name="trail-sign-outline" size={20} color="#4ade80" />
              <Text
                className="text-green-300 font-semibold ml-2 flex-1"
                numberOfLines={1}
              >
                {trailName}
              </Text>
            </View>
          )}

          {/* Main Timer Card */}
          <View className="bg-gray-800 rounded-3xl p-6 my-4">
            <View className="items-center mb-6">
              <Text className="text-6xl font-bold text-white tabular-nums">
                {formatDuration(Math.floor(duration / 60))}
              </Text>
              <Text className="text-gray-400 text-sm mt-2">Duration</Text>
            </View>
            <View className="flex-row justify-around mb-6">
              <View className="items-center">
                <Text className="text-3xl font-bold text-green-500">
                  {formatDistance(distance)}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">Distance</Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl font-bold text-blue-500">
                  {elevationGain.toFixed(0)}m
                </Text>
                <Text className="text-gray-400 text-sm mt-1">Elevation</Text>
              </View>
            </View>
            <View className="flex-row justify-center gap-4">
              {!isRecording ? (
                <TouchableOpacity
                  onPress={startRecording}
                  className="bg-green-600 rounded-full w-20 h-20 items-center justify-center"
                >
                  <Ionicons name="play" size={32} color="white" />
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={isPaused ? resumeRecording : pauseRecording}
                    className="bg-yellow-600 rounded-full w-16 h-16 items-center justify-center"
                  >
                    <Ionicons
                      name={isPaused ? "play" : "pause"}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleStop}
                    disabled={isSaving}
                    className="bg-red-600 rounded-full w-20 h-20 items-center justify-center"
                  >
                    <Ionicons name="stop" size={32} color="white" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Stats Card */}
          <View className="bg-gray-800 rounded-3xl p-6 mb-4">
            <Text className="text-white text-lg font-bold mb-4">
              Statistics
            </Text>
            {[
              {
                icon: "speedometer-outline",
                label: "Current Speed",
                value: formatSpeed(currentSpeed),
              },
              {
                icon: "speedometer",
                label: "Average Speed",
                value: formatSpeed(avgSpeed),
              },
              {
                icon: "time-outline",
                label: "Average Pace",
                value: formatPace(avgSpeed),
              },
              {
                icon: "flame-outline",
                label: "Calories",
                value: formatCalories(calories),
              },
              {
                icon: "location-outline",
                label: "GPS Points",
                value: String(path.length),
              },
            ].map(({ icon, label, value }) => (
              <View
                key={label}
                className="flex-row items-center justify-between py-2"
              >
                <View className="flex-row items-center">
                  <Ionicons name={icon as any} size={20} color="#9CA3AF" />
                  <Text className="text-gray-400 ml-3">{label}</Text>
                </View>
                <Text className="text-white font-semibold">{value}</Text>
              </View>
            ))}
          </View>

          {isRecording && (
            <View className="bg-gray-800 rounded-3xl p-4 mb-6 flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-3" />
              <Text className="text-white">
                {isPaused ? "Recording Paused" : "Recording Active"}
              </Text>
            </View>
          )}
          <View className="h-20" />
        </ScrollView>
      ) : (
        /* History Tab */
        <View style={{ flex: 1, backgroundColor: "#1A1F2E" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 18,
              paddingBottom: 18,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "800",
                  color: "#FFFFFF",
                  letterSpacing: -0.3,
                }}
              >
                Activity Log
              </Text>
              <Text style={{ fontSize: 13, color: "#6B7A99", marginTop: 3 }}>
                Track your hikes
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setActiveTab("record")}
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor: "#2ECC71",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#2ECC71",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 8,
              }}
            >
              <Ionicons name="add" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {!isLoading && activities.length > 0 && (
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: "#3D4A6B",
                letterSpacing: 1.5,
                paddingHorizontal: 20,
                marginBottom: 10,
              }}
            >
              RECENT HIKES
            </Text>
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          >
            {isLoading ? (
              <LoadingSpinner message="Loading activities..." />
            ) : activities.length === 0 ? (
              <EmptyState
                icon="fitness-outline"
                title="No Activities Yet"
                message="Start recording your first hiking activity!"
              />
            ) : (
              activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity as any}
                  onPress={(act) => console.log("View activity:", act.id)}
                />
              ))
            )}
          </ScrollView>
        </View>
      )}
    </SafeScreen>
  );
}
