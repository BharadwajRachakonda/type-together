import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compete",
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
