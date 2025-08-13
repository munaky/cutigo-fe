"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/utils/auth";
import { setUser } from "@/utils/auth";
import { loginApi } from "@/api/auth";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setError("");
      setLoading(true);

      const result = await loginApi({ email, password });

      console.log(result);
      setToken(result.data.token);
      setUser(result.data.user);

      if (result.data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong, try again later.";

      setError(message || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
  <FullScreenLoader loading={loading} />
  <form
    onSubmit={handleSubmit}
    className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6 border border-gray-100"
  >
    <h1 className="text-3xl font-bold text-center text-gray-800 mt-6">Welcome Back</h1>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
      </div>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
    >
      Login
    </button>
  </form>
</div>

  );
}
