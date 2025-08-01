import { Image, Text, View } from 'react-native';
import { cn } from '@/utils/react-native-reusables';

interface CharacterStats {
  health: number;
  magicka: number;
  stamina: number;
  carryWeight: number;
}

interface MoneyInfoProps {
  user: any;
  // characterStats: MoneyStats;
}

export function MoneyInfo({ user }: MoneyInfoProps) {
  const name = user?.name?.toUpperCase() ?? 'DRAGONBORN';

  return (
    <View className="absolute bottom-0 left-0 right-0 z-20 bg-black/95 p-3 backdrop-blur-sm md:hidden">
      <View className="mb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-base font-light text-white">{name}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Image
            source={require('../../../assets/Septim_Skyrim.png')}
            style={{ width: 16, height: 16 }}
            resizeMode="contain"
          />
          <Text className="text-white">{user.coins || 1234}</Text>
        </View>
        <Text className="text-xs text-gray-400">
          Weight: <Text className="text-white">40 / 135</Text>
        </Text>
      </View>
    </View>
  );
}

function StatBar({
  label,
  percent,
  barColor,
  bgColor,
  borderColor,
  textColor,
}: {
  label: string;
  percent: number;
  barColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}) {
  return (
    <View className="flex-1">
      <Text className={cn('mb-1 text-xs uppercase', textColor)}>{label}</Text>
      <View
        className={cn(
          'h-2 overflow-hidden rounded',
          bgColor,
          borderColor,
          'border',
        )}
      >
        <View
          className={cn('h-full', barColor)}
          style={{ width: `${percent}%` }}
        />
      </View>
      <Text className="mt-1 text-center text-xs text-white">{percent}%</Text>
    </View>
  );
}
