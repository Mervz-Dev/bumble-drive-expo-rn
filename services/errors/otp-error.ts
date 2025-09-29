export type OtpErrorType = "invalid-code" | "not-registered" | "expired-code";

export class OtpError extends Error {
  status?: OtpErrorType;

  constructor(message: string, status?: OtpErrorType) {
    super(message);
    this.name = "OtpError";
    this.status = status;
  }

  static PhoneUnregistered() {
    return new OtpError("Phone not registered", "not-registered");
  }

  static InvalidCode() {
    return new OtpError("Code invalid", "invalid-code");
  }

  static ExpiredCode() {
    return new OtpError("Code Expired", "expired-code");
  }
}
