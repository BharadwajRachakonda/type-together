import React from "react";

function Loading() {
  return (
    <div className="flex flex-col justify-center">
      <div className="bg-gray-400 animate-pulse h-8 md:w-96 w-48 rounded-full mb-2"></div>
      <div className="bg-gray-400 animate-pulse h-8 md:w-60 w-40 rounded-full mb-2 text-center text-black">
        Loading...
      </div>
      <div className="bg-gray-400 animate-pulse h-8 md:w-60 w-40 rounded-full"></div>
    </div>
  );
}

export default Loading;
