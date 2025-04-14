'use client';
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="flex items-center justify-center min-h-screen px-4 sm:px-6 bg-gradient-to-br from-blue-100 via-yellow-50 to-white">
      <div className="relative w-full max-w-md p-8 border shadow-2xl rounded-2xl bg-white/30 backdrop-blur-xl border-white/20 sm:p-10">
        <h2 className="mb-6 text-2xl font-bold text-center text-blue-800 sm:text-3xl">Welcome Back</h2>

        <form className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-sm text-blue-600 -translate-y-1/2 right-3 top-1/2 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-700">
          Don’t have an account? <a href="#" className="font-semibold text-blue-700 hover:underline">Sign up</a>
        </p>
      </div>
    </section>
  );
}
