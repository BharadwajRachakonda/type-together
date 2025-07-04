"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faUserGroup,
  faArrowRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
const links = [
  { href: "/", icon: faHouse, label: "Home" },
  { href: "/type", icon: faUser, label: "Test" },
  { href: "/type-together", icon: faUserGroup, label: "Compete" },
  { href: "/login", icon: faArrowRightToBracket, label: "Login" },
];

export default function NavBar() {
  const pathname = usePathname();
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => setMounted(true), []);

  // if (!mounted) return null; // Prevent SSR mismatch

  return (
    <div>
      <LayoutGroup>
        <div className="fixed left-0 right-0 top-0 md:bottom-0 md:top-auto w-full flex justify-center">
          <motion.div
            layout="position"
            className="relative left-0 right-0 top-5 md:top-auto md:bottom-5 glass flex justify-around items-center p-4 bg-gray-900/65 rounded-full backdrop-saturate-200 backdrop-brightness-200 backdrop-blur-md saturate-100 brightness-150 md:mx-8 mx-2 w-full max-w-4xl transition-all ease-in-out duration-300"
          >
            {links.map((link) => (
              <AnimatePresence mode="wait" key={link.href}>
                <motion.div
                  layout
                  key={link.href}
                  className="flex flex-col items-center"
                >
                  <Link
                    href={link.href}
                    className={`flex flex-col items-center group cursor-pointer ${
                      pathname === link.href ? "text-blue-300" : "text-white"
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      whileTap={{ scale: 1.5 }}
                      transition={{
                        delay: 0.2,
                        duration: 0.2,
                        type: "spring",
                        stiffness: 300,
                      }}
                      layout
                    >
                      {pathname === link.href && (
                        <motion.div
                          layoutId="active"
                          className="h-2 w-2 rounded-full bg-red-500"
                        ></motion.div>
                      )}
                      <FontAwesomeIcon
                        icon={link.icon}
                        className="md:h-10 h-6 m-2"
                      />
                    </motion.div>
                    {pathname === link.href && (
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{
                          duration: 0.2,
                          type: "spring",
                          stiffness: 300,
                        }}
                        className="text-xs md:text-sm"
                      >
                        {link.label}
                      </motion.p>
                    )}
                  </Link>
                </motion.div>
              </AnimatePresence>
            ))}
          </motion.div>
        </div>
      </LayoutGroup>
    </div>
  );
}
