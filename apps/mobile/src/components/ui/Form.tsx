// This project uses code from shadcn/ui.
// The code is licensed under the MIT License.
// https://github.com/shadcn-ui/ui

import type { VariantProps } from 'class-variance-authority';
import type {
  ControllerProps,
  FieldPath,
  FieldValues,
  Noop,
} from 'react-hook-form';
import * as React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { cn } from '@/utils/react-native-reusables';
import { Pressable } from '@rn-primitives/slot';
import { cva } from 'class-variance-authority';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';

import type { Option } from './select';
// import {
//   BottomSheet,
//   BottomSheetCloseTrigger,
//   BottomSheetContent,
//   BottomSheetOpenTrigger,
//   BottomSheetView,
// } from '../../components/deprecated-ui/bottom-sheet';
// import { Calendar } from '../../components/deprecated-ui/calendar';
import { Checkbox } from './checkbox';
import { Input } from './input';
// import { Calendar as CalendarIcon } from '../../lib/icons/Calendar';
// import { X } from '../../lib/icons/X';
import { Label } from './label';
import { RadioGroup } from './radio-group';
import { Select } from './select';
import { Switch } from './switch';
import { Text } from './text';

const formItemVariants = cva('', {
  variants: {
    variant: {
      default: 'space-y-2',
      native: 'w-full flex-1 flex-row items-baseline justify-between px-8 py-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Form = FormProvider;

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState, handleSubmit } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { nativeID } = itemContext;

  return {
    nativeID,
    name: fieldContext.name,
    formItemNativeID: `${nativeID}-form-item`,
    formDescriptionNativeID: `${nativeID}-form-item-description`,
    formMessageNativeID: `${nativeID}-form-item-message`,
    handleSubmit,
    ...fieldState,
  };
};

interface FormItemContextValue {
  nativeID: string;
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem({
  className,
  variant,
  ...props
}: React.ComponentPropsWithoutRef<typeof View> &
  VariantProps<typeof formItemVariants> & {
    ref?: React.RefObject<React.ComponentRef<typeof View>>;
  }) {
  const nativeID = React.useId();

  return (
    <FormItemContext.Provider value={{ nativeID }}>
      <View
        className={formItemVariants({
          className: cn(className),
          variant: variant,
        })}
        {...props}
      />
    </FormItemContext.Provider>
  );
}
FormItem.displayName = 'FormItem';

function FormLabel({
  className,
  nativeID: _nativeID,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Label>, 'children'> & {
  children: string;
  ref?: React.RefObject<React.ComponentRef<typeof Label>>;
}) {
  const { error, formItemNativeID } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(
        'native:pb-2 px-px pb-1',
        error && 'text-destructive',
        className,
      )}
      nativeID={formItemNativeID}
      {...props}
    />
  );
}
FormLabel.displayName = 'FormLabel';

function FormDescription({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text> & {
  ref?: React.RefObject<React.ComponentRef<typeof Text>>;
}) {
  const { formDescriptionNativeID } = useFormField();

  return (
    <Text
      ref={ref}
      nativeID={formDescriptionNativeID}
      className={cn('text-muted-foreground pt-1 text-sm', className)}
      {...props}
    />
  );
}
FormDescription.displayName = 'FormDescription';

function FormMessage({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof Animated.Text> & {
  ref?: React.RefObject<React.ComponentRef<typeof Animated.Text>>;
}) {
  const { error, formMessageNativeID } = useFormField();
  const body = error ? error.message : children;

  if (!body) {
    return null;
  }

  return (
    <Animated.Text
      entering={FadeInDown}
      exiting={FadeOut.duration(275)}
      ref={ref}
      nativeID={formMessageNativeID}
      className={cn('text-destructive text-sm font-medium', className)}
      {...props}
    >
      {body}
    </Animated.Text>
  );
}
FormMessage.displayName = 'FormMessage';

type Override<T, U> = Omit<T, keyof U> & U;

interface FormFieldFieldProps<T> {
  name?: string;
  onBlur?: Noop;
  onChange: (val: T) => void;
  value: T;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormItemProps<T extends React.ElementType<any>, U> = Override<
  React.ComponentPropsWithoutRef<T>,
  FormFieldFieldProps<U>
> & {
  label?: string;
  description?: string;
};

function FormInput({
  label,
  description,
  onChange,
  ref,
  ...props
}: FormItemProps<typeof Input, string> & {
  ref?: React.RefObject<React.ComponentRef<typeof Input>>;
}) {
  const {
    error,
    name,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}

      <Input
        testID={name}
        ref={ref}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onChangeText={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
FormInput.displayName = 'FormInput';

function FormCheckbox({
  label,
  description,
  value,
  onChange,
  ref,
  ...props
}: Omit<
  FormItemProps<typeof Checkbox, boolean>,
  'checked' | 'onCheckedChange'
> & {
  ref?: React.RefObject<React.ComponentRef<typeof Checkbox>>;
}) {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    name,
    formMessageNativeID,
  } = useFormField();

  function handleOnLabelPress() {
    onChange(!value);
  }

  return (
    <FormItem className="px-1">
      <View className="flex-row items-center gap-3">
        <Checkbox
          testID={name}
          ref={ref}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          onCheckedChange={onChange}
          checked={value}
          {...props}
        />
        {!!label && (
          <FormLabel
            className="pb-0"
            nativeID={formItemNativeID}
            onPress={handleOnLabelPress}
          >
            {label}
          </FormLabel>
        )}
      </View>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
FormCheckbox.displayName = 'FormCheckbox';

// const FormDatePicker = React.forwardRef<
//   React.ComponentRef<typeof Button>,
//   FormItemProps<typeof Calendar, string>
// >(({ label, description, value, onChange, ...props }, ref) => {
//   const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

//   return (
//     <FormItem>
//       {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
//       <BottomSheet>
//         <BottomSheetOpenTrigger asChild>
//           <Button
//             variant='outline'
//             className='flex-row gap-3 justify-start px-3 relative'
//             ref={ref}
//             aria-labelledby={formItemNativeID}
//             aria-describedby={
//               !error
//                 ? `${formDescriptionNativeID}`
//                 : `${formDescriptionNativeID} ${formMessageNativeID}`
//             }
//             aria-invalid={!!error}
//           >
//             {({ pressed }) => (
//               <>
//                 <CalendarIcon
//                   className={buttonTextVariants({
//                     variant: 'outline',
//                     className: cn(!value && 'opacity-80', pressed && 'opacity-60'),
//                   })}
//                   size={18}
//                 />
//                 <Text
//                   className={buttonTextVariants({
//                     variant: 'outline',
//                     className: cn('font-normal', !value && 'opacity-70', pressed && 'opacity-50'),
//                   })}
//                 >
//                   {value ? value : 'Pick a date'}
//                 </Text>
//                 {!!value && (
//                   <Button
//                     className='absolute right-0 active:opacity-70 native:pr-3'
//                     variant='ghost'
//                     onPress={() => {
//                       onChange?.('');
//                     }}
//                   >
//                     <X size={18} className='text-muted-foreground text-xs' />
//                   </Button>
//                 )}
//               </>
//             )}
//           </Button>
//         </BottomSheetOpenTrigger>
//         <BottomSheetContent>
//           <BottomSheetView hadHeader={false} className='pt-2'>
//             <Calendar
//               style={{ height: 358 }}
//               onDayPress={(day) => {
//                 onChange?.(day.dateString === value ? '' : day.dateString);
//               }}
//               markedDates={{
//                 [value ?? '']: {
//                   selected: true,
//                 },
//               }}
//               current={value} // opens calendar on selected date
//               {...props}
//             />
//             <View className={'pb-2 pt-4'}>
//               <BottomSheetCloseTrigger asChild>
//                 <Button>
//                   <Text>Close</Text>
//                 </Button>
//               </BottomSheetCloseTrigger>
//             </View>
//           </BottomSheetView>
//         </BottomSheetContent>
//       </BottomSheet>
//       {!!description && <FormDescription>{description}</FormDescription>}
//       <FormMessage />
//     </FormItem>
//   );
// });

// FormDatePicker.displayName = 'FormDatePicker';

function FormRadioGroup({
  label,
  description,
  value,
  onChange,
  ref,
  ...props
}: Omit<FormItemProps<typeof RadioGroup, string>, 'onValueChange'> & {
  ref?: React.RefObject<React.ComponentRef<typeof RadioGroup>>;
}) {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem className="gap-3">
      <View>
        {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
        {!!description && (
          <FormDescription className="pt-0">{description}</FormDescription>
        )}
      </View>
      <RadioGroup
        ref={ref}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onValueChange={onChange}
        value={value}
        {...props}
      />

      <FormMessage />
    </FormItem>
  );
}
FormRadioGroup.displayName = 'FormRadioGroup';

// const FormCombobox = React.forwardRef<
//   React.ComponentRef<typeof Combobox>,
//   FormItemProps<typeof Combobox, ComboboxOption | null>
// >(({ label, description, value, onChange, ...props }, ref) => {
//   const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

//   return (
//     <FormItem>
//       {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
//       <Combobox
//         ref={ref}
//         placeholder='Select framework'
//         aria-labelledby={formItemNativeID}
//         aria-describedby={
//           !error
//             ? `${formDescriptionNativeID}`
//             : `${formDescriptionNativeID} ${formMessageNativeID}`
//         }
//         aria-invalid={!!error}
//         selectedItem={value}
//         onSelectedItemChange={onChange}
//         {...props}
//       />
//       {!!description && <FormDescription>{description}</FormDescription>}
//       <FormMessage />
//     </FormItem>
//   );
// });

// FormCombobox.displayName = 'FormCombobox';

/**
 * @prop {children}
 * @example
 *  <SelectTrigger className='w-[250px]'>
      <SelectValue
        className='text-foreground text-sm native:text-lg'
        placeholder='Select a fruit'
      />
    </SelectTrigger>
    <SelectContent insets={contentInsets} className='w-[250px]'>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem label='Apple' value='apple'>
          Apple
        </SelectItem>
      </SelectGroup>
    </SelectContent>
 */
function FormSelect({
  label,
  description,
  onChange,
  value,
  ref,
  ...props
}: Omit<
  FormItemProps<typeof Select, Partial<Option>>,
  'open' | 'onOpenChange' | 'onValueChange'
> & {
  ref?: React.RefObject<React.ComponentRef<typeof Select>>;
}) {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
    name,
  } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <Select
        testID={name}
        ref={ref}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        value={
          value
            ? { label: value.label ?? '', value: value.label ?? '' }
            : undefined
        }
        onValueChange={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
FormSelect.displayName = 'FormSelect';

function FormSwitch({
  label,
  description,
  value,
  onChange,
  ref,
  ...props
}: Omit<
  FormItemProps<typeof Switch, boolean>,
  'checked' | 'onCheckedChange'
> & {
  ref?: React.RefObject<React.ComponentRef<typeof Switch>>;
}) {
  const switchRef = React.useRef<React.ComponentRef<typeof Switch>>(null);
  const {
    error,
    name,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  React.useImperativeHandle(ref, () => {
    if (!switchRef.current) {
      return {} as React.ComponentRef<typeof Switch>;
    }
    return switchRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchRef.current]);

  function handleOnLabelPress() {
    onChange(!value);
  }

  return (
    <FormItem className="px-1">
      <View className="flex-row items-center gap-3">
        <Switch
          ref={switchRef as any}
          testID={name}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          onCheckedChange={onChange}
          checked={value}
          {...props}
        />
        {!!label && (
          <FormLabel
            className="pb-0"
            nativeID={formItemNativeID}
            onPress={handleOnLabelPress}
          >
            {label}
          </FormLabel>
        )}
      </View>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
FormSwitch.displayName = 'FormSwitch';

function FormSection({
  className,
  children,
  label,
  ...props
}: React.ComponentPropsWithoutRef<typeof View> & {
  ref?: React.RefObject<React.ComponentRef<typeof View>>;
} & {
  label?: string;
}) {
  return (
    <View className={cn(className)} {...props}>
      {label && (
        <View className="bg-muted px-8 py-4">
          <Text className="text-muted-foreground">{label}</Text>
        </View>
      )}

      {children}
    </View>
  );
}

function FormControl(
  { ...props }: {} & React.ComponentPropsWithoutRef<typeof Pressable>,
  ref?: React.RefObject<React.ComponentRef<typeof Pressable>>,
) {
  const {
    error,
    name,
    nativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <Pressable
      ref={ref}
      testID={name}
      nativeID={nativeID}
      aria-describedby={
        !error
          ? `${formDescriptionNativeID}`
          : `${formDescriptionNativeID} ${formMessageNativeID}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

export {
  Form,
  FormCheckbox,
  FormControl,
  FormDescription,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  FormRadioGroup,
  FormSection,
  FormSelect,
  FormSwitch,
  useFormField,
};
