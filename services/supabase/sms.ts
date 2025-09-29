import { VerifyOtpResponse } from "@/types/api/sms";
import { AxiosError, AxiosResponse } from "axios";
import { OtpError, OtpErrorType } from "../errors/otp-error";
import supabaseFunctions from "./functions";

enum EdgeFunction {
  SEND_OTP = "send-otp",
  VERIFY_OTP = "verify-otp",
}

export const sendOtp = async (phone: string): Promise<void> => {
  try {
    await supabaseFunctions.post(EdgeFunction.SEND_OTP, {
      phone,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError?.isAxiosError) {
      switch (axiosError.response?.status) {
        case 400:
          throw OtpError.InvalidCode();
        case 404:
          throw OtpError.PhoneUnregistered();
        default:
          break;
      }
    }

    throw error;
  }
};

export const verifyOtp = async (
  code: string,
  phone: string
): Promise<AxiosResponse<VerifyOtpResponse>> => {
  try {
    const responseData = await supabaseFunctions.post(EdgeFunction.VERIFY_OTP, {
      code,
      phone,
    });

    return responseData;
  } catch (error) {
    const axiosError = error as AxiosError<{ code?: string }>;
    if (axiosError.isAxiosError && axiosError.response) {
      switch (axiosError.response.data.code as OtpErrorType) {
        case "invalid-code":
          throw OtpError.InvalidCode();
        case "expired-code":
          throw OtpError.ExpiredCode();

        default:
          throw axiosError;
      }
    }

    throw error;
  }
};
