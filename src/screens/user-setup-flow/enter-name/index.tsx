import { InputField } from "@/components/fields";
import { useLoading } from "@/hooks/useLoading";
import schema from "@/schemas/name-schema";
import { useUserStore } from "@/stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as z from "zod";

type FormValues = z.infer<typeof schema>;

export default function SetNameScreen() {
  const { updateName } = useUserStore();
  const loading = useLoading();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: { name: "" },
  });

  const handleSave = async (values: FormValues) => {
    try {
      loading.show();
      await updateName(values.name);
    } finally {
      loading.hide();
    }
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#fef9c3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center px-6 mb-32"
        >
          <View className="mb-8">
            <Text className="text-3xl font-extrabold text-yellow-700 mb-2">
              What should we call you?
            </Text>
            <Text className="text-gray-700 text-base leading-relaxed ">
              Enter a name or nickname so your driver can recognize you easily.
            </Text>
          </View>

          <InputField
            control={control}
            name="name"
            placeholder="Your name or nickname"
          />

          <TouchableOpacity
            onPress={handleSubmit(handleSave)}
            activeOpacity={0.9}
            disabled={!isValid}
            className={`w-full py-4 rounded-full items-center shadow-lg mt-2 ${
              !isValid ? "bg-gray-400" : "bg-black"
            }`}
          >
            <Text
              className={`text-white font-bold text-lg ${
                !isValid ? "opacity-70" : ""
              }`}
            >
              Save
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-gray-500 text-sm leading-relaxed mt-6">
            You can update this later in your{" "}
            <Text className="text-yellow-600 font-semibold">profile</Text>.
          </Text>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}
