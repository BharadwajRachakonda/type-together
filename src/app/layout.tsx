import React from "react";
import type { Metadata } from "next";
import { geistSans } from "./font";
import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: { template: "%s | Type Together", default: "Type Together" },
  description:
    "Type Together - multiuser typing experience created by Bharadwaj Rachakonda",
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
  other: {
    "google-site-verification": "csEFsp6IwCZMdxKi3lWbDe9BE-PPXDR5QBjNueFzdQc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <div>{children}</div>
        <footer>
          <NavBar />
        </footer>
      </body>
    </html>
  );
}
