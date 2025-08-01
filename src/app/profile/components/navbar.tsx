"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed z-50 left-0 top-30 md:top-5 ml-4 mb-4 backdrop-brightness-200 backdrop-blur-3xl backdrop-contrast-200 border-gray-200/15 border-1 py-2 rounded-3xl inline-block">
      <div className="flex gap-5 px-5">
        <div className="relative">
          <AnimatePresence>
            {pathname === "/profile" && (
              <motion.div
                layoutId="navbar-link-bg"
                className="absolute inset-0 rounded bg-sky-700/60"
                transition={{ type: "spring", stiffness: 100 }}
              />
            )}
          </AnimatePresence>
          <Link href="/profile" className="relative z-10 px-4 py-2 font-medium">
            Profile
          </Link>
        </div>
        <div className="relative">
          <AnimatePresence>
            {pathname === "/profile/leaderboard" && (
              <motion.div
                layoutId="navbar-link-bg"
                className="absolute inset-0 rounded bg-sky-700/60"
                transition={{ type: "spring", stiffness: 100 }}
              />
            )}
          </AnimatePresence>
          <Link
            href="/profile/leaderboard"
            className="relative z-10 px-4 py-2 font-medium"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
