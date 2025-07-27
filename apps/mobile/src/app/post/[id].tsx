import { Button, SafeAreaView, Text, View } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { trpc } from '@/utils/api';

export default function Post() {
  const { id } = useGlobalSearchParams();
  if (!id || typeof id !== 'string') throw new Error('unreachable');
  const { data } = useQuery(trpc.post.getById.queryOptions({ id }));
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    trpc.post.toggleLike.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.post.getById.queryFilter({
            id,
          }),
        );
      },
      onError: (error) => {
        // Handle error, e.g., show an error message
        console.error('Error toggling like:', error);
      },
    }),
  );

  if (!data) return null;

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: data.title }} />
      <View className="h-full w-full p-4">
        <Text className="text-primary py-2 text-3xl font-bold">
          {data.title}
        </Text>
        <Text className="text-foreground py-4">{data.content}</Text>
        <Button
          onPress={() =>
            mutate({
              postId: data.id,
            })
          }
          title={data.meta?.liked ? 'Unlike' : 'Like'}
          color={'#5B65E9'}
        />
      </View>
    </SafeAreaView>
  );
}
