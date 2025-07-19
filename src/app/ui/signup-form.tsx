"use client";
import React from "react";

import { useActionState } from "react";
import { create } from "@/app/lib/action";
import { useSearchParams, useRouter } from "next/navigation";

function SignupForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/login";
  const [errorMessage, formAction, isPending] = useActionState(
    create,
    undefined
  );
  const { replace } = useRouter();
  return (
    <form action={formAction}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>Please signup to continue.</h1>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        placeholder="Enter your email address"
        required
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Enter your password"
        required
        minLength={6}
      />
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <button aria-disabled={isPending}>Sign up</button>
      <br />
      <button
        onClick={() =>
          replace("/login?callbackUrl=" + encodeURIComponent(callbackUrl))
        }
      >
        Login
      </button>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </form>
  );
}

export default SignupForm;
