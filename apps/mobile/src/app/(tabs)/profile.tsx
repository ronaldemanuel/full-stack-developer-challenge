import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput } from '@/components/ui/Form';
import { Camera } from '@/lib/icons/Camera';
import { Upload } from '@/lib/icons/Upload';
import { X } from '@/lib/icons/X';
import { useUser } from '@/modules/auth/hooks/use-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

const profileSchema = z.object({
  name: z.string(),
  imageAsset: z
    .object({
      key: z.string(),
      contentType: z.string(),
      contentLength: z.string(),
      etag: z.string(),
    })
    .optional(),
  email: z.email(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      imageAsset: {},
    },
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const removeAvatar = () => setAvatarPreview(null);

  const insets = useSafeAreaInsets();

  const { user } = useUser();

  return (
    <ScrollView>
      <View
        className="relative h-full w-full flex-1 items-center justify-center bg-black p-4"
        style={{ paddingTop: insets.top }}
      >
        {/* Card principal */}
        <View className="z-10 w-full max-w-xl rounded-xl border border-white/20 bg-black/90 p-6">
          {/* Header */}
          <View className="mb-6 items-center">
            <Image
              source={require('../../../assets/skyrim-logo.png')}
              className="mb-2 h-20 w-16 opacity-90"
              resizeMode="contain"
            />
            <Text className="text-xl tracking-[2px] text-white">PROFILE</Text>
            <Text className="text-xs tracking-[3px] text-gray-400">
              EDIT CHARACTER
            </Text>
          </View>

          {/* Foto de perfil */}
          <View className="mb-6 items-center">
            <View className="h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-gray-700">
              {avatarPreview ? (
                <Image
                  source={{ uri: avatarPreview }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-4xl text-gray-400">🛡️</Text>
              )}
            </View>

            {avatarPreview && (
              <TouchableOpacity
                onPress={removeAvatar}
                className="absolute -right-2 -top-2 h-8 w-8 items-center justify-center rounded-full bg-red-500"
              >
                <X size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex flex-col items-center gap-3">
            <Button className="flex w-1/2 flex-row items-center rounded border border-white/30 bg-black/60">
              <Camera size={16} color={'#fff'} />
              <Text className="ml-2 text-sm tracking-wider text-white">
                CHOOSE IMAGE
              </Text>
            </Button>

            <Button
              className="flex w-1/2 flex-row items-center rounded border border-white/30 bg-black/60"
              disabled={true}
            >
              <Upload size={16} color={'#fff'} />
              <Text className="ml-2 text-sm tracking-wider text-white">
                MAX 5MB
              </Text>
            </Button>
          </View>

          <Text className="text-center text-xs text-gray-500">
            Supported formats: JPG, PNG, GIF
          </Text>

          {/* Campos de formulário */}
          <KeyboardAvoidingView
            className="w-full"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            behavior={'position'}
          >
            {/* USERNAME */}
            <Form {...form}>
              <View className="gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      label="NAME"
                      value={user?.name || value}
                      defaultValue={user?.name}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your name"
                      placeholderTextColor="#aaa"
                      className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      label="EMAIL"
                      value={user?.email || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      editable={false}
                      className="rounded-md border border-white/30 bg-black/60 px-4 py-3"
                    />
                  )}
                />
              </View>
            </Form>
          </KeyboardAvoidingView>

          {/* Character Info */}

          {/* Botões */}
          <View className="mt-6 flex-col gap-3 space-y-3">
            <Button className="flex flex-row items-center rounded border border-white/30">
              {isLoading ? (
                <Text className="text-sm tracking-wider text-white">
                  SAVING CHANGES...
                </Text>
              ) : (
                <Text className="text-sm tracking-wider text-white">
                  SAVE CHANGES
                </Text>
              )}
            </Button>

            <Button
              className="flex flex-row items-center rounded border border-white/30"
              onPress={() => router.back()}
            >
              <Text className="text-sm tracking-wider text-white">CANCEL</Text>
            </Button>
          </View>

          {/* Suporte */}
          <View className="items-center border-t border-white/20 pt-6">
            <Text className="mb-1 text-sm text-gray-400">
              Need to change your email?
            </Text>
            <Link href={'/'}>
              <Text className="text-sm text-white underline">
                Contact Support
              </Text>
            </Link>
          </View>

          {/* Aviso de privacidade */}
          <View className="mt-4 rounded border border-white/10 bg-black/20 p-3">
            <Text className="text-center text-xs text-gray-500">
              Your profile information is stored securely and will only be
              visible to other players in your guild or party.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
