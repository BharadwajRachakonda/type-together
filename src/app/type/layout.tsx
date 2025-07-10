import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
