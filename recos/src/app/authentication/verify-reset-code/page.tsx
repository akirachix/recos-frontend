"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFetchVerifyResetCode } from "@/hooks/useFetchVerifyResetCode";
import { useForgotPasswordRequest } from "@/hooks/useFetchForgotPassword";

export default function VerifyResetCodePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [inputError, setInputError] = useState("");
  const [showResendMsg, setShowResendMsg] = useState(false);

  const { loading, error, verified, verifyResetCode } =
    useFetchVerifyResetCode();
  const {
    loading: resendLoading,
    error: resendError,
    success: resendSuccess,
    requestCode,
  } = useForgotPasswordRequest();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email") || "");
    }
  }, []);

  useEffect(() => {
    if (verified) {
      router.push(
        `/authentication/reset-password?email=${encodeURIComponent(email)}`
      );
    }
  }, [verified, router, email]);

  const handleInputChange = (index: number, value: string) => {
    if (value === "" || (value.length === 1 && "0123456789".includes(value))) {
      const newCode = code.map((d, i) => (i === index ? value : d));
      setCode(newCode);
      setInputError("");
      if (value && index < 3) {
        const next = document.getElementById(`code-${index + 1}`);
        if (next) (next as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeValue = code.join("").trim();
    if (codeValue.length !== 4) {
      setInputError("Please enter the 4-digit code.");
      return;
    }
    await verifyResetCode(email, codeValue);
  };

  const handleResend = async () => {
    if (!email) return;
    setShowResendMsg(false);
    await requestCode(email);
    setShowResendMsg(true);
  };

  return (
    <div className="relative bg-[#141244] min-h-screen w-full flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFF7F9] w-[1400px] h-[830px] z-10" />
      <div className="relative z-20 bg-[#FFF7F9] flex flex-col md:flex-row w-full max-w-7xl h-[730px] overflow-auto">
        <div className="flex flex-col justify-start p-8 md:p-16 md:w-1/2">
          <div className="mb-10 mt-1">
            <Image
              src="/recos_purple.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <h2 className="text-[#8645E8] font-bold text-2xl mt-10 mb-10 ml-4 md:ml-20 select-none">
            Email Verification
          </h2>
          <p className="font-semibold text-[#24184E] text-[16px] mb-10 ml-4 md:ml-20">
            Enter the 4-digit code sent to
          </p>
          <p className="mb-10 ml-15 text-black">{email}</p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-7 items-center md:items-start ml-0 md:ml-20"
          >
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-14 h-14 border-2 border-[#8645E8] rounded-lg text-center text-2xl font-bold focus:ring-2 focus:ring-[#8645E8] outline-none transition text-black bg-white placeholder:text-gray-400"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {(inputError || error) && (
              <p className="text-red-600 ml-20 font-semibold text-sm sm:text-base">
                {inputError || error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#8645E8] text-white rounded-full py-2 px-12 text-base font-semibold mt-4 w-full ml-10 md:w-fit hover:bg-[#7A3BD1] transition cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
          <div className="text-[#24184E] text-xs mt-6 ml-25 mb-10 mt-10 flex flex-col items-start gap-1">
            <span>
              Didn&apos;t receive your code?{" "}
              <span
                className="text-[#8645E8] font-semibold cursor-pointer hover:underline"
                onClick={handleResend}
                style={{ marginLeft: 4 }}
              >
                {resendLoading ? "Resending..." : "Resend"}
              </span>
            </span>
            {showResendMsg && !resendLoading && (
              <span
                className={`mt-2 font-semibold ${
                  resendSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {resendSuccess
                  ? "Code resent!"
                  : resendError
                  ? resendError
                  : ""}
              </span>
            )}
          </div>
        </div>
        <div className="bg-[#8645E8] text-white md:w-1/2 flex flex-col justify-center items-center p-16 text-center rounded-r-xl">
          <h2 className="font-bold text-[26px] mb-10 leading-snug">
            Secure Your Account
          </h2>
          <p className="text-[16px] font-normal leading-tight mt-2 max-w-sm mx-auto">
            For your security, we need to verify your identity before allowing
            you to reset your password. Enter the code sent to your email, and
            you&apos;ll be able to set a new password in just a moment.
          </p>
        </div>
      </div>
    </div>
  );
}
