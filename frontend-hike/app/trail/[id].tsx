import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { mockTrails } from '../../types';
import { useReviews, useCreateReview } from '@/hooks/useReviews';

const { width } = Dimensions.get('window');

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)} style={{ marginRight: 4 }}>
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={28}
            color="#EAB308"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ReviewCard({ review }: { review: any }) {
  const date = new Date(review.created_at);
  const formatted = date.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return (
    <View className="bg-gray-50 rounded-xl p-4 mb-3">
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
          <Ionicons name="person" size={20} color="#16a34a" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-gray-900">
            {review.username ?? 'Anonymous Hiker'}
          </Text>
          <View className="flex-row items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons
                key={s}
                name={s <= review.rating ? 'star' : 'star-outline'}
                size={13}
                color="#EAB308"
              />
            ))}
            <Text className="text-sm text-gray-500 ml-2">{formatted}</Text>
          </View>
        </View>
      </View>
      {!!review.comment && (
        <Text className="text-gray-700 leading-5">{review.comment}</Text>
      )}
    </View>
  );
}

export default function TrailDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const trail = mockTrails.find((t) => t.id === id);

  const [isSaved, setIsSaved] = useState(trail?.isSaved || false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'reviews'>('overview');

  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(String(id));
  const createReview = useCreateReview(String(id));
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

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
      case 'Easy':     return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard':     return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert':   return 'bg-red-100 text-red-800 border-red-200';
      default:         return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    return `${mins}m`;
  };

  const handleStartHike = () => {
    router.push({
      pathname: '/(tabs)/record',
      params: { trailId: trail.id, trailName: trail.name },
    });
  };

  const handleSubmitReview = async () => {
    if (newRating === 0) {
      Alert.alert('Rating required', 'Please select a star rating before submitting.');
      return;
    }
    try {
      await createReview.mutateAsync({ rating: newRating, comment: newComment.trim() });
      setNewRating(0);
      setNewComment('');
      Alert.alert('Review submitted!', 'Thanks for sharing your experience.');
    } catch {
      Alert.alert('Error', 'Could not submit review. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative">
          <Image source={{ uri: trail.image }} className="w-full h-80" resizeMode="cover" />
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-4 bg-white/90 w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsSaved(!isSaved)}
            className="absolute top-12 right-4 bg-white/90 w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={24}
              color={isSaved ? '#dc2626' : '#4B5563'}
            />
          </TouchableOpacity>
          {trail.isFeatured && (
            <View className="absolute top-12 left-20 bg-yellow-400 px-3 py-1 rounded-full flex-row items-center">
              <Ionicons name="star" size={14} color="#78350f" />
              <Text className="text-yellow-900 font-semibold text-xs ml-1">Featured</Text>
            </View>
          )}
        </View>

        {/* Content Card */}
        <View className="bg-white rounded-t-3xl -mt-6 pt-6">
          {/* Title */}
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
            <View className="flex-row items-center mt-3">
              <Ionicons name="star" size={20} color="#EAB308" />
              <Text className="text-xl font-bold text-gray-900 ml-1">{trail.rating}</Text>
              <Text className="text-gray-600 ml-2">({trail.reviews} reviews)</Text>
            </View>
          </View>

          {/* Stats */}
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
              {(['overview', 'reviews'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setSelectedTab(tab)}
                  className={`flex-1 py-2 rounded-lg ${selectedTab === tab ? 'bg-white shadow-sm' : ''}`}
                >
                  <Text className={`text-center font-semibold capitalize ${selectedTab === tab ? 'text-gray-900' : 'text-gray-600'}`}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Overview Tab */}
          {selectedTab === 'overview' ? (
            <View className="px-5 py-5">
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-3">About this trail</Text>
                <Text className="text-gray-700 leading-6">{trail.description}</Text>
              </View>

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

              {/* Real Map */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-3">Location</Text>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={{ width: '100%', height: 200, borderRadius: 12 }}
                  initialRegion={{
                    latitude: trail.latitude,
                    longitude: trail.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{ latitude: trail.latitude, longitude: trail.longitude }}
                    title={trail.name}
                    description={trail.location}
                  />
                </MapView>
              </View>
            </View>

          ) : (
            /* Reviews Tab */
            <View className="px-5 py-5">
              {reviewsLoading ? (
                <ActivityIndicator color="#16a34a" style={{ marginVertical: 24 }} />
              ) : reviews.length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                  <Ionicons name="chatbubble-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-3 text-center">
                    No reviews yet. Be the first to share your experience!
                  </Text>
                </View>
              ) : (
                reviews.map((review) => <ReviewCard key={review.id} review={review} />)
              )}

              {/* Write a Review Form */}
              <View className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Text className="text-base font-bold text-gray-900 mb-3">Write a Review</Text>

                <Text className="text-sm text-gray-600 mb-2">Your Rating</Text>
                <StarPicker value={newRating} onChange={setNewRating} />

                <Text className="text-sm text-gray-600 mt-4 mb-2">Your Comment (optional)</Text>
                <TextInput
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder="Share your experience on this trail..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  className="bg-white border border-gray-200 rounded-xl p-3 text-gray-900 text-sm"
                  style={{ minHeight: 80, textAlignVertical: 'top' }}
                />

                <TouchableOpacity
                  onPress={handleSubmitReview}
                  disabled={createReview.isPending}
                  className={`mt-4 rounded-xl py-3 flex-row items-center justify-center ${
                    createReview.isPending ? 'bg-green-300' : 'bg-green-600'
                  }`}
                >
                  {createReview.isPending ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="send" size={18} color="#fff" />
                      <Text className="text-white font-bold ml-2">Submit Review</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View className="h-6" />
            </View>
          )}

          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={handleStartHike}
            className="flex-1 bg-green-600 rounded-xl py-4 flex-row items-center justify-center"
          >
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