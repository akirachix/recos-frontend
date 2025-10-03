"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useLogin from "../hooks/useLogin";
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline'
import Image from "next/image";


export default function SignIn() {
  const router = useRouter();
  const { login, loading, error } = useLogin();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccessMessage("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const success = await login(form);
      if (success) {
        setSuccessMessage("Successfully logged in!");
        setTimeout(() => router.push("/authentication/odoo"), 1000);
      }
    } catch (error) {
      setSuccessMessage("Login failed: " + (error as Error).message);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative bg-[#141244] h-screen w-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg w-[1400px] h-[780px] z-10" />

      <div className="relative z-20 bg-[#fff7f9] rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-7xl max-h-[90vh] overflow-auto">
        <div className="flex flex-col p-8 md:p-16 md:w-1/2">
          <div className="absolute top-6 left-6">
            <Image
            src="/Group 328.png"
            alt="Recos Logo"
            width="140" 
            height="100"/>
          </div>
          <h2 className="text-purple-700 font-semibold text-xl mt-16 mb-10 select-none">
            Sign In to Recos
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-7">
            <div>
              <label htmlFor="email" className="block font-semibold mb-1 text-[#24184e] text-sm sm:text-base">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-[#24184e] rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-purple-700 text-sm sm:text-base"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block font-semibold mb-1 text-[#24184e] text-sm sm:text-base">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-[#24184e] rounded-md py-2 px-3 pr-10 outline-none focus:ring-2 focus:ring-purple-700 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-8 translate-y-1/2 text-gray-500 hover:text-purple-700 focus:outline-none cursor-pointer"
                tabIndex={0}
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex justify-end text-sm text-[#24184e]">
              <Link href="/authentication/forgot-password" className="text-purple-700 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 text-white rounded-full py-2 px-20 text-lg font-semibold mx-auto block hover:bg-purple-800 transition cursor-pointer"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            {error && (
              <p className="mt-2 text-red-600 text-center font-semibold text-sm sm:text-base">{error}</p>
            )}
            {successMessage && (
              <p className="mt-2 text-green-600 text-center font-semibold text-sm sm:text-base">{successMessage}</p>
            )}
          </form>

          <p className="text-center text-[#24184e] font-semibold mt-8 select-none text-sm sm:text-base">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-purple-700 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
        <div className="bg-purple-700 text-white w-1/2 flex flex-col justify-center items-center p-16 text-center rounded-r-xl space-y-8 select-none">
          <h2 className="font-bold text-3xl leading-snug">Revolutionize Your Interview Process</h2>
          <p className="text-base max-w-xs mx-auto">
            To sync company candidate data, please connect your Odoo account.
          </p>
          <Link
            href="/signup"
            className="border border-white rounded-full px-14 py-3 text-lg hover:bg-white hover:text-purple-700 transition inline-block"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
