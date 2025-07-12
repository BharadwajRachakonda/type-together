"use client";
import { useEffect, useState, useRef } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  useSpring,
  LayoutGroup,
  AnimatePresence,
} from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faPlay } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/components/Loading";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const letterWidths: Record<string, number> = {
    a: 13,
    b: 14,
    c: 13,
    d: 14,
    e: 13,
    f: 8,
    g: 14,
    h: 14,
    i: 6,
    j: 6,
    k: 13,
    l: 6,
    m: 21,
    n: 14,
    o: 14,
    p: 14,
    q: 14,
    r: 8,
    s: 12,
    t: 9,
    u: 13,
    v: 13,
    w: 19,
    x: 13,
    y: 12,
    z: 13,
    A: 16,
    B: 16,
    C: 17,
    D: 16,
    E: 14,
    F: 14,
    G: 17,
    H: 17,
    I: 6,
    J: 14,
    K: 15,
    L: 13,
    M: 21,
    N: 18,
    O: 17,
    P: 15,
    Q: 17,
    R: 16,
    S: 14,
    T: 13,
    U: 17,
    V: 16,
    W: 22,
    X: 15,
    Y: 14,
    Z: 13,
    ".": 5,
    " ": 6,
    others: 5,
  };
  const [count, setCount] = useState(0);
  const timing = useMotionValue(count);
  const x = useTransform(timing, [0, 60], ["0%", "100%"]);
  const backgroundColor = useTransform(
    timing,
    [0, 30, 55, 60],
    ["#22c55e", "#eab308", "#ef4444", "#ef4444"]
  );
  const scaleX = useSpring(x, { stiffness: 300 });

  const [written, setWritten] = useState("");
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const scrollY = useMotionValue(0);
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const [end, setEnd] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timer, setTimer] = useState(60);
  const started = useRef(false);
  const lastScrollWordCount = useRef(0);
  const [loading, setLoading] = useState(false);

  let interval = useRef<NodeJS.Timeout | null>(null);
  const startTimer = () => {
    let __count = 0;
    interval.current = setInterval(() => {
      setTimer(60 - __count);
      __count++;
      setCount(__count);
      timing.set(__count);
      if (__count > 60) {
        if (interval.current) {
          clearInterval(interval.current);
        }
        setEnd(true);
      }
    }, 1000);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const initialText =
      "The quick brown fox jumps over the lazy dog is a well known pangram but typing isnt just about hitting every letter. Accuracy, consistency, and rhythm are just as important. As you type this sentence focus on reducing errors while maintaining a steady pace. Dont rush speed comes with practice. A great typist aims not only for speed but also for precision and clarity. Keep your hands in the correct position use all your fingers and glance at the screen not the keyboard. With enough dedication and daily effort youll notice your typing speed gradually improve without sacrificing accuracy.";
    setText(initialText);
    setDisplayText(initialText);
  }, []);

  useEffect(() => {
    if (written.length === 0 || text.length === 0) {
      setDisplayText(text);
      return;
    }

    if (written.length === 1) {
      startTimeRef.current = Date.now();
    }

    if (written.length <= text.length && !end) {
      endTimeRef.current = Date.now();
      setEnd(written.length === text.length);
    }

    const intervals: [number, boolean][] = [];
    let indexText = 0;
    let indexWritten = 0;
    let _prev = true;
    let wrong = 0;

    while (indexWritten < Math.min(written.length, text.length)) {
      if ((written[indexWritten] !== text[indexText]) === _prev) {
        intervals.push([indexText, written[indexWritten] !== text[indexText]]);
        _prev = !_prev;
      }
      wrong += written[indexWritten] !== text[indexText] ? 1 : 0;
      indexText++;
      indexWritten++;
    }

    const currText = text;
    let nextText = "";
    let prev: [number, boolean] = [0, true];
    for (let i of intervals) {
      let tag = `<span class="bg-red-500/50">`;
      if (i[1]) tag = `<span class="bg-green-500/50">`;
      nextText += `${tag}${currText.slice(prev[0], i[0])}</span>`;
      prev = [i[0], i[1]];
    }

    let finalTag = `<span class="bg-red-500/50">`;
    if (_prev) finalTag = `<span class="bg-green-500/50">`;
    nextText += `${finalTag}${currText.slice(prev[0], written.length)}</span>`;
    nextText += currText.slice(
      Math.min(written.length, currText.length),
      currText.length
    );

    setDisplayText(nextText);
    const wordCount = written.trim().split(/\s+/).filter(Boolean).length;
    setSpeed(() => wordCount);
    const index = written.length - 1;
    const lastCount = lastScrollWordCount.current;
    const containerWidth = document.getElementById("origin")?.clientWidth;

    if (containerWidth === undefined) return;
    if (written.length >= text.length - 30) {
      return;
    }
    if (text[index] !== " ") return;
    const remaining = text.slice(index + 1, text.length);
    const words = remaining.trim().split(/\s+/);
    const nextWord = words[0] || "";
    const currWords = text
      .slice(lastCount, index + 1)
      .trim()
      .split(/\s+/);
    let nextWordWidth = letterWidths[" "] ?? 6;
    for (const char of nextWord) {
      nextWordWidth += letterWidths[char] ?? letterWidths.others;
    }
    // let currentWord = words[0];
    let currentWordWidth = 0;

    for (const wrd of currWords) {
      for (const char of wrd) {
        currentWordWidth += letterWidths[char] ?? letterWidths.others;
      }
      currentWordWidth += letterWidths[" "] ?? 6;
    }
    if (currentWordWidth + nextWordWidth > containerWidth + 6) {
      const lineHeight = 32;
      scrollY.set(scrollY.get() - lineHeight);
      lastScrollWordCount.current = index;
    }

    // if (delta >= threshold) {
    //   const lineheight = 31.5;
    //   scrollY.set(scrollY.get() - lineheight);
    //   lastScrollWordCount.current = index;
    // }

    setAccuracy(Math.round(((written.length - wrong) / written.length) * 100));
  }, [written, text]);

  return (
    <div className="relative top-28 md:top-auto">
      <LayoutGroup>
        <motion.div layout>
          <Toaster position="top-left" />
          <motion.div
            layout
            style={{ filter: "blur(10px)", scaleX, backgroundColor }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-full h-2 fixed top-0 left-0 z-50 origin-left"
          ></motion.div>
          <motion.div
            layoutRoot
            initial={{ y: 50, filter: "blur(10px)" }}
            animate={{ y: 0, filter: "blur(0px)" }}
            transition={{ duration: 3, type: "spring", stiffness: 100 }}
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center max-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
          >
            <h1 className="text-4xl font-bold">Type Test</h1>

            <div className="flex flex-col items-center justify-center gap-4">
              <div>{timer} seconds remaining</div>
              <AnimatePresence mode="wait">
                <motion.div
                  layout
                  transition={{
                    duration: 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <div className="flex flex-col items-center p-9 max-w-[600px] h-60 brightness-150 bg-gray-900/65 glass backdrop-saturate-200 backdrop-brightness-200 backdrop-blur-md saturate-100 rounded-[50px]">
                    <div
                      id="origin"
                      className="max-w-[500px] h-40 overflow-hidden"
                    >
                      {loading ? (
                        <motion.div layout key="loading">
                          <Loading />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="static-text"
                          layout
                          id="static-text-container"
                          initial={{ y: 0 }}
                          animate={{ y: scrollY.get() }}
                          transition={{
                            ease: "easeInOut",
                            duration: 0.2,
                            delay: 0.2,
                          }}
                          className="prose text-2xl will-change-transform leading-8"
                          dangerouslySetInnerHTML={{ __html: displayText }}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className="cursor-pointer px-5 py-2 md:hover:scale-110 bg-gray-600/65 text-white rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:bg-gray-700 transition-all duration-200"
                        onClick={() => {
                          setWritten("");
                          setDisplayText(() => text);
                          setSpeed(0);
                          setAccuracy(0);
                          setEnd(false);
                          setTimer(60);
                          setCount(0);
                          timing.set(0);
                          started.current = false;
                          scrollY.set(0);
                          if (interval.current) {
                            clearInterval(interval.current);
                          }
                          lastScrollWordCount.current = 0;
                        }}
                      >
                        <FontAwesomeIcon icon={faRotateLeft} />
                      </div>
                      {!loading && !started.current && (
                        <label
                          htmlFor="text"
                          className="cursor-pointer px-5 py-2 md:hover:scale-110 bg-gray-600/65 text-white rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:bg-gray-700 transition-all duration-200"
                          onClick={async () => {
                            if (count <= 0) {
                              setLoading(true);
                              try {
                                const url = `${process.env.NEXT_PUBLIC_SOCKET_URL}gemini`;
                                console.log("Fetching text from:", url);
                                const res = await fetch(url, {
                                  method: "GET",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                });
                                if (!res.ok) {
                                  toast.error(
                                    "Failed to fetch text. Please try again."
                                  );
                                  return;
                                }
                                const data = await res.json();
                                if (!data.text) {
                                  toast.error(
                                    "No text received. Please try again."
                                  );
                                  return;
                                }
                                setText(data.text);
                                setDisplayText(data.text);
                              } catch (err) {
                                toast.error(
                                  "An error occurred while fetching text."
                                );
                              } finally {
                                setLoading(false);
                              }
                            }
                            toast.success(
                              count === 0
                                ? "Continue to Type"
                                : "Reset and Type"
                            );
                          }}
                        >
                          <LayoutGroup>
                            <motion.div layout>create</motion.div>
                          </LayoutGroup>
                        </label>
                      )}
                      <LayoutGroup>
                        {!loading && (
                          <motion.div
                            layout
                            onClick={() => {
                              document.getElementById("text")?.focus();
                              toast.success("Continue typing!");
                            }}
                            className="cursor-pointer px-5 py-2 md:hover:scale-110 bg-gray-600/65 text-white rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:bg-gray-700 transition-all duration-200"
                          >
                            <FontAwesomeIcon icon={faPlay} />
                          </motion.div>
                        )}
                      </LayoutGroup>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <textarea
                id="text"
                name="text"
                className="opacity-0"
                onChange={(e) => {
                  if (!end) {
                    setWritten(e.target.value);
                  }
                  if (!started.current && e.target.value.length > 0) {
                    started.current = true;
                    startTimer();
                  }
                }}
                value={written}
                disabled={end}
                onPaste={(e) => {
                  e.preventDefault();
                  alert("Pasting is not allowed.");
                }}
              ></textarea>

              <div className="flex items-center gap-8 my-4">
                <div className=" text-lg font-medium">
                  <span className="px-4 py-2 bg-gray-600/65 rounded-xl shadow-[0_4px_16px_rgba(255,255,255,0.10)] font-bold text-blue-400/50">
                    {speed}
                  </span>{" "}
                  WPM
                </div>
                <div className="text-lg font-medium">
                  <span className="px-4 py-2 bg-gray-600/65 rounded-xl shadow-[0_4px_16px_rgba(255,255,255,0.10)] font-bold text-blue-400/50">
                    {accuracy}
                  </span>
                  %
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </div>
  );
};

export default Page;
