import React from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { clsx } from 'clsx';

interface SkyrimButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export default function SkyrimButton({
  children,
  onPress,
  variant = 'primary',
  className,
  disabled,
}: SkyrimButtonProps) {
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        'rounded border px-4 py-2 backdrop-blur-sm transition-all duration-200',
        variant === 'secondary'
          ? 'border-gray-500 text-gray-300 hover:border-white hover:text-white'
          : 'border-white/30 text-white hover:border-white/50 hover:bg-white/10',
        className,
      )}
    >
      <Text className="text-center">{children}</Text>
    </Button>
  );
}
