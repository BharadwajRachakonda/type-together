"use client";
import {
  motion,
  useMotionValue,
  LayoutGroup,
  AnimatePresence,
  useTransform,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState, Suspense } from "react";
import { io, Socket } from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import Loading from "@/app/components/Loading";
import { s } from "motion/react-client";

function Page() {
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
  const timing = useMotionValue(0);
  const x = useTransform(timing, [0, 60], ["0%", "100%"]);
  const prevIndex = useRef(0);
  const backgroundColor = useTransform(
    timing,
    [0, 30, 55, 60],
    ["#22c55e", "#eab308", "#ef4444", "#ef4444"]
  );
  const scaleX = useSpring(x, { stiffness: 300 });
  const [displayText, setDisplayText] = useState("");
  const [text, setText] = useState("");
  const [written, setWritten] = useState("");
  const [index, setIndex] = useState(-1);
  const scrollY = useMotionValue(0);
  const [otherIndex, setOtherIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [startsIn, setStartsIn] = useState(3);
  const [time, setTime] = useState(60);
  const [end, setEnd] = useState(false);
  const [won, setWon] = useState<any>(null);
  const [isMedium, setIsMedium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mainTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setText(
      "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog is a well-known pangram, but typing isn't just about hitting every letter. Accuracy, consistency, and rhythm are just as important. As you type this sentence, focus on reducing errors while maintaining a steady pace. Don’t rush — speed comes with practice. A great typist aims not only for speed, but also for precision and clarity. Keep your hands in the correct position, use all your fingers, and glance at the screen, not the keyboard. With enough dedication and daily effort, you’ll notice your typing speed gradually improve without sacrificing accuracy."
    );
    setDisplayText(
      "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog is a well-known pangram, but typing isn't just about hitting every letter. Accuracy, consistency, and rhythm are just as important. As you type this sentence, focus on reducing errors while maintaining a steady pace. Don’t rush — speed comes with practice. A great typist aims not only for speed, but also for precision and clarity. Keep your hands in the correct position, use all your fingers, and glance at the screen, not the keyboard. With enough dedication and daily effort, you’ll notice your typing speed gradually improve without sacrificing accuracy."
    );
    return () => {
      if (startIntervalRef.current) {
        clearInterval(startIntervalRef.current);
      }
      if (mainTimerRef.current) {
        clearInterval(mainTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (end) {
      if (index >= otherIndex) {
        setWon(true);
      }
      setStarted(false);
      setTime(60);
      setStartsIn(3);
      setOtherIndex(0);
      timing.set(0);
      scrollY.set(0);
      socketRef.current?.emit("end");
    }
  }, [end]);

  useEffect(() => {
    if (isLoading) {
      socketRef.current?.emit("loading");
    }
  }, [isLoading]);

  useEffect(() => {
    const handler = () => {
      const containerWidth = document.getElementById("origin")?.clientWidth;
      console.log("Width:", containerWidth);
      const lastCount = prevIndex.current;
      if (containerWidth === undefined) return;
      if (text.length - index <= 30) return;
      if (text[index] != " ") return;
      const remaining = text.slice(index + 1);
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

      let currentWordWidth = 0;
      for (const wrd of currWords) {
        for (const char of wrd) {
          currentWordWidth += letterWidths[char] ?? letterWidths.others;
        }
        currentWordWidth += letterWidths[" "] ?? 6;
      }

      // console.log(currentWordWidth + nextWordWidth);

      if (currentWordWidth + nextWordWidth > containerWidth + 6) {
        const lineHeight = 32;
        scrollY.set(scrollY.get() - lineHeight);
        // console.log(
        //   "Scrolling down by line height:",
        //   lineHeight,
        //   scrollY.get()
        // );
        prevIndex.current = index;
      }
    };
    handler();
  }, [index]);

  useEffect(() => {
    if (isLoading) {
      if (startIntervalRef.current) {
        clearInterval(startIntervalRef.current);
        startIntervalRef.current = null;
      }
      if (mainTimerRef.current) {
        clearInterval(mainTimerRef.current);
        mainTimerRef.current = null;
      }
      setStarted(false);
      setEnd(false);
      setWon(null);
      setTime(60);
      timing.set(0);
      scrollY.set(0);
      setStartsIn(3);
      console.log("🧹 Cleared intervals due to loading");
    }
  }, [isLoading]);

  useEffect(() => {
    if (started) {
      if (isLoading) {
        console.log("🚫 Not starting intervals because loading is true");
        return;
      }
      setWritten("");
      setIndex(0);
      setDisplayText(text);
      setWon(null);
      setEnd(false);
      scrollY.set(0);
      timing.set(0);
      setTime(60);
      prevIndex.current = 0;
      let count = 60;
      let startIn = 3;
      socketRef.current?.emit("start");
      if (startIn > 0) {
        startIntervalRef.current = setInterval(() => {
          if (startIn <= 0) {
            mainTimerRef.current = setInterval(() => {
              if (count === 60) {
                document.getElementById("text")?.focus();
              }
              if (count <= 1) {
                const element = document.getElementById("text");
                element?.blur();
                setEnd(true);
                mainTimerRef.current && clearInterval(mainTimerRef.current);
              }
              setTime(() => count);
              timing.set(timing.get() + 1);
              count--;
            }, 1000);
            startIntervalRef.current && clearInterval(startIntervalRef.current);
          }
          startIn--;
          setStartsIn(() => startIn);
        }, 1000);
      }
    }
  }, [started]);

  useEffect(() => {
    if (otherIndex && otherIndex !== index) {
      const nextText = getNext(text, index, otherIndex);
      setDisplayText(() => nextText);
    }
  }, [otherIndex]);

  useEffect(() => {
    sendMessage(`${index}`);
  }, [index]);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [isSet, setIsSet] = useState<boolean>(false);

  const varients = {
    small: {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: 240 },
    },
    medium: {
      initial: { opacity: 0, width: 0 },
      animate: { opacity: 1, width: 600 },
    },
  };

  const [message, setMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    setOtherIndex(message ? parseInt(message, 10) : 0);
  }, [message]);

  useEffect(() => {
    const handleResize = () => {
      setIsMedium(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const callback = (res: any) => {
    if (res.error) {
      toast.error(res.error);
    }
    return res;
  };

  const callbackjoinroom = (res: any) => {
    if (res.error) {
      toast.error(res.error);
      setIsSet(false);
      setEnd(false);
      setIndex(0);
    }
    if (res.success) {
      toast.success(res.success);
      setIsSet(true);
    }
    return res;
  };

  const sendMessage = (msg: string) => {
    if (socketRef.current) {
      socketRef.current.emit("send-message", msg, callback);
    }
  };

  const joinRoom = (room: string) => {
    if (socketRef.current) {
      console.log("Joining room:", room);
      socketRef.current.emit("leave-room", callback);
      socketRef.current.emit("join-room", room, callbackjoinroom);
    }
  };

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    // console.log("Connecting to socket at:", url);
    const socket = io(url, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.connect();

    socket.on("connect", () => {
      // console.log("✅ Connected:", socket.id);
    });

    socket.on("receive-message", (msg) => {
      // console.log("📩 Received:", msg);
      setMessage(msg);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socket.on("loading", () => {
      setStarted(() => false);
      setEnd(() => false);
      setWritten(() => "");
      setIsLoading(() => true);
      console.log("Loading...");
    });

    socket.on("start", () => {
      setStarted(() => true);
    });

    socket.on("done-loading", () => {
      setIsLoading(() => false);
      console.log("Done loading");
    });

    socket.on("end", () => {
      setEnd(() => true);
    });

    socket.on("text-update", (data) => {
      // console.log("Text updated:", data);
      setText(data.text);
      setDisplayText(data.text);
      setStarted(true);
      setIsLoading(false);
      socketRef.current?.emit("done-loading");
      toast.success(data.success);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (searchParams.has("room")) {
      const room = searchParams.get("room");
      console.log("Joining room:", room);
      if (room) {
        (document.getElementById("room") as HTMLInputElement).value = room;
        console.log("Joining room from search params:", room);
        joinRoom(room);
      }
    }
  }, []);

  const copyURL = () => {
    const URL = window.location.href;
    navigator.clipboard.writeText(URL).then(() => {
      toast.success("URL copied to clipboard!");
    });
  };

  const getNext = (text: string, index: number, otherIndex: number): string => {
    const greenClass = "text-green-500/65";
    const blueClass =
      "<span class='border-l-2 border-l-sky-500/65 animate-ping'></span><span class='text-sky-300/65'>";
    const grayClass =
      "text-gray-700 bg-gray-100/65 rounded-sm brightness-150 opacity-100";

    const useGray = otherIndex !== index;
    if ((index === 0 && written === "") || index < 0) {
      return `${blueClass}${text[0]}</span>` + text.slice(1);
    } else if (index === 0) {
      return (
        `<span class='${greenClass}'>${text[0]}</span>` +
        `${blueClass}${text[1]}</span>` +
        text.slice(2)
      );
    }

    return text
      .split("")
      .map((ch, i) => {
        if (useGray && i === otherIndex && i !== index + 1) {
          return `<span class='${grayClass}'>${ch}</span>`;
        } else if (i <= index) {
          return `<span class='${greenClass}'>${ch}</span>`;
        } else if (i === index + 1) {
          return `${blueClass}${ch}</span>`;
        }
        return ch;
      })
      .join("");
  };

  useEffect(() => {
    setDisplayText(() => getNext(text, index - 1, otherIndex));
  }, [text, index, otherIndex]);

  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    if (end) {
      const correctChars = index;
      const totalWords = text.slice(0, index).split(" ").length;

      setSpeed(() => totalWords);
      setAccuracy(Math.round((correctChars / written.length) * 100));

      toast.success(
        `Speed: ${totalWords} WPM, Accuracy: ${Math.round(
          (correctChars / written.length) * 100
        )}%`
      );
    }
  }, [end]);

  return (
    <div className="overflow-hidden max-h-screen">
      <Toaster position="top-left" />
      <motion.div
        layout
        style={{ filter: "blur(10px)", scaleX, backgroundColor }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-full h-2 fixed top-0 left-0 z-50 origin-left"
      ></motion.div>
      <motion.div
        layoutRoot
        initial={{ filter: "blur(10px)", y: 50 }}
        animate={{ filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
        className="flex flex-col h-screen items-center justify-center text-center gap-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            layout
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col px-4 md:px-0 items-center justify-center gap-10"
          >
            <LayoutGroup>
              <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-10 w-screen">
                <motion.form
                  layoutRoot
                  className="pl-2 flex flex-col items-center justify-center gap-10"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const room = form.room.value as string;
                    const urlParams = new URLSearchParams(
                      searchParams.toString()
                    );
                    if (room) {
                      joinRoom(room);
                      if (urlParams.has("room")) {
                        urlParams.delete("room");
                      }
                      urlParams.set("room", room);
                      replace(`${pathname}?${urlParams.toString()}`);
                    }
                  }}
                >
                  <div className="flex items-center mt-7 md:mt-auto justify-center gap-4">
                    <div className="flex flex-col items-center justify-center gap-10">
                      <h1 className="text-4xl font-bold min-h-20 md:min-h-auto">
                        <p className="md:block hidden">Type Together</p>
                      </h1>
                      <input
                        className="z-10 font-extrabold text-6xl border-gray-500/40 border-2 bg-gray-900/65 max-w-70 tracking-widest px-4 py-2 text-center rounded-3xl text-gray-500 focus:shadow-[0_35px_60px_-15px_rgba(255,255,255,0.3)] focus:outline-none focus:border-gray-900/65 transition-all duration-300 ease-in-out"
                        maxLength={4}
                        minLength={4}
                        type="text"
                        placeholder="0000"
                        name="room"
                        autoComplete="off"
                        id="room"
                      />

                      <button
                        type="submit"
                        className="slide block cursor-pointer px-5 py-2 md:hover:scale-110 text-white rounded-full bg-gray-700/65 transition-all duration-200 ease-out"
                      >
                        Join Room
                      </button>
                    </div>
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        duration: 0.2,
                        type: "spring",
                        stiffness: 300,
                      }}
                      onClick={() => copyURL()}
                      className="inline-block cursor-pointer p-2 md:m-8 font-extrabold border-gray-500/40 border-2 bg-gray-900/65 text-center rounded-2xl text-gray-500"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </motion.div>
                  </div>
                </motion.form>
                <AnimatePresence mode="wait">
                  {!isMedium && end && (
                    <div>
                      {won && <p>You won! 🎉</p>}
                      {!won && <p>You lost! 😢</p>}
                      <span className="text-xl font-extrabold text-white">
                        {speed} WPM
                      </span>
                      <span className="text-xl text-white ml-4">
                        {accuracy}% Acc
                      </span>
                    </div>
                  )}
                </AnimatePresence>
                {isSet && (
                  <>
                    <motion.div
                      layout
                      initial={"initial"}
                      animate={"animate"}
                      variants={isMedium ? varients.medium : varients.small}
                      transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100,
                      }}
                      exit={{ opacity: 0, height: 0 }}
                      layoutRoot
                      className={`mb-10 <md:mb-0></md:mb-0> flex flex-col items-center p-9 brightness-150 m-4 h-60 bg-gray-900/65 glass backdrop-saturate-200 backdrop-brightness-200 backdrop-blur-md saturate-100 rounded-[50px] max-w-[600px]`}
                    >
                      <div
                        id="origin"
                        className="min-w-auto md:min-w-[500px] max-w-[500px] h-40 overflow-hidden"
                      >
                        {isLoading && <Loading />}
                        {!isLoading && (
                          <motion.div
                            layout
                            id="static-text-container"
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: scrollY.get(), opacity: 0.5 }}
                            transition={{
                              ease: "easeInOut",
                              duration: 0.2,
                              delay: 0.2,
                            }}
                            className="text-left prose text-2xl will-change-transform leading-8"
                            dangerouslySetInnerHTML={{
                              __html: displayText,
                            }}
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <label
                          htmlFor="text"
                          className="flex justify-center items-center slide cursor-pointer px-5 py-2 md:hover:scale-110 text-white rounded-full bg-gray-700/65 transition-all duration-200 ease-out"
                          onClick={() => {
                            if (isLoading) return;
                            if (started) return;
                            document.getElementById("text")?.focus();
                            setIsLoading(true);
                            socketRef.current?.emit("set-text", (data: any) => {
                              if (data.error) {
                                setIsLoading(false);
                                socketRef.current?.emit("done-loading");
                                return toast.error(data.error);
                              }
                            });
                          }}
                        >
                          <div>Start</div>
                        </label>
                        <div className="min-w-10 inline-block">
                          <motion.span className="inline-block" layout>
                            <AnimatePresence mode="wait">
                              <motion.span
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                transition={{
                                  ease: "easeInOut",
                                  duration: 0.2,
                                }}
                                className="inline-block"
                                key={time}
                              >
                                {time}
                              </motion.span>
                            </AnimatePresence>
                          </motion.span>
                          <span>s</span>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </LayoutGroup>
          </motion.div>
        </AnimatePresence>
        <motion.div layout>
          <AnimatePresence mode="wait">
            {started && startsIn > 0 && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.2,
                }}
                key={startsIn}
                className="flex justify-center items-center text-9xl fixed top-0 left-0 right-0 h-screen backdrop-blur-[100px] backdrop-brightness-125 backdrop-saturate-150"
              >
                {startsIn}
              </motion.div>
            )}
          </AnimatePresence>
          {isMedium && end && (
            <div>
              {won && <p>You won! 🎉</p>}
              {!won && <p>You lost! 😢</p>}
              <span className="text-xl font-extrabold text-white">
                {speed} WPM
              </span>
              <span className="text-xl text-white ml-4">{accuracy}% Acc</span>
            </div>
          )}
        </motion.div>
      </motion.div>
      {isSet && isMedium && (
        <textarea
          name="text"
          id="text"
          className="absolute top-0 opacity-0 -z-50"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          onPaste={(e) => {
            e.preventDefault();
          }}
          onCut={(e) => {
            e.preventDefault();
          }}
          onCopy={(e) => {
            e.preventDefault();
          }}
          onSelect={(e) => {
            e.preventDefault();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" || e.key === "Delete" || startsIn > 0) {
              e.preventDefault();
            } else {
              if (e.key === text[index]) {
                setWritten((prev) => {
                  prev += e.key;
                  return prev;
                });
                setIndex((prev) => prev + 1);
              } else {
                if (/^[\x20-\x7E]$/.test(e.key)) {
                  setWritten((prev) => {
                    prev += e.key;
                    return prev;
                  });
                  const currText =
                    "<span class='text-green-500/65'>" +
                    text.slice(0, index) +
                    "</span>" +
                    text.slice(index);
                  const tempText =
                    "<span class='text-green-500/65'>" +
                    text.slice(0, index) +
                    "</span>" +
                    "<span class='text-gray-700 border-l-2 border-l-red-500/65 bg-red-500/65 animate-pulse rounded-sm'>" +
                    text[index] +
                    "</span>" +
                    text.slice(index + 1);
                  setDisplayText(() => tempText);
                }
              }
            }
          }}
          onChange={(e) => {
            return;
          }}
          autoFocus
          value={written}
        ></textarea>
      )}
      {isSet && !isMedium && (
        <textarea
          name="text"
          id="text"
          className="absolute bottom-0 left-0 opacity-0 -z-50"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          autoFocus
          value={written}
          onPaste={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onSelect={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (startsIn > 0) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const input = e.target.value;
            if (startsIn > 0) {
              return setWritten("");
            }
            if (input.length > written.length) {
              const newChar = input[input.length - 1];

              if (newChar === text[index]) {
                const newIndex = index + 1;
                setIndex(newIndex);
              } else {
                const currText =
                  "<span class='text-green-500/65'>" +
                  text.slice(0, index) +
                  "</span>" +
                  text.slice(index);
                const tempText =
                  "<span class='text-green-500/65'>" +
                  text.slice(0, index) +
                  "</span>" +
                  "<span class='text-gray-700 border-l-2 border-l-red-500/65 bg-red-500/65 animate-pulse rounded-sm'>" +
                  text[index] +
                  "</span>" +
                  text.slice(index + 1);
                setDisplayText(currText);
                setTimeout(() => {
                  setDisplayText(tempText);
                }, 100);
              }
            }
            setWritten(input);
          }}
        ></textarea>
      )}
    </div>
  );
}

function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
}

export default PageWrapper;
