import React from "react";
import type { Metadata } from "next";
import { geistSans } from "./font";
import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "Type Together",
  description: "Created by Bharadwaj Rachakonda",
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
