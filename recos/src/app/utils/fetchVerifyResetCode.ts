export const fetchVerifyResetCode = async (code: string) => {
  const response = await fetch(`/api/verify-reset-code?code=${code}`);
  if (!response.ok) {
    throw new Error('Failed to verify reset code.');
  }
  return response.json();
};