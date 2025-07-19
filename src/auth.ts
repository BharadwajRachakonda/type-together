"use server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import postgres from "postgres";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function createUser(
  email: string,
  password: string
): Promise<User | undefined> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await getUser(email);
    if (existingUser) {
      console.error("User already exists:", email);
      throw new Error("User already exists.");
    }
    const user = await sql<User[]>`
      INSERT INTO users (name, email, password)
      VALUES (${email} , ${email}, ${hashedPassword})
      RETURNING *;
    `;
    return user[0];
  } catch (error) {
    console.error("Failed to create user:", error);
    if (error instanceof Error && error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create user.");
    }
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
          if (!passwordMatch) return null;
        }
        console.error("Invalid credentials");
        return null;
      },
    }),
  ],
});
