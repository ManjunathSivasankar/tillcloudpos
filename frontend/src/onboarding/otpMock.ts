export const DEV_STATIC_OTP = '5262562';
export const OTP_LENGTH = DEV_STATIC_OTP.length;

export function verifyStaticOtp(inputOtp: string): boolean {
  return inputOtp === DEV_STATIC_OTP;
}
