import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase"; // Adjust if needed

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const vapidKey =
    "BCI-Cu-Pg0FnXdyxDeR6LHozhMO_5Ft5I5VIi7bI8ofJhOrHMffJgNbPnHczr1Rtlu9rqVKalQRkQJ5pC6qsc6c";

  const registerFcmToken = async (authToken) => {
    try {
      const currentToken = await getToken(messaging, { vapidKey });

      if (currentToken) {
        await axiosInstance.post(
          "/api/save-token",
          { token: currentToken },
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Optional if using auth
            },
          }
        );
        console.log("FCM token registered:", currentToken);
      } else {
        console.warn("No FCM token available.");
      }
    } catch (error) {
      console.error("Error registering FCM token:", error);
    }
  };

  const validateForm = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    let valid = true;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/admin/login", {
        email,
        password,
      });

      const { token: authToken, user } = response.data;
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name);
      await registerFcmToken(authToken); // <-- FCM registration

      // Redirect based on role
      if (user.role === "SuperAdmin") {
        navigate("/super-admin");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="min-h-screen flex items-center justify-center">
      {/* Right - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 ">
        <div className="w-full max-w-xl space-y-8  p-10 rounded-lg shadow-lg dark:bg-zinc-800 bg-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Please sign in to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={validateForm} noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className={`mt-1 w-full px-4 py-2 rounded-lg bg-neutral-50 dark:bg-zinc-800 border ${
                  emailError
                    ? "border-red-500"
                    : "border-zinc-300 dark:border-zinc-700"
                } text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 outline-none`}
                required
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className={`mt-1 w-full px-4 py-2 pr-10 rounded-lg bg-neutral-50 dark:bg-zinc-800 border ${
                    passwordError
                      ? "border-red-500"
                      : "border-zinc-300 dark:border-zinc-700"
                  } text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 outline-none`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-zinc-500 dark:text-zinc-300"
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end text-sm">
              <Link
                to="/forgot-password"
                className="text-zinc-600 dark:text-zinc-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600"
            >
              Sign In
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-zinc-800 dark:text-white font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
