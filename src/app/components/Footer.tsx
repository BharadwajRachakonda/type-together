import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faHackerrank,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  const isLightMode = false;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`max-w-[1000px] m-10 md:flex flex-row items-center p-10 mt-5 text-xs md:text-base transition-all duration-300 bg-gray-900/65 glass backdrop-saturate-200 backdrop-brightness-200 backdrop-blur-md saturate-100 rounded-[50px]`}
        id="Achievements"
      >
        <br />
        <div className="flex flex-col z-10">
          <h2 className="text-lg font-bold md:m-4">Contact</h2>
          <br />
          <ul className="md:font-bold m-0 py-5 flex items-center md:m-4 md:justify-around md:gap-10 flex-wrap gap-5 justify-around max-w-[1000px]">
            <li>
              <a
                target="_blank"
                href="https://www.linkedin.com/in/bharadwajrachakonda/"
              >
                <div
                  className={`max-w-40 transition-all rounded-xl flex justify-center items-center gap-1 md:gap-2 duration-150 ease-in-out p-2 md:w-auto w-full border-2 hover:scale-105 hover:tracking-widest group ${
                    isLightMode ? "border-black" : "border-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                  Linkedin
                </div>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://leetcode.com/BharadwajRachakonda/"
              >
                <div
                  className={`max-w-40 transition-all rounded-xl flex justify-center items-center gap-1 md:gap-2 duration-150 ease-in-out p-2 md:w-auto w-full border-2 hover:scale-105 hover:tracking-widest group ${
                    isLightMode ? "border-black" : "border-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faLaptopCode} />
                  LeetCode
                </div>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://www.hackerrank.com/profile/rbharadwaj022"
              >
                <div
                  className={`max-w-40 transition-all rounded-xl flex justify-center items-center gap-1 md:gap-2 duration-150 ease-in-out p-2 md:w-auto w-full border-2 hover:scale-105 hover:tracking-widest group ${
                    isLightMode ? "border-black" : "border-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faHackerrank} />
                  HackerRank
                </div>
              </a>
            </li>
            <li>
              <a target="_blank" href="https://github.com/BharadwajRachakonda">
                <div
                  className={`max-w-40 transition-all rounded-xl flex justify-center items-center gap-1 md:gap-2 duration-150 ease-in-out p-2 md:w-auto w-full border-2 hover:scale-105 hover:tracking-widest group ${
                    isLightMode ? "border-black" : "border-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faGithub} />
                  GitHub
                </div>
              </a>
            </li>
          </ul>
          <p
            className={`transition-all duration-300 ${
              isLightMode ? "text-white contrast-50" : "text-gray-400"
            }`}
          >
            This WebPage is{" "}
            <b>
              <strong>Designed and Developed</strong>
            </b>{" "}
            with 💝 by
            <b>
              <strong> Bharadwaj Rachakonda </strong>
            </b>{" "}
            and You are permitted to take reference but
            <b>
              <strong> please don't Copy Paste.</strong>
            </b>
          </p>
        </div>
      </div>
      <div className="min-h-30"> </div>
    </div>
  );
}

export default Footer;
