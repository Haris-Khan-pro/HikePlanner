// components/activity/ActivityChart.tsx
import { View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActivityPoint {
  latitude: number;
  longitude: number;
  elevation?: number;
}

interface Activity {
  id: string;
  trailName?: string;
  distance: number;
  elevationGain: number;
  path: ActivityPoint[];
}

interface ActivityChartProps {
  activity: Activity;
  type?: 'elevation' | 'speed' | 'pace';
}

export default function ActivityChart({ activity, type = 'elevation' }: ActivityChartProps) {
  const screenWidth = Dimensions.get('window').width - 32;

  const renderElevationChart = () => {
    const pathPoints = activity.path.filter(p => p.elevation !== undefined && p.elevation !== null);
    
    if (pathPoints.length === 0) {
      return (
        <View className="bg-gray-800 rounded-2xl p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-lg font-bold">Elevation Profile</Text>
            <Ionicons name="trending-up" size={20} color="#22c55e" />
          </View>
          <View className="items-center justify-center h-40 bg-gray-700/50 rounded-xl">
            <Ionicons name="analytics-outline" size={48} color="#4B5563" />
            <Text className="text-gray-400 mt-4">No elevation data available</Text>
            <Text className="text-gray-500 text-sm mt-2">
              GPS did not record elevation for this activity
            </Text>
          </View>
        </View>
      );
    }

    // Find min/max elevation for scaling
    const elevations = pathPoints.map(p => p.elevation as number);
    const minElevation = Math.min(...elevations);
    const maxElevation = Math.max(...elevations);
    const range = maxElevation - minElevation;

    // Create simple ASCII-style elevation visualization
    const chartHeight = 120;
    const pointWidth = Math.max(2, screenWidth / pathPoints.length);
    const chartData = pathPoints.map((point) => {
      const elevation = point.elevation as number;
      const normalized = range > 0 ? (elevation - minElevation) / range : 0.5;
      return normalized * chartHeight;
    });

    return (
      <View className="bg-gray-800 rounded-2xl p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-lg font-bold">Elevation Profile</Text>
          <Ionicons name="trending-up" size={20} color="#22c55e" />
        </View>
        
        {/* Simple visualization using View heights */}
        <View className="h-32 bg-gray-700/50 rounded-xl overflow-hidden mb-4 relative">
          <View className="flex-row items-end h-full px-2">
            {chartData.map((height, index) => (
              <View
                key={index}
                style={{
                  width: pointWidth,
                  height: Math.max(height, 2),
                  backgroundColor: '#22c55e',
                  marginRight: 1,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  opacity: 0.8,
                }}
              />
            ))}
          </View>
          
          {/* Overlay stats */}
          <View className="absolute top-2 left-2 bg-gray-900/80 rounded-lg px-3 py-2">
            <Text className="text-white text-xs font-semibold">
              Range: {range.toFixed(0)}m
            </Text>
          </View>
        </View>

        {/* Stats below chart */}
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="arrow-down" size={12} color="#6B7280" />
              <Text className="text-gray-400 text-xs ml-1">Min</Text>
            </View>
            <Text className="text-white font-bold text-base">{minElevation.toFixed(0)}m</Text>
          </View>
          
          <View className="items-center flex-1 border-l border-r border-gray-700">
            <View className="flex-row items-center mb-1">
              <Ionicons name="arrow-up" size={12} color="#6B7280" />
              <Text className="text-gray-400 text-xs ml-1">Max</Text>
            </View>
            <Text className="text-white font-bold text-base">{maxElevation.toFixed(0)}m</Text>
          </View>
          
          <View className="items-center flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="trending-up" size={12} color="#22c55e" />
              <Text className="text-gray-400 text-xs ml-1">Gain</Text>
            </View>
            <Text className="text-green-500 font-bold text-base">
              {activity.elevationGain.toFixed(0)}m
            </Text>
          </View>
        </View>

        {/* Info footer */}
        <View className="mt-4 pt-4 border-t border-gray-700">
          <Text className="text-gray-500 text-xs text-center">
            {pathPoints.length} elevation points recorded
          </Text>
        </View>
      </View>
    );
  };

  // Speed and pace charts could be added here
  const renderSpeedChart = () => {
    return (
      <View className="bg-gray-800 rounded-2xl p-4">
        <Text className="text-white text-lg font-bold mb-4">Speed Profile</Text>
        <View className="items-center justify-center h-40 bg-gray-700/50 rounded-xl">
          <Ionicons name="speedometer-outline" size={48} color="#4B5563" />
          <Text className="text-gray-400 mt-4">Speed chart coming soon</Text>
        </View>
      </View>
    );
  };

  const renderPaceChart = () => {
    return (
      <View className="bg-gray-800 rounded-2xl p-4">
        <Text className="text-white text-lg font-bold mb-4">Pace Profile</Text>
        <View className="items-center justify-center h-40 bg-gray-700/50 rounded-xl">
          <Ionicons name="timer-outline" size={48} color="#4B5563" />
          <Text className="text-gray-400 mt-4">Pace chart coming soon</Text>
        </View>
      </View>
    );
  };

  switch (type) {
    case 'elevation':
      return renderElevationChart();
    case 'speed':
      return renderSpeedChart();
    case 'pace':
      return renderPaceChart();
    default:
      return renderElevationChart();
  }
}