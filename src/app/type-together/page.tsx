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

function Page() {
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
  const [index, setIndex] = useState(0);
  const scrollY = useMotionValue(0);
  const [otherIndex, setOtherIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [startsIn, setStartsIn] = useState(3);
  const [time, setTime] = useState(60);
  const [end, setEnd] = useState(false);
  const [won, setWon] = useState<any>(null);
  const [isMedium, setIsMedium] = useState(false);

  useEffect(() => {
    setText(
      "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog is a well-known pangram, but typing isn't just about hitting every letter. Accuracy, consistency, and rhythm are just as important. As you type this sentence, focus on reducing errors while maintaining a steady pace. Don’t rush — speed comes with practice. A great typist aims not only for speed, but also for precision and clarity. Keep your hands in the correct position, use all your fingers, and glance at the screen, not the keyboard. With enough dedication and daily effort, you’ll notice your typing speed gradually improve without sacrificing accuracy."
    );
    setDisplayText(
      "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog is a well-known pangram, but typing isn't just about hitting every letter. Accuracy, consistency, and rhythm are just as important. As you type this sentence, focus on reducing errors while maintaining a steady pace. Don’t rush — speed comes with practice. A great typist aims not only for speed, but also for precision and clarity. Keep your hands in the correct position, use all your fingers, and glance at the screen, not the keyboard. With enough dedication and daily effort, you’ll notice your typing speed gradually improve without sacrificing accuracy."
    );
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
    const handler = () => {
      const width = document.getElementById("text")?.offsetWidth;
      console.log("Width:", width);
      const threshold = width !== undefined && width >= 200 ? 45 : 30;
      const prev = prevIndex.current;
      const delta = index - prev;

      if (Math.abs(delta) >= threshold) {
        const lineHeight = 32.5;
        scrollY.set(scrollY.get() - lineHeight);
        prevIndex.current = index;
      }
    };

    handler();
  }, [index, isMedium, scrollY]);

  useEffect(() => {
    if (started) {
      setWritten("");
      setIndex(0);
      setDisplayText(text);
      setWon(null);
      setEnd(false);
      scrollY.set(0);
      prevIndex.current = 0;
      let count = 60;
      let startIn = 3;
      socketRef.current?.emit("start");
      if (startIn > 0) {
        const interval = setInterval(() => {
          if (startIn <= 0) {
            const i = setInterval(() => {
              if (count === 60) {
                document.getElementById("text")?.focus();
              }
              if (count <= 1) {
                const element = document.getElementById("text");
                element?.blur();
                setEnd(true);
                clearInterval(i);
              }
              setTime(() => count);
              timing.set(timing.get() + 1);
              count--;
            }, 1000);
            clearInterval(interval);
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
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("receive-message", (msg) => {
      console.log("📩 Received:", msg);
      setMessage(msg);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socket.on("start", () => {
      setStarted(true);
    });

    socket.on("end", () => {
      setEnd(true);
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
    if (otherIndex > index) {
      return (
        "<span class='text-green-500/65'>" +
        text.slice(0, index + 1) +
        "</span>" +
        text.slice(index + 1, otherIndex) +
        "<span class='text-yellow-500/65 font-extrabold brightness-150 opacity-100 m-2'>" +
        text[otherIndex] +
        "</span>" +
        text.slice(otherIndex + 1)
      );
    } else if (otherIndex < index) {
      return (
        "<span class='text-green-500/65'>" +
        text.slice(0, otherIndex) +
        "<span class='text-yellow-500/65 font-extrabold brightness-150 opacity-100 m-2'>" +
        text[otherIndex] +
        "</span>" +
        text.slice(otherIndex + 1, index + 1) +
        "</span>" +
        text.slice(index + 1)
      );
    }
    return (
      "<span class='text-green-500/65'>" +
      text.slice(0, index + 1) +
      "</span>" +
      text.slice(index + 1)
    );
  };

  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    if (end) {
      const totalChars = written.length;
      const correctChars = index;
      const totalWords = text.slice(0, index).split(" ").length;

      setSpeed(() => totalWords);
      setAccuracy(Math.round((correctChars / totalChars) * 100 * 100) / 100);

      toast.success(
        `Speed: ${totalWords} WPM, Accuracy: ${
          Math.round((correctChars / totalChars) * 100 * 100) / 100
        }%`
      );
    }
  }, [end]);

  return (
    <div>
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
        transition={{ duration: 3, type: "spring", stiffness: 200 }}
        className="flex flex-col items-center justify-center text-center min-h-screen gap-10"
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
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center justify-center gap-10">
                      <h1 className="text-4xl font-bold">Type Together</h1>

                      <input
                        className="font-extrabold text-6xl border-gray-500/40 border-2 bg-gray-900/65 max-w-70 tracking-widest px-4 py-2 text-center rounded-3xl text-gray-500 focus:shadow-[0_35px_60px_-15px_rgba(255,255,255,0.3)] focus:outline-none focus:border-gray-900/65 transition-all duration-300 ease-in-out"
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
                      className={`mb-10 <md:mb-0></md:mb-0> flex flex-col items-center p-9 h-60 bg-gray-900/65 glass backdrop-saturate-200 backdrop-brightness-200 backdrop-blur-md saturate-100 rounded-[50px] max-w-[600px]`}
                    >
                      <div className="min-w-auto md:min-w-[500px] max-w-[500px] h-40 overflow-hidden">
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
                          className="text-left prose text-2xl will-change-transform"
                          dangerouslySetInnerHTML={{ __html: displayText }}
                        />
                      </div>
                      <textarea
                        name="text"
                        id="text"
                        className="opacity-0 h-0"
                        onFocus={() => {
                          setStarted(true);
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" ||
                            e.key === "Delete" ||
                            e.ctrlKey ||
                            e.metaKey ||
                            startsIn > 0
                          ) {
                            e.preventDefault();
                          } else {
                            if (e.key === text[index]) {
                              setIndex((prev) => prev + 1);
                              const nextText = getNext(text, index, otherIndex);
                              setDisplayText(() => nextText);
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
                                "<span class='text-red-500/65'>" +
                                text[index] +
                                "</span>" +
                                text.slice(index + 1);
                              setTimeout(() => {
                                setDisplayText(() => tempText);
                              }, 100);
                              setDisplayText(() => currText);
                            }
                          }
                        }}
                        autoComplete="off"
                        value={written}
                        onChange={(e) => {
                          setWritten(e.target.value);
                        }}
                      ></textarea>
                      <div className="flex items-center justify-between gap-4">
                        <label
                          htmlFor="text"
                          className="flex justify-center items-center slide cursor-pointer px-5 py-2 md:hover:scale-110 text-white rounded-full bg-gray-700/65 transition-all duration-200 ease-out"
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
        </motion.div>
        <AnimatePresence mode="wait">
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
          {!isMedium && end && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{
                ease: "easeInOut",
                duration: 0.2,
              }}
              className="fixed left-0 top-0 right-0"
            >
              {won && <p className="text-white">You won! 🎉</p>}
              {!won && <p className="text-white">You lost! 😢</p>}
              <span className="text-xl font-extrabold text-white">
                {speed} WPM
              </span>
              <span className="text-xl text-white ml-4">{accuracy}% Acc</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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
