import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useState } from "react";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (/\d/.test(formData.name)) {
      newErrors.name = "Name should not contain numbers";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone no is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone no";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/admin/register", formData);
      console.log("Registration successful:", response.data);
      // Navigate to login or show success message
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center ">

      {/* Right Column - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 p-10 dark:bg-zinc-800 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Create Account</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Join us and start your journey
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
                } bg-neutral-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 outline-none`}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
                } bg-neutral-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 outline-none`}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                placeholder="Phone no"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.phone ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
                } bg-neutral-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 outline-none`}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-2 pr-10 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
                } bg-neutral-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 outline-none`}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-zinc-500 dark:text-zinc-300"
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* Link to Login */}
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <a href="/login" className="text-zinc-800 dark:text-white font-medium hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
