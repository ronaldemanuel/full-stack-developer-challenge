import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '@/utils/react-native-reusables';

const toastVariants = {
  default: {
    toast: 'bg-background',
    text: 'text-foreground',
    progress: 'bg-foreground',
  },
  error: {
    toast: 'bg-destructive',
    text: 'text-destructive-foreground',
    progress: 'bg-destructive-foreground',
  },
  success: {
    toast: 'bg-success',
    text: 'text-success-foreground',
    progress: 'bg-success-foreground',
  },
  info: {
    toast: 'bg-sky-500',
    text: 'text-primary-foreground',
    progress: 'bg-primary-foreground',
  },
};

type ToastVariant = keyof typeof toastVariants;
type ToastPosition = 'top' | 'bottom';

interface ToastProps {
  id: number;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onHide: (id: number) => void;
  showProgress?: boolean;
}

function Toast({
  id,
  title,
  description,
  onHide,
  variant = 'default',
  duration = 4000,
  showProgress = true,
}: ToastProps) {
  const opacity = useSharedValue(0);
  const progress = useSharedValue(0);

  const translateY = useDerivedValue(() => {
    return interpolate(opacity.value, [0, 1], [-20, 0]);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progress.value, [0, 1], [0, 100])}%`,
    };
  });

  useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    opacity.value = withSequence(
      withTiming(1, {
        duration: 500,
        easing: Easing.linear,
      }),
      withTiming(1, {
        duration: duration - 1000,
        easing: Easing.linear,
      }),
      withTiming(0, {
        duration: 500,
        easing: Easing.linear,
      }),
    );
    progress.value = withSequence(
      withTiming(0, {
        duration: 500,
        easing: Easing.linear,
      }),
      withTiming(1, {
        duration: duration - 1000,
        easing: Easing.linear,
      }),
      withTiming(
        1,
        {
          duration: 500,
          easing: Easing.linear,
        },
        (finished) => finished && runOnJS(onHide)(id),
      ),
    );
  }, [duration, id, onHide, opacity, progress]);

  return (
    <Animated.View style={animatedStyle}>
      <View
        className={cn(
          'border-border m-2 gap-1 rounded-md border p-6 pr-10',
          toastVariants[variant].toast,
        )}
      >
        <Text
          className={cn('text-left font-semibold', toastVariants[variant].text)}
        >
          {title}
        </Text>
        <Text className={cn('text-left', toastVariants[variant].text)}>
          {description}
        </Text>
        {showProgress && (
          <View className="mt-2 rounded">
            <Animated.View
              className={cn(
                'h-2 rounded opacity-30',
                toastVariants[variant].progress,
              )}
              style={progressAnimatedStyle}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
}

type ToastMessage<P extends ToastPosition = ToastPosition> = Omit<
  ToastProps,
  'onHide' | 'position'
> & {
  position?: P;
};

interface ToastContextProps {
  toast: (options: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

type ToastProviderProps = React.PropsWithChildren<{
  position?: ToastPosition;
}>;

function ToastProvider({
  children,
  position: defaultPosition = 'top',
}: ToastProviderProps) {
  const [topMessages, setTopMessages] = useState<ToastMessage<'top'>[]>([]);
  const [bottomMessages, setBottomMessages] = useState<
    ToastMessage<'bottom'>[]
  >([]);

  const toast: ToastContextProps['toast'] = useCallback(
    ({
      title,
      description,
      variant,
      duration,
      position = defaultPosition,
      showProgress,
    }) => {
      if (position === 'top') {
        setTopMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            title,
            description,
            variant,
            duration,
            position,
            showProgress,
          },
        ]);
        return;
      }

      setBottomMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          title,
          description,
          variant,
          duration,
          position,
          showProgress,
        },
      ]);
    },
    [defaultPosition],
  );

  const removeToast = useCallback<ToastContextProps['removeToast']>((id) => {
    setTopMessages((prev) => prev.filter((message) => message.id !== id));
    setBottomMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  const value = useMemo(() => ({ toast, removeToast }), [toast, removeToast]);

  return (
    <ToastContext value={value}>
      {children}
      <View className="absolute left-0 right-0 top-[45px]">
        {topMessages.map((message) => (
          <Toast
            key={message.id}
            id={message.id}
            title={message.title}
            description={message.description}
            variant={message.variant}
            duration={message.duration}
            showProgress={message.showProgress}
            onHide={removeToast}
          />
        ))}
      </View>
      <View className="absolute bottom-0 left-0 right-0">
        {bottomMessages.map((message) => (
          <Toast
            key={message.id}
            id={message.id}
            title={message.title}
            description={message.description}
            variant={message.variant}
            duration={message.duration}
            showProgress={message.showProgress}
            onHide={removeToast}
          />
        ))}
      </View>
    </ToastContext>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export { ToastProvider, type ToastVariant, Toast, toastVariants, useToast };
