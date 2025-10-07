import React, { useRef, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type OtpFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  length?: number;
};

export function OtpField<T extends FieldValues>({
  control,
  name,
  length = 6,
}: OtpFieldProps<T>) {
  const inputRef = useRef<TextInput | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value = "" }, fieldState: { error } }) => {
        const chars = Array.from({ length }, (_, i) => value[i] || "");
        const currentIndex = Math.min(value.length, length - 1);

        return (
          <View className="w-full items-center">
            {/* Hidden input */}
            <TextInput
              autoFocus
              ref={inputRef}
              value={value}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, "").slice(0, length);
                onChange(clean);
              }}
              keyboardType="number-pad"
              maxLength={length}
              style={{ position: "absolute", opacity: 0 }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {/* Fake boxes */}
            <View className="flex-row justify-center">
              {chars.map((char, i) => {
                const isActive = isFocused && i === currentIndex;
                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    onPress={() => inputRef.current?.focus()}
                    className={`w-12 h-14 mx-1 rounded-lg border items-center justify-center bg-gray-100 ${
                      error
                        ? "border-red-500"
                        : isActive
                          ? "border-blue-500"
                          : "border-gray-300"
                    }`}
                  >
                    <Text className="text-xl font-semibold">{char}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      }}
    />
  );
}
