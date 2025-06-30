"use client";
import {
  motion,
  useMotionValue,
  LayoutGroup,
  AnimatePresence,
} from "framer-motion";
import { use, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";

const Page = () => {
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

  const [displayText, setDisplayText] = useState(
    "The quick brown fox jumps over the lazy dog. “The quick brown fox jumps over the lazy dog” is a well-known pangram, but typing isn't just about hitting every letter. Accuracy, consistency, and rhythm are just as important. As you type this sentence, focus on reducing errors while maintaining a steady pace. Don’t rush — speed comes with practice. A great typist aims not only for speed, but also for precision and clarity. Keep your hands in the correct position, use all your fingers, and glance at the screen, not the keyboard. With enough dedication and daily effort, you’ll notice your typing speed gradually improve without sacrificing accuracy."
  );
  const scrollY = useMotionValue(0);

  const [isMedium, setIsMedium] = useState(false);
  const [message, setMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const [isSet, setIsSet] = useState<boolean>(false);

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
  };

  const sendMessage = (msg: string) => {
    if (socketRef.current) {
      socketRef.current.emit("send-message", msg, callback);
    }
  };

  const joinRoom = (room: string) => {
    if (socketRef.current) {
      socketRef.current.emit("leave-room", callback);
      socketRef.current.emit("join-room", room, callback);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      autoConnect: false,
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

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center h-screen">
      <motion.div
        layoutRoot
        initial={{ filter: "blur(10px)", y: 50 }}
        animate={{ filter: "blur(0px)", y: 0 }}
        transition={{ duration: 3, type: "spring", stiffness: 200 }}
        className="flex flex-col items-center justify-center gap-10"
      >
        <Toaster />
        <AnimatePresence>
          <motion.div
            layout
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col md:flex-row items-center justify-center md:gap-10 gap-4"
          >
            <LayoutGroup>
              <motion.form
                layoutRoot
                className="flex flex-col items-center justify-center gap-10"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const room = form.room.value as string;
                  setIsSet(true);
                  if (room) {
                    joinRoom(room);
                    sendMessage(`Joined room ${room}!`);
                  }
                }}
              >
                <h1 className="text-4xl font-bold">Type Together</h1>

                <input
                  className="font-extrabold text-6xl border-gray-500/40 border-2 bg-gray-900/65 max-w-70 tracking-widest px-4 py-2 text-center rounded-3xl text-gray-500 focus:shadow-[0_35px_60px_-15px_rgba(255,255,255,0.3)] focus:outline-none focus:border-gray-900/65 transition-all duration-300 ease-in-out"
                  maxLength={4}
                  minLength={4}
                  type="text"
                  placeholder="0000"
                  name="room"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="md:slide block cursor-pointer px-5 py-2 md:hover:scale-110 text-white rounded-full bg-gray-700/65 transition-all duration-200 ease-out"
                >
                  Join Room
                </button>
              </motion.form>

              {isSet && (
                <motion.div
                  layout
                  initial={"initial"}
                  animate={"animate"}
                  variants={isMedium ? varients.medium : varients.small}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  exit={{ opacity: 0, height: 0 }}
                  layoutRoot
                  className={`flex flex-col items-center p-9 h-60 bg-gray-900/65 glass backdrop-saturate-200 backdrop-brightness-200 backdrop-blur-md saturate-100 rounded-[50px] max-w-[600px]`}
                >
                  <div className="max-w-[500px] h-40 overflow-hidden">
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
                      className="prose text-2xl will-change-transform"
                      dangerouslySetInnerHTML={{ __html: displayText }}
                    />
                  </div>
                  {/* <div className="flex items-center gap-4">
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
              </div> */}
                </motion.div>
              )}
            </LayoutGroup>
          </motion.div>
        </AnimatePresence>

        <div>
          <p className="text-2xl text-center text-white">{message}</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          {/* <div
            onClick={() => {
              const msg = prompt("Enter your message:");
              if (msg) {
                sendMessage(msg);
              }
            }}
          >
            Send Message
          </div> */}
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
