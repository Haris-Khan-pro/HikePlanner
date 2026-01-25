import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Trail } from '../types';

interface TrailCardProps {
  trail: Trail;
  onPress: (trail: Trail) => void;
  onToggleSave: (trailId: string) => void;
}

export default function TrailCard({ trail, onPress, onToggleSave }: TrailCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-orange-100 text-orange-800';
      case 'Expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(trail)}
      className="bg-white rounded-2xl mx-4 mb-4 shadow-md overflow-hidden"
      activeOpacity={0.7}
    >
      {/* Image Section */}
      <View className="relative">
        <Image
          source={{ uri: trail.image }}
          className="w-full h-48"
          resizeMode="cover"
        />
        
        {/* Featured Badge */}
        {trail.isFeatured && (
          <View className="absolute top-3 left-3 bg-yellow-400 px-3 py-1 rounded-full">
            <Text className="text-yellow-900 font-semibold text-xs">⭐ Featured</Text>
          </View>
        )}
        
        {/* Save Button */}
        <TouchableOpacity
          onPress={() => onToggleSave(trail.id)}
          className="absolute top-3 right-3 bg-white/90 w-10 h-10 rounded-full items-center justify-center"
        >
          <Text className="text-xl">{trail.isSaved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {/* Difficulty Badge */}
        <View className={`absolute bottom-3 right-3 px-3 py-1 rounded-full ${getDifficultyColor(trail.difficulty)}`}>
          <Text className="font-semibold text-xs">{trail.difficulty}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-900 mb-1">{trail.name}</Text>
        <Text className="text-sm text-gray-600 mb-3">📍 {trail.location}</Text>

        {/* Stats Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-700 mr-4">🥾 {trail.distance} km</Text>
            <Text className="text-sm text-gray-700 mr-4">⏱️ {formatDuration(trail.duration)}</Text>
            <Text className="text-sm text-gray-700">⛰️ {trail.elevation}m</Text>
          </View>
        </View>

        {/* Rating Row */}
        <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
          <View className="flex-row items-center flex-1">
            <Text className="text-yellow-500 text-base mr-1">⭐</Text>
            <Text className="text-sm font-semibold text-gray-900">{trail.rating}</Text>
            <Text className="text-sm text-gray-500 ml-1">({trail.reviews} reviews)</Text>
          </View>
          
          {trail.isPopular && (
            <View className="bg-red-50 px-2 py-1 rounded-full">
              <Text className="text-red-600 text-xs font-semibold">🔥 Popular</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}