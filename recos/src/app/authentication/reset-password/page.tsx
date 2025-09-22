"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useResetPassword } from "@/hooks/useFetchResetPassword";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { loading, error, success, resetPassword } = useResetPassword();

  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email") || "");
    }
  }, []);

  useEffect(() => {
    if (success) {
      router.push("/signin"); 
    }
  }, [success, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (
        updated.password &&
        updated.confirmPassword &&
        updated.password !== updated.confirmPassword
      ) {
        setFormError("Passwords do not match.");
      } else {
        setFormError(null);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    await resetPassword(email, password, confirmPassword);
  };

  return (
    <div className="relative bg-[#141244] h-screen w-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFF7F9] rounded-lg w-[1400px] h-[830px] z-10" />
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
          <h2 className="text-[#8645E8] font-extrabold text-2xl mt-10 mb-10 ml-20 select-none">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <div>
              <label htmlFor="password" className="block font-semibold mb-1 text-[#24184E] text-[15px]">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword.password ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#24184E] rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#8645E8] text-[15px] pr-10 text-black bg-white placeholder:text-gray-400"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                  aria-label={showPassword.password ? "Hide password" : "Show password"}
                >
                    {showPassword.confirmPassword
                  ? <AiOutlineEye size={22} color="black" />
                  : <AiOutlineEyeInvisible size={22} color="black" />
                }
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block font-semibold mb-1 text-[#24184E] text-[15px]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#24184E] rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#8645E8] text-[15px] pr-10 text-black bg-white placeholder:text-gray-400"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() =>
                  setShowPassword(prev =>
                    prev.confirmPassword
                      ? { ...prev, confirmPassword: false }
                      : { ...prev, confirmPassword: true }
                  )
                }
                aria-label={showPassword.confirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                {showPassword.confirmPassword
                  ? <AiOutlineEye size={22} color="black" />
                  : <AiOutlineEyeInvisible size={22} color="black" />
                }
                </button>
              </div>
            </div>
            {formError && (
              <p className="mt-2 text-red-600 text-center font-semibold">{formError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#8645E8] text-white rounded-full py-2 px-12 text-base font-semibold mt-10 w-fit mx-auto hover:bg-[#7A3BD1] transition cursor-pointer"
            >
              {loading ? "Changing..." : "Continue"}
            </button>
            {error && <p className="mt-2 text-red-600 text-center font-semibold">{error}</p>}
            {success && <p className="mt-2 text-green-600 text-center font-semibold">Password reset successful</p>}
          </form>
        </div>
        <div className="bg-[#8645E8] text-white md:w-1/2 flex flex-col justify-center items-center p-16 text-center rounded-r-xl">
          <h2 className="font-bold text-[26px] mb-10 leading-snug">
            Set Strong Password
          </h2>
          <p className="text-[16px] font-normal leading-tight mt-2 max-w-sm mx-auto">
            Create a strong new password to secure your account. Use at least 8 characters, including a mix of letters, numbers, and symbols. Avoid using old passwords or easily guessed details. Once updated, you&apos;ll be able to log in again with full access.
          </p>
        </div>
      </div>
    </div>
  );
}