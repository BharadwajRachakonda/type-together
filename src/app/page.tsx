"use client";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Background from "./components/Background";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const arr = [
    " by Me",
    " by Bharadwaj Rachakonda",
    " with 💘💝",
    " with Gemini AI",
    " with Framer Motion",
    " with Next.js",
    " with TypeScript",
    " with Tailwind CSS",
    " with React",
    " with HTML",
    " with CSS",
    " with Socket.io",
  ];

  const [i, setI] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setI((prev) => (prev + 1) % arr.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [arr.length]);

  return (
    <LayoutGroup>
      <Background />
      <motion.div
        initial={{ filter: "blur(10px)" }}
        whileInView={{ filter: "blur(0px)" }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="min-h-screen"
      >
        <div>
          <motion.div className="flex flex-col items-center justify-center gap-10 p-4 py-8">
            <div>
              <div className="flex flex-col items-center h-lvh justify-center gap-2 overflow-hidden">
                <motion.h1
                  initial={{ borderTop: "50px solid transparent" }}
                  animate={{ borderTop: "-50px solid transparent" }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className="text-4xl font-extralight text-sky-200/90 italic text-shadow-lg"
                >
                  Type & Compete
                </motion.h1>
                <span className="text-2xl">Built </span>{" "}
                <span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      layout
                      key={arr[i]}
                      className="md:text-4xl text-2xl font-extrabold text-sky-200/90 inline-block italic"
                      initial={{ x: 0, y: 5, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 1 }}
                      exit={{ x: 0, y: -5, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {arr[i]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-10 border-2 border-gray-100 rounded-full flex justify-center">
                      <div className="w-1 h-3 bg-gray-100 rounded-full mt-5 animate-bounce"></div>
                    </div>
                  </div>
                  {/* <FontAwesomeIcon
                    icon={faAnglesDown}
                    className="animate-bounce text-2xl "
                  /> */}
                </div>
              </div>
              <hr className="border-sky-200/20 border-dashed border-[1px] w-screen" />
            </div>
            <motion.div
              initial={{ opacity: 0, borderTop: "20px solid transparent" }}
              whileInView={{ opacity: 1, borderTop: "0px solid transparent" }}
              transition={{ duration: 0.5 }}
              id="description"
              className="max-w-[800px] w-full px-4 md:px-8 text-sky-100/90 leading-relaxed tracking-wide text-[1rem] md:text-lg flex flex-col gap-4"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-sky-200/90">
                Type. Race. Improve.
              </h2>

              <p>
                Welcome to the multiplayer typing arena. Race against friends or
                sharpen your skills solo with dynamic text and real-time
                feedback. Built with performance, precision, and speed in mind.
              </p>

              <p>
                Inspired by platforms like Ratatype, this site was designed to
                elevate your typing experience with real-time multiplayer
                support. Whether you prefer to type solo or challenge a friend,
                the fast and intuitive interface makes every keystroke count.
              </p>

              <p>
                Built using modern technologies —{" "}
                <span className="font-semibold text-sky-200/90">React</span>,{" "}
                <span className="font-semibold text-sky-200/90">Next.js</span>,{" "}
                <span className="font-semibold text-sky-200/90">
                  Tailwind CSS
                </span>
                ,{" "}
                <span className="font-semibold text-sky-200/90">
                  Framer Motion
                </span>
                , and{" "}
                <span className="font-semibold text-sky-200/90">Socket.io</span>{" "}
                — and powered by{" "}
                <span className="italic text-sky-200">Gemini AI</span> to serve
                fresh, unique text every time you visit.
              </p>
              <br />
              <br />
              <br />
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, borderTop: "20px solid transparent" }}
          whileInView={{ opacity: 1, borderTop: "0px solid transparent" }}
          transition={{ duration: 0.5 }}
        >
          <Footer />
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
