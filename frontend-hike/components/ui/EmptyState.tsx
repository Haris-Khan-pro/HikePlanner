// components/ui/EmptyState.tsx
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

export default function EmptyState({ 
  icon = 'information-circle-outline', 
  title, 
  message 
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name={icon} size={80} color="#4B5563" />
      <Text className="text-xl font-bold text-gray-300 mt-6 mb-2">
        {title}
      </Text>
      <Text className="text-gray-400 text-center">
        {message}
      </Text>
    </View>
  );
}