// app/(tabs)/record.tsx
import { Text, View } from 'react-native';
import SafeScreen from '../../components/SafeScreen';

export default function RecordScreen() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-6xl mb-4">📊</Text>
        <Text className="text-2xl font-bold text-gray-900 mb-2">Activity</Text>
        <Text className="text-gray-600 text-center">
          Track your hiking activities
        </Text>
      </View>
    </SafeScreen>
  );
}