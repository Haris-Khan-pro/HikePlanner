import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../types';

interface CategorySectionProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategorySection({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategorySectionProps) {
  return (
    <View className="py-3">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4"
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => onSelectCategory(category.id)}
              className={`mr-3 px-5 py-3 rounded-xl ${
                isSelected 
                  ? 'bg-green-600' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              <View className="items-center">
                <Text className="text-2xl mb-1">{category.icon}</Text>
                <Text 
                  className={`font-semibold text-sm ${
                    isSelected ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {category.name}
                </Text>
                <Text 
                  className={`text-xs mt-1 ${
                    isSelected ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  {category.count} trails
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}