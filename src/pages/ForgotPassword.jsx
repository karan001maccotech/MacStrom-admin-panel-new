import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function ForgotPassword() {
  return (
    <section className="min-h-screen  ">
      

      {/* Right Column - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-xl space-y-6 bg-white dark:bg-zinc-800 p-10 rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Forgot Password</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Enter your email to receive a reset link
            </p>
          </div>

          <form className="space-y-5">
            <input
              type="email"
              placeholder="Email address"
              required
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 outline-none"
            />

            <button
              type="submit"
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
            >
              Send Reset Link
            </button>

            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Remember your password?{" "}
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

export default ForgotPassword;
