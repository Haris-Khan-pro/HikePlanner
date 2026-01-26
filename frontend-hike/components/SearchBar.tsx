import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'Search trails...' 
}: SearchBarProps) {
  return (
    <View className="px-4 py-3">
      <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
        <Ionicons name="search" size={20} color="#9CA3AF" className="mr-2" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-gray-900 text-base ml-2"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <View className="w-6 h-6 bg-gray-200 rounded-full items-center justify-center">
              <Ionicons name="close" size={16} color="#4B5563" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}