export type VerifyResponseSuccess = {
  success: true;
  user_id: string;
  access_token: string;
  refresh_token: string;
  message: string;
};

export type VerifyResponseError = {
  success?: false;
  code: string;
  message: string;
};

export type VerifyOtpResponse = VerifyResponseSuccess | VerifyResponseError;
