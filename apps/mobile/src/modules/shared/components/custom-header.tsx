import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  onMenuPress?: () => void;
}

export default function CustomHeader({
  title,
  subtitle,
  onMenuPress,
}: CustomHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="item-center relative z-20 flex-row justify-between border-b border-white/20 bg-black/90 p-4 md:hidden"
      style={{ paddingTop: insets.top }}
    >
      <Button
        onPress={onMenuPress}
        className="border border-white/30 bg-black/60 px-4 py-2"
      >
        <Text className="text-sm text-white">MENU</Text>
      </Button>
      <View className="items-center justify-center">
        <Text className="text-xl font-light tracking-widest text-white">
          {title}
        </Text>
        {subtitle && <Text className="text-xs text-gray-400">{subtitle}</Text>}
      </View>
      <View style={{ width: 50 }} />
    </View>
  );
}
