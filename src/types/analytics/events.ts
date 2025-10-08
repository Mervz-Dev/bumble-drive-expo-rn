export type OTPEvents =
  | "otp_send_attempted"
  | "otp_send_success"
  | "otp_send_failed"
  | "otp_verify_attempted"
  | "otp_verify_success"
  | "otp_verify_failed"
  | "otp_resend";

export type AuthEvents = "login" | "logout" | "signup_success";

export type PostHogEvent = OTPEvents | AuthEvents;
