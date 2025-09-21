"use client";
import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useOdooAuth } from "../../hooks/useFetchOdooCredentials";
import Image from "next/image";

export default function OdooPage() {
  const {
    token,
    loading,
    error: authError,
    dbUrl,
    setDbUrl,
    dbName,
    setDbName,
    email,
    setEmail,
    apiKey,
    setApiKey,
    agreed,
    setAgreed,
    verifyAndSave,
  } = useOdooAuth();

  if (!token) {
    return <p className="text-center mt-10">Please log in to connect your Odoo account.</p>;
  }

  return (
    <div className="min-h-screen bg-[#141244] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="relative bg-purple-600 text-white p-4 sm:p-6 md:p-8 rounded-lg flex flex-col gap-50 text-center min-h-[100px] sm:min-h-[500px]">
            <div>
            <Image
              src="/logo-white.png"
              alt="Logo"
              width={100}
              height={100}
              className=" object-contain"
            />
            </div>
            <div>
            <div className="mt-6 sm:mt-24 md:mt-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Connect Your Odoo Account
              </h1>
              <p className="text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl leading-relaxed mt-4">
                To sync company candidate data, connect your Odoo account. Your credentials are securely encrypted.
              </p>
              <Button
                className="w-32 sm:w-40 md:w-60 border border-white bg-transparent text-white font-semibold py-2 sm:py-3 rounded-full hover:bg-white hover:text-purple-700 transition duration-300 mt-6 cursor-pointer"
                onClick={() => window.open("https://www.odoo.com/", "_blank")}
              >
                Create Odoo Account
              </Button>
            </div>
          </div>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await verifyAndSave();
            }}
            className="p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-6 flex flex-col justify-center min-h-[400px] sm:min-h-[500px]"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl text-purple-500 text-left font-bold mb-2 sm:mb-4">
              Sync With Odoo
            </h2>
            <div>
              <label htmlFor="dbUrl" className="block mb-1 sm:mb-2 text-sm sm:text-lg text-gray-800 font-bold">
                Odoo Instance URL
              </label>
              <Input
                id="dbUrl"
                placeholder="Enter your Odoo Instance URL"
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="dbName" className="block mb-1 sm:mb-2 text-sm sm:text-lg text-gray-800 font-bold">
                Database Name
              </label>
              <Input
                id="dbName"
                placeholder="Enter your database name"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 sm:mb-2 text-sm sm:text-lg text-gray-800 font-bold">
                Email
              </label>
              <Input
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="apiKey" className="block mb-1 sm:mb-2 text-sm sm:text-lg text-gray-800 font-bold">
                API Key / Password
              </label>
              <Input
                id="apiKey"
                placeholder="Enter your API key or password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                className="w-full"
              />
            </div>
            {authError && (
              <p className="text-red-600 text-xs sm:text-sm text-center">{authError}</p>
            )}
            <div className="flex items-start">
              <div className="flex items-center h-4 sm:h-5">
                <input
                  id="agreement"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-3 sm:w-4 h-3 sm:h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                  required
                />
              </div>
              <div className="ml-2 sm:ml-3 text-xs sm:text-sm">
                <label htmlFor="agreement" className="font-medium text-gray-800">
                  I agree to share my candidate information & files from Odoo with Recos.
                </label>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-32 sm:w-40 md:w-60 py-2 sm:py-3 rounded-full font-bold mx-auto cursor-pointer"
            >
              {loading ? "Connecting..." : "Connect to Odoo"}
            </Button>
            <div className="mt-2 sm:mt-4 px-2 sm:px-3 py-2 sm:py-3 font-medium hover:bg-purple-50 transition duration-300 text-xs sm:text-sm text-gray-800">
              <p>
                Don&apos;t have an API key?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open("https://www.odoo.com/forum/help-1?my=mine", "_blank");
                  }}
                  className="text-[#803CEB] cursor-pointer font-bold"
                >
                  Generate Key
                </a>

              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
