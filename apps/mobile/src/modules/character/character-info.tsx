import { Text, View } from 'react-native';
import { cn } from '@/utils/react-native-reusables';

interface CharacterStats {
  health: number;
  magicka: number;
  stamina: number;
  carryWeight: number;
}

interface CharacterInfoProps {
  user: any;
  // characterStats: CharacterStats;
}

export function CharacterInfo({ user }: CharacterInfoProps) {
  const name = user?.name?.toUpperCase() ?? 'DRAGONBORN';

  return (
    <View className="absolute bottom-0 left-0 right-0 z-20 bg-black/95 p-3 backdrop-blur-sm md:hidden">
      <View className="mb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-base font-light text-white">{name}</Text>
        </View>
        <Text className="text-xs text-gray-400">
          Weight: <Text className="text-white">{user.weight} / 135</Text>
        </Text>
      </View>

      {/* Character Stats */}
      <View className="flex-row justify-between gap-3">
        <StatBar
          label="HP"
          percent={user.hpLevel}
          barColor="bg-red-500"
          bgColor="bg-red-900/30"
          borderColor="border-red-500/50"
          textColor="text-red-400"
        />
        <StatBar
          label="MP"
          percent={user.mpLevel}
          barColor="bg-blue-500"
          bgColor="bg-blue-900/30"
          borderColor="border-blue-500/50"
          textColor="text-blue-400"
        />
        <StatBar
          label="SP"
          percent={user.spLevel}
          barColor="bg-green-500"
          bgColor="bg-green-900/30"
          borderColor="border-green-500/50"
          textColor="text-green-400"
        />
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
