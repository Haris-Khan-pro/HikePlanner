// app/(tabs)/record.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SafeScreen from '@/components/SafeScreen';
import ActivityCard from '@/components/activity/ActivityCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { useRecording } from '@/hooks/useRecording';
import { useActivities, useCreateActivity } from '@/hooks/useActivities';
import { formatDistance, formatDuration, formatSpeed, formatPace, formatCalories } from '@/utils/formatters';

export default function RecordScreen() {
  const router = useRouter();
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

  const { data: activities, isLoading } = useActivities();
  const createActivity = useCreateActivity();
  const [activeTab, setActiveTab] = useState<'record' | 'history'>('record');
  const [isSaving, setIsSaving] = useState(false);

  const handleStart = () => {
    startRecording();
  };

  const handlePause = () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  const handleStop = async () => {
    Alert.alert(
      'Stop Recording',
      'Do you want to save this activity?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            stopRecording();
          },
        },
        {
          text: 'Save',
          onPress: async () => {
            const finalState = stopRecording();
            await saveActivity(finalState);
          },
        },
      ]
    );
  };

  const saveActivity = async (activityData: any) => {
    try {
      setIsSaving(true);
      
      await createActivity.mutateAsync({
        startTime: activityData.startTime.toISOString(),
        endTime: new Date().toISOString(),
        distance: activityData.distance,
        duration: activityData.duration,
        elevationGain: activityData.elevationGain,
        avgSpeed: activityData.avgSpeed,
        maxSpeed: activityData.maxSpeed,
        calories: activityData.calories,
        path: activityData.path,
      });

      Alert.alert('Success', 'Activity saved successfully!');
      setActiveTab('history');
    } catch (error) {
      console.error('Failed to save activity:', error);
      Alert.alert('Error', 'Failed to save activity');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeScreen>
      {/* Header with Tabs */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-3xl font-bold text-white mb-4">Activity</Text>
        
        {/* Tab Switcher */}
        <View className="flex-row bg-gray-800 rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('record')}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === 'record' ? 'bg-green-600' : ''
            }`}
          >
            <Text className={`text-center font-semibold ${
              activeTab === 'record' ? 'text-white' : 'text-gray-400'
            }`}>
              Record
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === 'history' ? 'bg-green-600' : ''
            }`}
          >
            <Text className={`text-center font-semibold ${
              activeTab === 'history' ? 'text-white' : 'text-gray-400'
            }`}>
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {activeTab === 'record' ? (
        <ScrollView className="flex-1 px-4">
          {/* Main Stats Card */}
          <View className="bg-gray-800 rounded-3xl p-6 my-4">
            {/* Timer */}
            <View className="items-center mb-6">
              <Text className="text-6xl font-bold text-white">
                {formatDuration(Math.floor(duration / 60))}
              </Text>
              <Text className="text-gray-400 text-sm mt-2">Duration</Text>
            </View>

            {/* Distance and Elevation */}
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

            {/* Control Buttons */}
            <View className="flex-row justify-center space-x-4">
              {!isRecording ? (
                <TouchableOpacity
                  onPress={handleStart}
                  className="bg-green-600 rounded-full w-20 h-20 items-center justify-center shadow-lg"
                >
                  <Ionicons name="play" size={32} color="white" />
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={handlePause}
                    className="bg-yellow-600 rounded-full w-16 h-16 items-center justify-center shadow-lg"
                  >
                    <Ionicons name={isPaused ? "play" : "pause"} size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleStop}
                    className="bg-red-600 rounded-full w-20 h-20 items-center justify-center shadow-lg"
                    disabled={isSaving}
                  >
                    <Ionicons name="stop" size={32} color="white" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Additional Stats */}
          <View className="bg-gray-800 rounded-3xl p-6 mb-4">
            <Text className="text-white text-lg font-bold mb-4">Statistics</Text>
            
            <View className="space-y-4">
              <StatRow
                icon="speedometer-outline"
                label="Current Speed"
                value={formatSpeed(currentSpeed)}
              />
              <StatRow
                icon="speedometer"
                label="Average Speed"
                value={formatSpeed(avgSpeed)}
              />
              <StatRow
                icon="time-outline"
                label="Average Pace"
                value={formatPace(avgSpeed)}
              />
              <StatRow
                icon="flame-outline"
                label="Calories"
                value={formatCalories(calories)}
              />
              <StatRow
                icon="location-outline"
                label="GPS Points"
                value={path.length.toString()}
              />
            </View>
          </View>

          {/* Status Indicator */}
          {isRecording && (
            <View className="bg-gray-800 rounded-3xl p-4 mb-6 flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-3" />
              <Text className="text-white">
                {isPaused ? 'Recording Paused' : 'Recording Active'}
              </Text>
            </View>
          )}

          <View className="h-20" />
        </ScrollView>
      ) : (
        // History Tab
        <ScrollView className="flex-1 px-4">
          {isLoading ? (
            <LoadingSpinner message="Loading activities..." />
          ) : !activities || activities.length === 0 ? (
            <EmptyState
              icon="fitness-outline"
              title="No Activities Yet"
              message="Start recording your first hiking activity!"
            />
          ) : (
            <View className="py-4">
              <Text className="text-gray-400 mb-4">
                {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
              </Text>
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onPress={(act) => {
                    // TODO: Navigate to activity details
                    console.log('View activity:', act.id);
                  }}
                />
              ))}
            </View>
          )}
          <View className="h-20" />
        </ScrollView>
      )}
    </SafeScreen>
  );
}

function StatRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center">
        <Ionicons name={icon} size={20} color="#9CA3AF" />
        <Text className="text-gray-400 ml-3">{label}</Text>
      </View>
      <Text className="text-white font-semibold">{value}</Text>
    </View>
  );
}