"use client";
import React from "react";

import { useActionState } from "react";
import { create } from "@/app/lib/action";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

function SignupForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/login";
  const [errorMessage, formAction, isPending] = useActionState(
    create,
    undefined
  );
  const { replace } = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="flex flex-col gap-4 md:gap-8 items-center justify-center h-screen"
    >
      <h1 className="text-4xl font-bold">Type Together - SignUp</h1>
      <form
        action={formAction}
        className="flex flex-col gap-8 justify-center p-10 md:text-base transition-all duration-300 bg-gray-900/65 glass backdrop-saturate-200 backdrop-brightness-200 backdrop-blur-md saturate-100 rounded-[50px]"
      >
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        <div className="flex gap-2 items-center justify-center">
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            className="rounded-xl border border-gray-300/15 p-2 inputText"
            placeholder=""
            required
          />
          <span className="placeholder">Email</span>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder=""
            className="rounded-xl border border-gray-300/15 p-2 inputText"
            required
            minLength={6}
          />
          <span className="placeholder">Password</span>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <div className="flex justify-between">
          <button
            aria-disabled={isPending}
            className="cursor-pointer border-2 border-gray-100/15 hover:border-gray-100/30 transition-all duration-300 ease-in-out px-4 py-2 rounded-xl"
          >
            Sign up
          </button>
          <button
            onClick={() =>
              replace("/login?callbackUrl=" + encodeURIComponent(callbackUrl))
            }
            className="cursor-pointer border-2 border-gray-100/15 hover:border-gray-100/30 transition-all duration-300 ease-in-out px-4 py-2 rounded-xl"
          >
            Login
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default SignupForm;
