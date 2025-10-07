import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
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

import { PhoneInputField } from "@/components/fields";
import { useLoading } from "@/hooks/useLoading";
import { useAuthStore } from "@/stores/authStore";

import schema from "@/schemas/phone-login-schema";
import { OtpVerifyView } from "./components/otp-verify-view";

type PhoneForm = z.infer<typeof schema>;

export default function Login() {
  const { sendOtpToPhone } = useAuthStore();
  const loading = useLoading();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { control, handleSubmit } = useForm<PhoneForm>({
    resolver: zodResolver(schema),
    defaultValues: { phoneNumber: "" },
    mode: "onSubmit",
  });

  const handleSendOtp = async (values: PhoneForm) => {
    try {
      loading.show();
      await sendOtpToPhone(values.phoneNumber);
      bottomSheetRef.current?.present(values.phoneNumber);
    } catch (err) {
      console.error("Send OTP failed:", err);
    } finally {
      loading.hide();
    }
  };

  return (
    <BottomSheetModalProvider>
      <>
        <LinearGradient
          colors={["#ffffff", "#fef9c3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              className="flex-1  mt-40 px-6"
            >
              <View className="flex-row items-center mb-2">
                <Text className="text-4xl font-extrabold text-black">
                  Bumble Drive 🐝
                </Text>
              </View>
              <Text className="text-gray-700 mb-8 text-base leading-relaxed">
                Sign in securely with your{" "}
                <Text className="text-yellow-600 font-semibold">
                  phone number
                </Text>
                . Quick. Simple. Safe.
              </Text>

              <PhoneInputField autoFocus control={control} name="phoneNumber" />

              <TouchableOpacity
                onPress={handleSubmit(handleSendOtp)}
                activeOpacity={0.9}
                className="mt-2 w-full rounded-full bg-black py-4 items-center shadow-lg"
              >
                <Text className="font-bold text-white text-lg">Continue</Text>
              </TouchableOpacity>

              <Text className="text-center text-gray-500 text-xs leading-relaxed mt-6">
                By continuing, you agree to our{" "}
                <Text className="text-yellow-600 font-semibold">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="text-yellow-600 font-semibold">
                  Privacy Policy
                </Text>
                .
              </Text>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </LinearGradient>

        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={["70%"]}
          backgroundStyle={{ borderRadius: 24 }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior="close"
            />
          )}
        >
          {({ data }) => (
            <BottomSheetView className="p-4 pt-6">
              <OtpVerifyView phoneNumber={data} />
            </BottomSheetView>
          )}
        </BottomSheetModal>
      </>
    </BottomSheetModalProvider>
  );
}
