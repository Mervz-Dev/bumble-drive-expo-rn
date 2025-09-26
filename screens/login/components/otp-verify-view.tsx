import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import * as z from "zod";

import { OtpField } from "@/components/fields";
import { useCountdown } from "@/hooks/useCountdown";
import { useLoading } from "@/hooks/useLoading";
import schema from "@/schemas/otp-verify-schema";
import { useAuthStore } from "@/stores/authStore";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";

type OtpForm = z.infer<typeof schema>;

interface OtpVerifyViewProps {
  phoneNumber: string;
}

const OTP_LENGTH = 6;

export const OtpVerifyView = ({ phoneNumber }: OtpVerifyViewProps) => {
  const { verifyOtp, signInWithPhoneNUmber } = useAuthStore();
  const loading = useLoading();
  const { dismiss } = useBottomSheetModal();
  const { control, handleSubmit, watch } = useForm<OtpForm>({
    defaultValues: { otp: "", phoneNumber },
    resolver: zodResolver(schema),
  });

  const otpValue = watch("otp");
  const isCanSubmit = otpValue.length === OTP_LENGTH;

  const { count, reset } = useCountdown();

  const onSubmitVerify = async (values: OtpForm) => {
    try {
      loading.show();
      await verifyOtp(values.phoneNumber, values.otp);
      dismiss();
    } catch (err) {
      console.error("OTP verification failed:", err);
    } finally {
      loading.hide();
    }
  };

  const handleResend = async () => {
    try {
      loading.show();
      await signInWithPhoneNUmber(phoneNumber);
      reset(); // restart timer
    } catch (err) {
      console.error("Resend OTP failed:", err);
    } finally {
      loading.hide();
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-2">Enter OTP</Text>
      <Text className="text-gray-500 text-center mb-6">
        We sent a 6-digit code to{" "}
        <Text className="font-semibold text-gray-800">{phoneNumber}</Text>
      </Text>

      <OtpField control={control} name="otp" length={6} />

      <TouchableOpacity
        disabled={!isCanSubmit}
        onPress={handleSubmit(onSubmitVerify)}
        className={`${isCanSubmit ? "bg-yellow-400" : "bg-gray-300"} px-6 py-3  rounded-full shadow mt-8 mb-2 w-full active:bg-yellow-500`}
      >
        <Text className="text-gray-900 font-semibold text-lg text-center">
          Verify
        </Text>
      </TouchableOpacity>

      {/* Did not receive code */}
      <View className="mt-6 items-center">
        {count > 0 ? (
          <Text className="text-gray-400">
            Didn’t receive the code? Resend in{" "}
            <Text className="font-semibold text-gray-600">{count}s</Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
            <Text className="text-blue-600 font-semibold">Resend Code</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
