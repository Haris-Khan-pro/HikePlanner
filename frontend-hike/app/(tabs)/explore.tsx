import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CategorySection from "../../components/CategorySection";
import FilterChips from "../../components/FilterChips";
import SafeScreen from "../../components/SafeScreen";
import SearchBar from "../../components/SearchBar";
import TrailCard from "../../components/TrailCard";
import ChatWidget from "../../components/chat/ChatWidget";
import { categories, mockTrails, Trail } from "../../types";

// ---------------------------------------------------------------------------
// Pakistan keyword list — used to detect if a search is Pakistan-relevant.
// If the query contains NONE of these words and returns 0 results,
// we show the "not in our Pakistan database" message instead of a plain empty state.
// ---------------------------------------------------------------------------
const PAKISTAN_KEYWORDS = [
  "pakistan", "gilgit", "baltistan", "skardu", "hunza", "nathiagali",
  "islamabad", "fairy meadows", "fairy", "meadows", "k2", "nanga parbat",
  "nanga", "parbat", "swat", "chitral", "naltar", "kumrat", "concordia",
  "karakoram", "himalaya", "himalayas", "hindukush", "khyber", "kpk",
  "punjab", "balochistan", "murree", "abbottabad", "pir sohawa", "margalla",
  "rawal", "ayubia", "kund malir", "gondogoro", "hispar", "biafo", "hushe",
  "diamer", "dir", "kohistan", "kaghan", "shogran", "neelum", "deosai",
  "ratti", "gali", "chitta", "katha", "makra", "azad", "kashmir",
  "trek", "trail", "hike", "peak", "base camp", "valley", "glacier",
  "pass", "lake", "forest", "meadow", "mountain", "summit",
];

function isPakistanRelevantSearch(query: string): boolean {
  if (query.trim().length < 3) return true; // too short to judge — don't flag it
  const lower = query.toLowerCase();
  return PAKISTAN_KEYWORDS.some((kw) => lower.includes(kw));
}

// Quick-tap suggestions shown when a non-Pakistani location is searched
const PAKISTAN_SUGGESTIONS = [
  "Fairy Meadows",
  "Skardu",
  "Naltar Valley",
  "Nanga Parbat",
  "Deosai Plains",
  "Neelum Valley",
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [trails, setTrails] = useState<Trail[]>(mockTrails);
  const [refreshing, setRefreshing] = useState(false);

  const filteredTrails = useMemo(() => {
    return trails.filter((trail) => {
      const matchesSearch =
        trail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trail.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trail.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesDifficulty =
        selectedDifficulty === "All" || trail.difficulty === selectedDifficulty;

      let matchesCategory = true;
      if (selectedCategory === "2") {
        matchesCategory = trail.isFeatured;
      } else if (selectedCategory === "3") {
        matchesCategory = trail.isPopular;
      } else if (selectedCategory === "5") {
        matchesCategory = trail.isSaved;
      }

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [trails, searchQuery, selectedDifficulty, selectedCategory]);

  // True when: user typed something meaningful + no results + query looks non-Pakistani
  const isNonPakistaniSearch =
    searchQuery.trim().length >= 3 &&
    filteredTrails.length === 0 &&
    !isPakistanRelevantSearch(searchQuery);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleTrailPress = (trail: Trail) => {
    router.push({
      pathname: "/trail/[id]",
      params: { id: trail.id },
    });
  };

  const handleToggleSave = (trailId: string) => {
    setTrails((prevTrails) =>
      prevTrails.map((trail) =>
        trail.id === trailId ? { ...trail, isSaved: !trail.isSaved } : trail,
      ),
    );
  };

  return (
    <SafeScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-white">Explore Trails</Text>
            <Text className="mt-1 text-white">Discover your next adventure</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/recommendations")}
            className="bg-white/20 px-3 py-2 rounded-full flex-row items-center"
          >
            <Ionicons name="sparkles-outline" size={14} color="#fff" />
            <Text className="text-white text-xs font-semibold ml-1">For You</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Pakistani trails, locations..."
        />

        {/* Categories */}
        <CategorySection
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Filter Chips */}
        <FilterChips
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
        />

        {/* Results Count */}
        <View className="px-4 py-3">
          <Text className="text-sm text-gray-600">
            {filteredTrails.length}{" "}
            {filteredTrails.length === 1 ? "trail" : "trails"} found
          </Text>
        </View>

        {/* Trail Cards / Empty States */}
        {filteredTrails.length > 0 ? (
          filteredTrails.map((trail) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              onPress={handleTrailPress}
              onToggleSave={handleToggleSave}
            />
          ))
        ) : isNonPakistaniSearch ? (
          // ── Non-Pakistani location searched ──────────────────────────────
          <View className="px-4 py-10 items-center">
            <View className="bg-white/10 rounded-full p-5 mb-4">
              <Ionicons name="location-outline" size={52} color="#4ADE80" />
            </View>

            <Text className="text-xl font-bold text-white mb-2 text-center">
              Not in our Pakistan database
            </Text>
            <Text className="text-white/70 text-center text-sm leading-5 mb-6">
              HikePlanner covers hiking trails across Pakistan only.{"\n"}
              Try searching for one of these:
            </Text>

            {/* Suggestion chips */}
            <View className="flex-row flex-wrap justify-center gap-2">
              {PAKISTAN_SUGGESTIONS.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  onPress={() => setSearchQuery(suggestion)}
                  className="bg-green-600 px-4 py-2 rounded-full mb-2"
                  activeOpacity={0.75}
                >
                  <Text className="text-white text-sm font-semibold">
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Clear search */}
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="mt-6 flex-row items-center"
            >
              <Ionicons name="close-circle-outline" size={18} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-1">Clear search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // ── Generic empty state (filters returned nothing) ────────────────
          <View className="px-4 py-12 items-center">
            <Ionicons name="sad-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mb-2 mt-4">
              No trails found
            </Text>
            <Text className="text-gray-600 text-center">
              Try adjusting your filters or search query
            </Text>
          </View>
        )}

        {/* Bottom Padding */}
        <View className="h-6" />
      </ScrollView>

      {/* Chat Widget */}
      <ChatWidget />
    </SafeScreen>
  );
}
