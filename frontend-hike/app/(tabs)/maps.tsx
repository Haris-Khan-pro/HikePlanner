import LocationService from "@/services/locationService";
import { MapLayerType, Waypoint } from "@/types/map";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapsScreen() {
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [mapType, setMapType] = useState<MapLayerType>("standard");
  const [isTracking, setIsTracking] = useState(false);
  const [userPath, setUserPath] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [showControls, setShowControls] = useState(true);
  const [permissionAsked, setPermissionAsked] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Sample hiking data
  const [hikes] = useState([
    {
      id: "1",
      name: "Mountain Trail",
      difficulty: "Hard",
      distance: 4.11,
      image: "https://via.placeholder.com/300x200?text=Mountain+Trail",
      rating: 5.0,
      reviews: 25,
    },
    {
      id: "2",
      name: "Forest Path",
      difficulty: "Easy",
      distance: 2.5,
      image: "https://via.placeholder.com/300x200?text=Forest+Path",
      rating: 4.8,
      reviews: 18,
    },
    {
      id: "3",
      name: "Valley Walk",
      difficulty: "Moderate",
      distance: 3.8,
      image: "https://via.placeholder.com/300x200?text=Valley+Walk",
      rating: 4.6,
      reviews: 32,
    },
  ]);

  useEffect(() => {
    initializeLocation();
    return () => {
      LocationService.stopTracking();
    };
  }, []);

  const initializeLocation = async () => {
    if (permissionAsked) {
      return;
    }
    setPermissionAsked(true);
    const hasPermission = await LocationService.requestPermissions();

    if (!hasPermission) {
      Alert.alert(
        "Location Permission",
        "Please enable location permissions in settings to use the map features.",
      );
      return;
    }

    const currentLocation = await LocationService.getCurrentLocation();
    if (currentLocation) {
      const locationObj: Location.LocationObject = {
        coords: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          altitude: currentLocation.elevation || null,
          accuracy: currentLocation.accuracy || null,
          altitudeAccuracy: null,
          heading: null,
          speed: currentLocation.speed || null,
        },
        timestamp: currentLocation.timestamp.getTime(),
      };
      setLocation(locationObj);

      // Center map on user location
      mapRef.current?.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const toggleTracking = async () => {
    if (isTracking) {
      LocationService.stopTracking();
      setIsTracking(false);
    } else {
      await LocationService.startTracking();
      LocationService.addListener(handleLocationUpdate);
      setIsTracking(true);
    }
  };

  const handleLocationUpdate = (newLocation: any) => {
    setUserPath((prev) => [
      ...prev,
      {
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      },
    ]);
  };

  const addWaypoint = () => {
    if (!location) return;

    const newWaypoint: Waypoint = {
      id: Date.now().toString(),
      coordinate: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      title: `Waypoint ${waypoints.length + 1}`,
      timestamp: new Date(),
      elevation: location.coords.altitude || undefined,
    };

    setWaypoints([...waypoints, newWaypoint]);
    Alert.alert(
      "Waypoint Added",
      "A new waypoint has been added at your current location.",
    );
  };

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  };

  const cycleMapType = () => {
    const types: MapLayerType[] = [
      "standard",
      "satellite",
      "terrain",
      "hybrid",
    ];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  };

  const getMapType = () => {
    switch (mapType) {
      case "satellite":
        return "satellite";
      case "terrain":
        return "terrain";
      case "hybrid":
        return "hybrid";
      default:
        return "standard";
    }
  };

  const clearPath = () => {
    Alert.alert(
      "Clear Path",
      "Are you sure you want to clear the tracked path?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => setUserPath([]),
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Map */}
      <View className="flex-1">
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          mapType={getMapType()}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          initialRegion={{
            latitude: 33.5651,
            longitude: 73.0169,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* User's tracked path */}
          {userPath.length > 1 && (
            <Polyline
              coordinates={userPath}
              strokeColor="#2ECC71"
              strokeWidth={4}
            />
          )}

          {/* Waypoints */}
          {waypoints.map((waypoint) => (
            <Marker
              key={waypoint.id}
              coordinate={waypoint.coordinate}
              title={waypoint.title}
              description={waypoint.description}
              pinColor="#F39C12"
            />
          ))}
        </MapView>

        {/* Top Controls */}
        {showControls && (
          <View className="absolute top-4 left-4 right-4 flex-row justify-between">
            {/* Layer Toggle */}
            <TouchableOpacity
              className="bg-white rounded-xl p-3 shadow-lg"
              onPress={() => setShowMapModal(true)}
            >
              <Ionicons name="layers" size={24} color="#000" />
            </TouchableOpacity>

            {/* Map Type Label */}
            <View className="bg-white rounded-xl px-4 py-3 shadow-lg">
              <Text className="font-semibold text-gray-800 capitalize">
                {mapType}
              </Text>
            </View>
          </View>
        )}

        {/* Right Side Controls */}
        {showControls && (
          <View className="absolute right-4 top-24 gap-3">
            {/* Center on User */}
            <TouchableOpacity
              className="bg-white rounded-xl p-3 shadow-lg"
              onPress={centerOnUser}
            >
              <Ionicons name="navigate" size={24} color="#2ECC71" />
            </TouchableOpacity>

            {/* Add Waypoint */}
            <TouchableOpacity
              className="bg-white rounded-xl p-3 shadow-lg"
              onPress={addWaypoint}
            >
              <Ionicons name="location" size={24} color="#F39C12" />
            </TouchableOpacity>

            {/* Toggle Controls */}
            <TouchableOpacity
              className="bg-white rounded-xl p-3 shadow-lg"
              onPress={() => setShowControls(!showControls)}
            >
              <Ionicons name="eye-off" size={24} color="#6A6A6A" />
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Controls */}
        {showControls && (
          <View className="absolute bottom-6 left-4 right-4">
            <View className="bg-white rounded-2xl p-4 shadow-lg">
              <View className="flex-row justify-between items-center">
                {/* Tracking Toggle */}
                <TouchableOpacity
                  className={`flex-1 mr-2 py-3 rounded-xl ${
                    isTracking ? "bg-red-500" : "bg-primary"
                  }`}
                  onPress={toggleTracking}
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons
                      name={isTracking ? "stop-circle" : "play-circle"}
                      size={24}
                      color="#FFFFFF"
                    />
                    <Text className="text-white font-semibold ml-2">
                      {isTracking ? "Stop Tracking" : "Start Tracking"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Clear Path */}
                {userPath.length > 0 && (
                  <TouchableOpacity
                    className="bg-gray-200 p-3 rounded-xl"
                    onPress={clearPath}
                  >
                    <Ionicons name="trash" size={24} color="#E74C3C" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Stats */}
              {userPath.length > 1 && (
                <View className="mt-3 pt-3 border-t border-gray-200 flex-row justify-around">
                  <View className="items-center">
                    <Text className="text-gray-500 text-xs">Points</Text>
                    <Text className="text-gray-800 font-bold text-lg">
                      {userPath.length}
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-gray-500 text-xs">Waypoints</Text>
                    <Text className="text-gray-800 font-bold text-lg">
                      {waypoints.length}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
        {/* Show Controls Button (when hidden) */}
        {!showControls && (
          <TouchableOpacity
            className="absolute bottom-40 right-6 bg-white rounded-full p-4 shadow-lg"
            onPress={() => setShowControls(true)}
          >
            <Ionicons name="eye" size={24} color="#2ECC71" />
          </TouchableOpacity>
        )}

        {/* Map Layer Modal */}
        <Modal
          visible={showMapModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMapModal(false)}
        >
          <View className="flex-1 bg-black/50">
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-900">Map</Text>
                <TouchableOpacity onPress={() => setShowMapModal(false)}>
                  <Ionicons name="close" size={24} color="#111827" />
                </TouchableOpacity>
              </View>

              {/* Map Options */}
              <TouchableOpacity
                onPress={() => {
                  setMapType("standard");
                  setShowMapModal(false);
                }}
                className={`p-4 rounded-xl mb-3 flex-row items-center ${
                  mapType === "standard"
                    ? "bg-gray-100 border-2 border-green-600"
                    : "bg-gray-50"
                }`}
              >
                <View className="w-12 h-12 rounded-lg bg-blue-100 items-center justify-center mr-3">
                  <Ionicons name="map" size={24} color="#3B82F6" />
                </View>
                <Text className="font-semibold text-gray-900">Default</Text>
                {mapType === "standard" && (
                  <View className="ml-auto">
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#059669"
                    />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMapType("satellite");
                  setShowMapModal(false);
                }}
                className={`p-4 rounded-xl mb-3 flex-row items-center ${
                  mapType === "satellite"
                    ? "bg-gray-100 border-2 border-green-600"
                    : "bg-gray-50"
                }`}
              >
                <Image
                  source={{ uri: "https://via.placeholder.com/48?text=SAT" }}
                  className="w-12 h-12 rounded-lg mr-3"
                />
                <Text className="font-semibold text-gray-900">Satellite</Text>
                {mapType === "satellite" && (
                  <View className="ml-auto">
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#059669"
                    />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMapType("terrain");
                  setShowMapModal(false);
                }}
                className={`p-4 rounded-xl mb-3 flex-row items-center ${
                  mapType === "terrain"
                    ? "bg-gray-100 border-2 border-green-600"
                    : "bg-gray-50"
                }`}
              >
                <View className="w-12 h-12 rounded-lg bg-yellow-100 items-center justify-center mr-3">
                  <Ionicons name="layers-outline" size={24} color="#EAB308" />
                </View>
                <Text className="font-semibold text-gray-900">Terrain</Text>
                {mapType === "terrain" && (
                  <View className="ml-auto">
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#059669"
                    />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMapType("hybrid");
                  setShowMapModal(false);
                }}
                className={`p-4 rounded-xl mb-6 flex-row items-center ${
                  mapType === "hybrid"
                    ? "bg-gray-100 border-2 border-green-600"
                    : "bg-gray-50"
                }`}
              >
                <View className="w-12 h-12 rounded-lg bg-purple-100 items-center justify-center mr-3">
                  <Ionicons name="git-merge" size={24} color="#A855F7" />
                </View>
                <Text className="font-semibold text-gray-900">Hybrid</Text>
                {mapType === "hybrid" && (
                  <View className="ml-auto">
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#059669"
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Hiking Cards Section */}
        <View
          className="absolute bottom-0 left-0 right-0 h-1/3 bg-white rounded-t-3xl"
          pointerEvents="box-none"
        >
          <View className="px-4 pt-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              {hikes.length} hikes
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingBottom: 20 }}
            scrollEnabled={true}
            pointerEvents="box-none"
          >
            {hikes.map((hike) => (
              <TouchableOpacity
                key={hike.id}
                onPress={() =>
                  router.push({
                    pathname: "/trail/trail-details",
                    params: {
                      id: hike.id,
                      name: hike.name,
                      difficulty: hike.difficulty,
                      rating: hike.rating,
                      reviews: hike.reviews,
                    },
                  })
                }
                className="rounded-2xl overflow-hidden bg-white mb-4 shadow-lg"
                activeOpacity={0.8}
              >
                <View className="relative">
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
                    }}
                    className="w-full h-40"
                  />
                  {/* Difficulty Badge */}
                  <View
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full ${
                      hike.difficulty === "Hard"
                        ? "bg-red-500"
                        : hike.difficulty === "Moderate"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  >
                    <Text className="text-white text-xs font-bold">
                      {hike.difficulty}
                    </Text>
                  </View>

                  {/* Distance */}
                  <View className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-full">
                    <Text className="text-white text-sm font-semibold">
                      {hike.distance} km
                    </Text>
                  </View>

                  {/* Mini Map Icon */}
                  <View className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-lg border-2 border-green-600 items-center justify-center">
                    <Ionicons name="map" size={20} color="#16a34a" />
                  </View>
                </View>

                {/* Card Info */}
                <View className="p-3">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text className="text-gray-800 font-bold ml-1 text-sm">
                      {hike.rating}
                    </Text>
                    <Text className="text-gray-500 text-xs ml-1">
                      ({hike.reviews})
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-xs">
                    Mount of Forest Peak from Trail 2 Loop
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
