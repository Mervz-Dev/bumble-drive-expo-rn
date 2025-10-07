export declare namespace Auth {
  type AuthType = "email" | "google" | "facebook";

  interface EmailCredentials {
    readonly email: string;
    readonly password: string;
  }

  interface EmailAuth extends EmailCredentials {
    readonly type: "email";
  }

  interface GoogleAuth {
    readonly type: "google";
  }

  interface FacebookAuth {
    readonly type: "facebook";
  }

  type Authentication = EmailAuth | GoogleAuth | FacebookAuth;
}
