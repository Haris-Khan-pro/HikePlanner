import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SafeScreen from "../components/SafeScreen";
import TrailCard from "../components/TrailCard";
import { useTrails, useSaveTrail, useUnsaveTrail } from "../hooks/useTrails";
import { Trail } from "../types";

const TRENDING_LOCATIONS = [
  { name: "Skardu", emoji: "🏔️", posts: 142, rating: 4.8 },
  { name: "Hunza", emoji: "🌄", posts: 118, rating: 4.7 },
  { name: "Nathiagali", emoji: "🌲", posts: 94, rating: 4.5 },
  { name: "Swat", emoji: "💧", posts: 87, rating: 4.4 },
  { name: "Chitral", emoji: "🦅", posts: 63, rating: 4.3 },
  { name: "Fairy Meadows", emoji: "🌸", posts: 55, rating: 4.9 },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "featured", label: "⭐ Featured" },
  { key: "popular", label: "🔥 Popular" },
  { key: "easy", label: "🟢 Easy" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function RecommendationsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const {
    data: allTrails = [],
    isLoading,
    refetch,
    isRefetching,
  } = useTrails({
    featured: activeFilter === "featured" ? true : undefined,
    popular: activeFilter === "popular" ? true : undefined,
    difficulty: activeFilter === "easy" ? "Easy" : undefined,
  } as any);

  const saveTrail = useSaveTrail();
  const unsaveTrail = useUnsaveTrail();

  const handleToggleSave = (trailId: string) => {
    const trail = allTrails.find((t) => t.id === trailId);
    if (!trail) return;
    if (trail.isSaved) {
      unsaveTrail.mutate(trailId);
    } else {
      saveTrail.mutate(trailId);
    }
  };

  const filteredTrails = allTrails.filter((t) => {
    if (activeFilter === "featured") return t.isFeatured;
    if (activeFilter === "popular") return t.isPopular;
    if (activeFilter === "easy") return t.difficulty === "Easy";
    return true;
  });

  const handleTrailPress = (trail: Trail) => {
    router.push({ pathname: "/trail/[id]", params: { id: trail.id } });
  };

  return (
    <SafeScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View className="px-4 pt-4 pb-2 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text className="text-3xl font-bold text-white">For You ✨</Text>
            <Text className="mt-1 text-white">AI-powered trail picks</Text>
          </View>
        </View>

        <View className="mt-4 mb-2">
          <Text className="text-base font-bold text-white px-4 mb-3">
            🔥 Trending Locations
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {TRENDING_LOCATIONS.map((loc) => (
              <View
                key={loc.name}
                className="bg-white/10 rounded-2xl px-4 py-3 items-center"
                style={{ minWidth: 100 }}
              >
                <Text className="text-2xl mb-1">{loc.emoji}</Text>
                <Text className="text-white font-semibold text-sm">{loc.name}</Text>
                <Text className="text-white/70 text-xs mt-1">
                  {loc.rating} ★ · {loc.posts} posts
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mt-4 mb-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-full border ${
                  activeFilter === f.key
                    ? "bg-white border-white"
                    : "bg-transparent border-white/40"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    activeFilter === f.key ? "text-green-800" : "text-white"
                  }`}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-4 py-3">
          {isLoading ? (
            <Text className="text-sm text-white/60">Loading recommendations...</Text>
          ) : (
            <Text className="text-sm text-white/80">
              {filteredTrails.length}{" "}
              {filteredTrails.length === 1 ? "trail" : "trails"} recommended
            </Text>
          )}
        </View>

        {filteredTrails.length > 0 ? (
          filteredTrails.map((trail) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              onPress={handleTrailPress}
              onToggleSave={handleToggleSave}
            />
          ))
        ) : (
          <View className="px-4 py-12 items-center">
            <Ionicons name="sad-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-white mb-2 mt-4">
              No trails found
            </Text>
            <Text className="text-white/70 text-center">
              Try a different filter
            </Text>
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </SafeScreen>
  );
}