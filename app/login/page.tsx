'use client';
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-100 via-yellow-50 to-white">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-blue-800">Login</h2>

        <form className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute text-sm text-blue-600 -translate-y-1/2 right-3 top-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition bg-blue-700 rounded-lg shadow hover:bg-blue-800"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account? <a href="#" className="font-medium text-blue-700">Sign up</a>
        </p>
      </div>
    </section>
  );
}
