"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useRegister from "../hooks/useRegister";
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline';
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const { register, loading, error } = useRegister();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
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
    const result = await register(form);
    if (result === "success") {
      setSuccessMessage("Successfully registered!");
      setTimeout(() => router.push("/signin"), 1000);
    } else if (result === "exists") {
      setSuccessMessage("User already exists. Please sign in.");
    }
  };


  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative bg-[#141244] h-screen w-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg h-[780px] w-[1400px] z-10" />
      <div className="relative z-20 bg-[#fff7f9] rounded-xl flex flex-col md:flex-row w-full max-w-7xl max-h-[900px] overflow-hidden">
        <div className="bg-purple-700 text-white md:w-1/2 flex flex-col p-16 rounded-l-xl space-y-8 relative">
          <div className="absolute top-6 left-6">
            <Image
            src="/logo-white.png"
            alt="Recos Logo"
            width="140" 
            height="100"/>
          </div>
          <div className="mt-32 text-center">
            <h2 className="font-bold text-3xl leading-snug select-none">
              Streamline Interviews <br /> with AI Solutions
            </h2>
            <p className="text-base max-w-xs mx-auto mt-4">
              To sync company candidate data, please connect your Odoo account.
            </p>
            <Link
              href="/signin"
              className="mt-6 inline-block border border-white rounded-full px-14 py-3 text-lg hover:bg-white hover:text-purple-700 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center md:w-1/2 p-16 text-[#24184e] rounded-r-xl overflow-hidden">
          <h2 className="text-purple-700 font-bold text-2xl mb-8 select-none">
            Sign Up to Recos
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="first_name" className="block font-semibold mb-1">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
                required
                className="w-full border border-[#24184e] rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-purple-700"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block font-semibold mb-1">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
                required
                className="w-full border border-[#24184e] rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-purple-700"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-semibold mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-[#24184e] rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-purple-700"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block font-semibold mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-[#24184e] rounded-md py-2 px-3 pr-10 outline-none focus:ring-2 focus:ring-purple-700"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-8 translate-y-1/2 text-gray-500 hover:text-purple-700 focus:outline-none"
                tabIndex={0}
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red-600 text-center font-semibold">{error}</p>
            )}
            {successMessage && (
              <p className="mt-2 text-green-600 text-center font-semibold">{successMessage}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 text-white rounded-full py-2 px-14 text-lg font-semibold mt-4 mx-auto block hover:bg-purple-800 transition"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            
          </form>
          <p className="text-center font-semibold mt-6">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-purple-700 cursor-pointer font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
