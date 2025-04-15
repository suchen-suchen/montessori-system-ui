'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // ✅ For client-side routing

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section
      className="flex items-center justify-center min-h-screen px-6 bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/background4.png')" }}
    >
      <div className="relative w-full max-w-lg pt-36 sm:pt-40">
        {/* 🎓 Floating Logo */}
        <div className="absolute -translate-x-1/2 -top-16 left-1/2">
          <Image
            src="/logo.png"
            alt="SCMS Logo"
            width={180}
            height={180}
            className="w-40 h-auto sm:w-48 md:w-56 drop-shadow-xl"
            priority
          />
        </div>

        {/* 💳 Login Card */}
        <div className="bg-white px-8 py-5 sm:px-10 sm:py-6 rounded-xl shadow-2xl backdrop-blur-xl border border-white/30 w-full sm:w-[480px] relative">
          
          {/* 🔙 Back Button */}
          <Link
            href="/"
            className="absolute text-blue-600 transition left-4 top-4 hover:text-blue-800"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <h2 className="mb-4 text-xl font-bold text-center text-blue-800">Login</h2>

          <form className="space-y-3">
            {/* Email Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 text-gray-800 bg-white border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 text-gray-800 bg-white border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-sm text-blue-600 -translate-y-1/2 right-3 top-1/2"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 font-semibold text-white transition bg-blue-700 rounded-lg shadow hover:bg-blue-800"
            >
              Login
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-3 text-xs text-center text-gray-600">
            Don’t have an account?{" "}
            <a href="#" className="font-medium text-blue-700 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </section>
  );
}
