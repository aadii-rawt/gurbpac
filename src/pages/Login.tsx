import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAppStore } from "../store/appStore";
import type { LoginResponse, User } from "../types/user";


function Login() {
  const navigate = useNavigate();

  const setAuth = useAppStore(
    (state) => state.setAuth
  );

  const [email, setEmail] = useState("emily.johnson@x.dummyjson.com");
  const [password, setPassword] = useState("emilyspass");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: any
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      
      const userResponse = await axios.get<{
        users: User[];
      }>(
        "https://dummyjson.com/users/filter",
        {
          params: {
            key: "email",
            value: email,
          },
        }
      );

      const user = userResponse.data.users[0];

      if (!user) {
        throw new Error(
          "Invalid email or password"
        );
      }

      const response =
        await axios.post<LoginResponse>(
          "https://dummyjson.com/auth/login",
          {
            username: user.username,
            password,
          }
        );

        console.log(response)

      setAuth(
        response.data,
        response.data.accessToken,
        response.data.refreshToken
      );
      localStorage.setItem("refreshToken", response.data.refreshToken);

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Invalid email or password"
        );
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Login failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090a0c] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111315] p-8 text-white shadow-2xl">
      

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Sign in to continue to SprintDesk
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              required
              className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0c0e] px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
              className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0c0e] px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-blue-600 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;