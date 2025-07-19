"use server";
import { signIn, signOut, createUser } from "@/auth";
import { AuthError } from "next-auth";

export const signOutUser = async () => {
  await signOut({ redirectTo: "/" });
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function create(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = formData.get("redirectTo") as string;
    if (!email || !password) {
      return "Email and password are required.";
    }
    try {
      await createUser(email, password);
      await signIn("credentials", formData);
      return "Account created successfully.";
    } catch (error) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return (error as { message: string }).message;
      }
    }
  } catch (error) {
    return "Failed to create account.";
  }
}
