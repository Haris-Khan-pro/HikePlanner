import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface FilterChipsProps {
  selectedDifficulty: string;
  onSelectDifficulty: (difficulty: string) => void;
}

const difficulties = ['All', 'Easy', 'Moderate', 'Hard', 'Expert'];

export default function FilterChips({ 
  selectedDifficulty, 
  onSelectDifficulty 
}: FilterChipsProps) {
  return (
    <View className="py-2">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4"
      >
        {difficulties.map((difficulty) => {
          const isSelected = selectedDifficulty === difficulty;
          return (
            <TouchableOpacity
              key={difficulty}
              onPress={() => onSelectDifficulty(difficulty)}
              className={`mr-2 px-4 py-2 rounded-full ${
                isSelected 
                  ? 'bg-green-600' 
                  : 'bg-white border border-gray-300'
              }`}
            >
              <Text 
                className={`font-medium ${
                  isSelected ? 'text-white' : 'text-gray-700'
                }`}
              >
                {difficulty}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}