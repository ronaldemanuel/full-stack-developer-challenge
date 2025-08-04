import React from 'react';
import { Text } from '@/components/ui/text';

interface Props {
  error?: string;
}

export const FormMessage = ({ error }: Props) => {
  if (!error) return null;
  return <Text className="mt-1 text-xs text-red-400">{error}</Text>;
};
