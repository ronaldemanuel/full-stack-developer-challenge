import { View } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '@/components/ui/text';

export default function EmailSent() {
  return (
    <View className="mt-6 w-full">
      <Link href={'/(auth)'} className="w-full py-4">
        <Text className="text-center text-white">BACK TO SIGN IN</Text>
      </Link>
    </View>
  );
}
