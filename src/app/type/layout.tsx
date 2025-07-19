import React from "react";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Test",
  keywords: [
    "Type Together",
    "Typing Website",
    "Typing Speed Test",
    "Multiuser Typing",
    "Collaborative Typing",
    "Typing Practice",
    "Typing Challenge",
    "Typing Game",
    "Real-time Typing",
    "Multiplayer Typing",
    "Typing Competition",
    "Typing Game",
    "Typing Race",
    "Live Typing",
    "WPM Tracker",
    "Accuracy Tracker",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Framer Motion",
    "Socket.io",
    "WebSockets",
    "Web Development",
    "Frontend Development",
    "Typing Practice",
    "JavaScript",
    "TypeScript",
    "SEO",
    "Typing App",
    "Collaborative Typing",
    "Typing Challenge",
    "Gamified Typing",
  ],
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SessionProvider>{children}</SessionProvider>;
}
