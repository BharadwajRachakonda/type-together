"use client";
import { useEffect, useState, useRef } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  useSpring,
  LayoutGroup,
} from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateLeft,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
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
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollY = useMotionValue(0);
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const [end, setEnd] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timer, setTimer] = useState(60);
  const started = useRef(false);
  const lastScrollWordCount = useRef(0);

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
      "The quick brown fox jumps over the lazy dog” is a well-known pangram, but typing isn't just about hitting every letter. Accuracy, consistency, and rhythm are just as important. As you type this sentence, focus on reducing errors while maintaining a steady pace. Don’t rush — speed comes with practice. A great typist aims not only for speed, but also for precision and clarity. Keep your hands in the correct position, use all your fingers, and glance at the screen, not the keyboard. With enough dedication and daily effort, you’ll notice your typing speed gradually improve without sacrificing accuracy.";
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

    // Scroll after every 9 words typed
    const wordCount = written.trim().split(/\s+/).filter(Boolean).length;
    const lastCount = lastScrollWordCount.current;
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    const scrollWordThreshold = isMobile ? 5 : 10;
    if (wordCount - lastCount >= scrollWordThreshold) {
      const newOffset = scrollOffset - 36; // adjust as per line height
      scrollY.set(newOffset);
      setScrollOffset(newOffset);
      lastScrollWordCount.current = wordCount;
    }

    // Calculate speed
    if (startTimeRef.current) {
      const endTime = endTimeRef.current ?? Date.now();
      const durationMin = (endTime - startTimeRef.current) / 1000 / 60;
      const wordCount = written.trim().split(/\s+/).filter(Boolean).length;

      if (durationMin > 0) {
        const currentWPM = Math.round(wordCount / durationMin);
        const alpha = 0.3;

        setSpeed((prevSpeed) =>
          Math.round(alpha * currentWPM + (1 - alpha) * prevSpeed)
        );
      } else {
        setSpeed(0);
      }
    }

    setAccuracy(Math.round(((written.length - wrong) / written.length) * 100));
    setDisplayText(nextText);
  }, [written, text]);

  return (
    <motion.div
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
    >
      <Toaster position="top-left" />
      <motion.div
        layout
        style={{ filter: "blur(10px)", scaleX, backgroundColor }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-full h-2 fixed top-0 left-0 z-50 origin-left"
      ></motion.div>
      <motion.div
        layoutRoot
        initial={{ filter: "blur(10px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{ duration: 3, type: "spring", stiffness: 300 }}
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center max-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      >
        <h1 className="text-4xl font-bold">Type Test</h1>

        <div className="flex flex-col items-center justify-center gap-4">
          <div>{timer} seconds remaining</div>
          <div className="flex flex-col items-center p-9 max-w-[600px] h-60 bg-gray-900/65 glass backdrop-saturate-200 backdrop-brightness-200 backdrop-blur-md saturate-100 rounded-[50px]">
            <div className="max-w-[500px] h-40 overflow-hidden">
              <motion.div
                id="static-text-container"
                initial={{ y: 0 }}
                animate={{ y: scrollY.get() }}
                transition={{ ease: "easeInOut", duration: 0.2, delay: 0.2 }}
                className="prose text-2xl will-change-transform"
                dangerouslySetInnerHTML={{ __html: displayText }}
              />
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
                  setScrollOffset(0);
                  if (interval.current) {
                    clearInterval(interval.current);
                  }
                  lastScrollWordCount.current = 0;
                }}
              >
                <FontAwesomeIcon icon={faRotateLeft} />
              </div>
              <label
                htmlFor="text"
                className="cursor-pointer px-5 py-2 md:hover:scale-110 bg-gray-600/65 text-white rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:bg-gray-700 transition-all duration-200"
                onClick={() => {
                  const text =
                    count === 0 ? "Continue to Type" : "Reset and Type";
                  toast.success(text);
                }}
              >
                <LayoutGroup>
                  <motion.div layout>
                    {count !== 0 && <FontAwesomeIcon icon={faPause} />}
                    {count === 0 && <FontAwesomeIcon icon={faPlay} />}
                  </motion.div>
                </LayoutGroup>
              </label>
            </div>
          </div>
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
  );
};

export default Page;
