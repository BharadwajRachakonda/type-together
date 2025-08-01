import React from "react";
import Navbar from "./components/navbar";

function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <>
      <Navbar />
      <div className="force-overflow h-[calc(100svh-10rem)] translate-y-40 md:translate-y-5">
        <div>{children}</div>
      </div>
    </>
  );
}

export default Layout;
