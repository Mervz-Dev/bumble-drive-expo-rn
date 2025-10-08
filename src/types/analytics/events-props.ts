export interface EventPropsMap {
  // OTP
  otp_send_attempted: { phone?: string };
  otp_send_success: { phone?: string; provider?: string };
  otp_send_failed: { phone?: string; error: string };
  otp_verify_attempted: { phone?: string };
  otp_verify_success: { phone?: string; user_id?: string };
  otp_verify_failed: { phone?: string; error: string };
  otp_resend: { phone?: string };

  // AUTH
  login: { user_id: string };
  logout: { user_id: string };
  signup_success: { user_id: string };
}
