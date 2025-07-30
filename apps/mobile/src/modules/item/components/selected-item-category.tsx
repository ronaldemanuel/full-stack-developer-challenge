import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export interface SelectedItemCategoryProps {
  selectedCategory: string;
}

export function SelectedItemCategory({
  selectedCategory,
}: SelectedItemCategoryProps) {
  return (
    <View className="flex w-full max-w-md items-center p-4 backdrop-blur-sm">
      <Text className="mt-2 text-2xl font-light tracking-wider text-white">
        {selectedCategory.toUpperCase()}
      </Text>
    </View>
  );
}
