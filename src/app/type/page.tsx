"use client";
import { useEffect, useState, useRef } from "react";

const Page = () => {
  const [written, setWritten] = useState("");
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const [end, setEnd] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timer, setTimer] = useState(60);
  const started = useRef(false);
  const startTimer = () => {
    let count = 0;
    const interval = setInterval(() => {
      setTimer(60 - count);
      count++;
      if (count > 60) {
        clearInterval(interval);
        setEnd(true);
      }
    }, 1000);
  };
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>Type Alone</p>
      <div>
        <div>{timer} seconds remaining</div>
        <div
          id="static-text-container"
          className="prose text-2xl"
          dangerouslySetInnerHTML={{ __html: displayText }}
        />
        <textarea
          className="mt-4 border border-gray-300 rounded p-2 w-full"
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
      </div>
      <div>
        Typing Speed: {speed} wpm Accuracy: {accuracy}%
      </div>
      <div
        className="cursor-pointer"
        onClick={() => {
          setWritten("");
          setDisplayText(() => text);
          setSpeed(0);
          setAccuracy(0);
          setEnd(false);
          setTimer(60);
          started.current = false;
        }}
      >
        Reset
      </div>
    </div>
  );
};

export default Page;
