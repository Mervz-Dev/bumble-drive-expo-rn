import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

export interface InputFieldProps<T extends FieldValues> extends TextInputProps {
  control: Control<T, object>;
  name: Path<T>;
  className?: string;
  focusClassName?: string;
  bottomSheetInput?: boolean;
}

export const InputField = <T extends FieldValues>({
  control,
  name,
  className,
  focusClassName,
  bottomSheetInput,
  ...props
}: InputFieldProps<T>) => {
  const Input = bottomSheetInput ? BottomSheetTextInput : TextInput;

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <View className="w-full mb-4">
          <Input
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            {...props}
            className={`bg-gray-100 border rounded-full px-5 py-4 shadow-sm 
              ${error ? "border-red-400" : "border-gray-200"} 
              ${className || ""}`}
          />

          {error && (
            <Text className="text-red-500 text-sm mt-1">
              {error.message || "This field has an error"}
            </Text>
          )}
        </View>
      )}
    />
  );
};
