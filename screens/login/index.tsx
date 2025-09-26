import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const { signInWithPhoneNUmber, verifyOtp, signInWithGoogle } = useAuthStore();
  const loading = useLoading();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // ✅ Form setup
  const { control, handleSubmit } = useForm<PhoneForm>({
    resolver: zodResolver(schema),
    defaultValues: { phoneNumber: "" },
    mode: "onSubmit",
  });

  // Send OTP
  const handleSendOtp = async (values: PhoneForm) => {
    try {
      loading.show();
      await signInWithPhoneNUmber(values.phoneNumber);
      bottomSheetRef.current?.present(values.phoneNumber);
    } catch (err) {
      console.error("Send OTP failed:", err);
    } finally {
      loading.hide();
    }
  };

  return (
    <BottomSheetModalProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          className="flex-1 bg-white"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="flex-1 justify-start pt-40">
            <View className="px-6">
              <Text className="text-4xl font-extrabold text-black mb-3">
                Welcome to Bumble Drive 🚖
              </Text>
              <Text className="text-gray-600 mb-10 text-base leading-relaxed">
                Sign in with your{" "}
                <Text className="text-yellow-500 font-semibold">
                  phone number
                </Text>{" "}
                to start your journey. Fast, simple, and secure ✨
              </Text>

              <PhoneInputField control={control} name="phoneNumber" />

              <TouchableOpacity
                onPress={handleSubmit(handleSendOtp)}
                className="bg-black py-4 rounded-full items-center shadow-lg mt-1 mb-6"
                activeOpacity={0.9}
              >
                <Text className="font-bold text-yellow-400 text-lg">
                  Continue
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-[1px] bg-gray-300" />
                <Text className="mx-3 text-gray-400">OR</Text>
                <View className="flex-1 h-[1px] bg-gray-300" />
              </View>

              {/* Google login option */}
              <TouchableOpacity
                onPress={() => signInWithGoogle()}
                className="flex-row items-center justify-center bg-[#DB4437] py-4 rounded-full shadow-sm mb-4"
                activeOpacity={0.9}
              >
                <Ionicons name="logo-google" size={20} color="white" />
                <Text className="ml-3 font-semibold text-white">
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </View>

            <View className=" w-full pt-4">
              <Text className="text-center text-gray-400 text-xs leading-relaxed px-6">
                By continuing, you agree to our{" "}
                <Text className="text-yellow-500 font-semibold">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="text-yellow-500 font-semibold">
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </View>

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
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BottomSheetModalProvider>
  );
}
