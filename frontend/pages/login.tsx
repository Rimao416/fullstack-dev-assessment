"use client";
import { useLoginMutation } from "@/slice/authSlice";
import { getErrorMessage } from "@/utils/errorHandler";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = await login(credentials).unwrap();
    if (userData.token) {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Login</h1>
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 text-sm rounded-lg">
          <p>
            <strong>Note:</strong> Use the following credentials to log in:
          </p>
          <p>Email: <span className="font-medium">diana.prince@example.com</span></p>
          <p>Password: <span className="font-medium">12345678</span></p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{getErrorMessage(error)}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
