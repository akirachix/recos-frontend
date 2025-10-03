"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForgotPasswordRequest } from "@/app/hooks/useFetchForgotPassword";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formEmail, setFormEmail] = useState("");
  const { loading, error, success, requestCode } = useForgotPasswordRequest();

  useEffect(() => {
    if (success) {
      router.push(`/authentication/verify-reset-code?email=${encodeURIComponent(formEmail)}`);
    }
  }, [success, formEmail, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestCode(formEmail);
  };

  return (
    <div className="relative bg-[#141244] h-screen w-screen flex items-center justify-center overflow-hidden px-4">
      <div className="hidden xl:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFF7F9] rounded-lg w-[1400px] h-[830px] z-10" />
      <div className="
          relative z-20 bg-[#FFF7F9] 
          flex flex-col md:flex-row w-full max-w-4xl xl:max-w-7xl
          h-auto xl:h-[730px]
          overflow-auto
          shadow-xl
          rounded-lg
          ">
        <div className="flex flex-col justify-start p-8 xl:p-16 w-full md:w-1/2">
          <div className="mb-10 mt-1">
            <Image
              src="/recos_purple.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <h2 className="text-[#8645E8] font-bold text-2xl xl:text-3xl mt-10 mb-10 xl:ml-20 select-none">
            Forgot Password
          </h2>
          <p className="font-semibold text-[#24184E] text-[16px] xl:text-[18px] mb-10">
            Enter the email associated with your account and we&apos;ll send a verification code.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label htmlFor="email" className="block font-semibold mb-1 text-[#24184E] text-[15px] xl:text-[17px]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formEmail}
              onChange={e => setFormEmail(e.target.value)}
              required
              className="
                w-full border rounded-md py-2 px-3 outline-none
                text-[15px] xl:text-[16px]
                text-black bg-white
              "
              placeholder="Enter your email"
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={loading}
              className="
                bg-[#8645E8] text-white rounded-full py-2 px-12 text-base font-semibold
                mt-10 xl:mt-20
                xl:ml-25
                w-fit mx-auto
                hover:bg-[#7A3BD1] transition cursor-pointer
              "
            >
              {loading ? "Sending..." : "Recover Password"}
            </button>
            {error && (
              <p className="mt-2 text-red-600 text-center font-semibold text-sm xl:text-base">{error}</p>
            )}
          </form>
        </div>
        <div className="
            bg-[#8645E8] text-white
            w-full md:w-1/2
            flex flex-col justify-center items-center
            p-8 xl:p-16
            text-center rounded-b-lg md:rounded-r-xl md:rounded-bl-none
            ">
          <h2 className="font-bold text-[22px] xl:text-[26px] mb-10 leading-snug">
            Revolutionize Your<br />Interview Process
          </h2>
          <p className="text-[15px] xl:text-[16px] font-normal leading-tight mt-2 max-w-sm mx-auto">
            Don&apos;t worry we&apos;ll help you reset it quickly and securely. Just enter your registered email address, and we&apos;ll send you a link to create a new password.
          </p>
        </div>
      </div>
    </div>
  );
}