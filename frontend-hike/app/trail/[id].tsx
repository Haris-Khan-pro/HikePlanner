import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mockTrails } from '../../types';

const { width } = Dimensions.get('window');

export default function TrailDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const trail = mockTrails.find(t => t.id === id);
  
  const [isSaved, setIsSaved] = useState(trail?.isSaved || false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'reviews'>('overview');

  if (!trail) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="alert-circle" size={64} color="#9CA3AF" />
        <Text className="text-xl font-semibold text-gray-900 mt-4">Trail not found</Text>
      </View>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative">
          <Image
            source={{ uri: trail.image }}
            className="w-full h-80"
            resizeMode="cover"
          />
          
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-4 bg-white/90 w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            onPress={() => setIsSaved(!isSaved)}
            className="absolute top-12 right-4 bg-white/90 w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons 
              name={isSaved ? "heart" : "heart-outline"} 
              size={24} 
              color={isSaved ? "#dc2626" : "#4B5563"} 
            />
          </TouchableOpacity>

          {/* Featured Badge */}
          {trail.isFeatured && (
            <View className="absolute top-12 left-20 bg-yellow-400 px-3 py-1 rounded-full flex-row items-center">
              <Ionicons name="star" size={14} color="#78350f" />
              <Text className="text-yellow-900 font-semibold text-xs ml-1">Featured</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View className="bg-white rounded-t-3xl -mt-6 pt-6">
          {/* Title Section */}
          <View className="px-5 pb-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-2">
              <View className={`px-3 py-1 rounded-full border ${getDifficultyColor(trail.difficulty)}`}>
                <Text className="font-semibold text-xs">{trail.difficulty}</Text>
              </View>
              {trail.isPopular && (
                <View className="bg-red-50 px-3 py-1 rounded-full flex-row items-center">
                  <Ionicons name="flame" size={14} color="#dc2626" />
                  <Text className="text-red-600 text-xs font-semibold ml-1">Popular</Text>
                </View>
              )}
            </View>
            
            <Text className="text-3xl font-bold text-gray-900 mb-2">{trail.name}</Text>
            
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{trail.location}</Text>
            </View>

            {/* Rating */}
            <View className="flex-row items-center mt-3">
              <Ionicons name="star" size={20} color="#EAB308" />
              <Text className="text-xl font-bold text-gray-900 ml-1">{trail.rating}</Text>
              <Text className="text-gray-600 ml-2">({trail.reviews} reviews)</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View className="px-5 py-5 border-b border-gray-100">
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Ionicons name="walk" size={28} color="#16a34a" />
                <Text className="text-2xl font-bold text-gray-900 mt-2">{trail.distance} km</Text>
                <Text className="text-sm text-gray-600 mt-1">Distance</Text>
              </View>
              <View className="items-center flex-1">
                <Ionicons name="time-outline" size={28} color="#16a34a" />
                <Text className="text-2xl font-bold text-gray-900 mt-2">{formatDuration(trail.duration)}</Text>
                <Text className="text-sm text-gray-600 mt-1">Duration</Text>
              </View>
              <View className="items-center flex-1">
                <Ionicons name="trending-up" size={28} color="#16a34a" />
                <Text className="text-2xl font-bold text-gray-900 mt-2">{trail.elevation}m</Text>
                <Text className="text-sm text-gray-600 mt-1">Elevation</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="px-5 py-3 border-b border-gray-100">
            <View className="flex-row bg-gray-100 rounded-xl p-1">
              <TouchableOpacity
                onPress={() => setSelectedTab('overview')}
                className={`flex-1 py-2 rounded-lg ${
                  selectedTab === 'overview' ? 'bg-white shadow-sm' : ''
                }`}
              >
                <Text className={`text-center font-semibold ${
                  selectedTab === 'overview' ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  Overview
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedTab('reviews')}
                className={`flex-1 py-2 rounded-lg ${
                  selectedTab === 'reviews' ? 'bg-white shadow-sm' : ''
                }`}
              >
                <Text className={`text-center font-semibold ${
                  selectedTab === 'reviews' ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  Reviews
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Content */}
          {selectedTab === 'overview' ? (
            <View className="px-5 py-5">
              {/* Description */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-3">About this trail</Text>
                <Text className="text-gray-700 leading-6">{trail.description}</Text>
              </View>

              {/* Tags */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-3">Trail Features</Text>
                <View className="flex-row flex-wrap">
                  {trail.tags.map((tag, index) => (
                    <View key={index} className="bg-green-50 px-3 py-2 rounded-full mr-2 mb-2 flex-row items-center">
                      <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                      <Text className="text-green-800 font-medium text-sm ml-1">{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Trail Conditions */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-3">Trail Conditions</Text>
                <View className="bg-gray-50 rounded-xl p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <Ionicons name="partly-sunny" size={20} color="#F59E0B" />
                      <Text className="text-gray-700 ml-2">Weather</Text>
                    </View>
                    <Text className="font-semibold text-gray-900">Sunny, 22°C</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="trail-sign" size={20} color="#16a34a" />
                      <Text className="text-gray-700 ml-2">Trail Status</Text>
                    </View>
                    <Text className="font-semibold text-green-600">Open</Text>
                  </View>
                </View>
              </View>

              {/* Location Map Placeholder */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-3">Location</Text>
                <View className="bg-gray-200 rounded-xl h-48 items-center justify-center">
                  <Ionicons name="map" size={48} color="#9CA3AF" />
                  <Text className="text-gray-600 mt-2">Map view coming soon</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className="px-5 py-5">
              {/* Reviews List */}
              {[1, 2, 3].map((review) => (
                <View key={review} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                      <Ionicons name="person" size={20} color="#16a34a" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="font-semibold text-gray-900">Hiker #{review}</Text>
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={14} color="#EAB308" />
                        <Text className="text-sm text-gray-600 ml-1">4.5</Text>
                        <Text className="text-sm text-gray-500 ml-2">2 days ago</Text>
                      </View>
                    </View>
                  </View>
                  <Text className="text-gray-700 leading-5">
                    Great trail with amazing views! The elevation gain is challenging but worth it. 
                    Highly recommend starting early in the morning.
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Bottom Padding */}
          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
        <View className="flex-row space-x-3">
          <TouchableOpacity className="flex-1 bg-green-600 rounded-xl py-4 flex-row items-center justify-center">
            <Ionicons name="play-circle" size={24} color="#ffffff" />
            <Text className="text-white font-bold text-lg ml-2">Start Hike</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-100 rounded-xl px-5 py-4 items-center justify-center">
            <Ionicons name="share-social" size={24} color="#16a34a" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}