import { Image, Text, View } from 'react-native';

interface MoneyInfoProps {
  user: any;
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
          <Text className="text-white">{user.coins}</Text>
        </View>
      </View>
    </View>
  );
}
