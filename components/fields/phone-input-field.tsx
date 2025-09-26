import React, { useRef } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type PhoneInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

export function PhoneInputField<T extends FieldValues>({
  control,
  name,
}: PhoneInputFieldProps<T>) {
  const PREFIX = "+63";
  const inputRef = useRef<TextInput | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value = PREFIX },
        fieldState: { error },
      }) => {
        if (!value.startsWith(PREFIX)) {
          value = PREFIX;
        }
        const numberPart = value.slice(PREFIX.length);

        return (
          <View className="w-full mb-4">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              className="rounded-full"
            >
              <View className="flex-row py-3 items-center bg-gray-100 rounded-full px-3 shadow-sm border border-gray-200">
                <Text className="text-2xl ml-2">🇵🇭</Text>

                <View className="w-10 items-center justify-center">
                  <Text className="text-base font-semibold text-gray-700">
                    {PREFIX}
                  </Text>
                </View>

                <View className="w-px h-7 bg-gray-200 mx-3" />

                <TextInput
                  ref={inputRef}
                  value={numberPart}
                  onChangeText={(text) => {
                    const numbersOnly = text.replace(/[^0-9]/g, "");
                    onChange(PREFIX + numbersOnly);
                  }}
                  keyboardType="phone-pad"
                  placeholder="9123456789"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-base text-gray-900 mt-0.5"
                  textAlignVertical="center"
                  style={{
                    fontSize: 14,
                    lineHeight: 16,
                  }}
                  maxLength={10}
                />
              </View>
            </TouchableOpacity>

            {error && (
              <Text className="text-red-500 text-sm mt-2">{error.message}</Text>
            )}
          </View>
        );
      }}
    />
  );
}
