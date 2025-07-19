"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/lib/action";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
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
      <h1>Please log in to continue.</h1>
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
      <button aria-disabled={isPending}>Log in</button>
      <br />
      <button
        onClick={() =>
          replace("/signup?callbackUrl=" + encodeURIComponent(callbackUrl))
        }
      >
        create account
      </button>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </form>
  );
}
