// components/ui/LoadingSpinner.tsx
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({ message, size = 'large' }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size={size} color="#22c55e" />
      {message && (
        <Text className="text-gray-400 mt-4 text-center">{message}</Text>
      )}
    </View>
  );
}