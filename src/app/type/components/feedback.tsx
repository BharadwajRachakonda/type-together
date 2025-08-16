import React, { useState } from "react";
import toast from "react-hot-toast";

function FeedbackToast({ email, toastId }: { email: string; toastId: string }) {
  const [Data, setData] = useState({
    email: email,
    description: "",
    type: "", // can take 3 values error, general, recommendation
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!process.env.NEXT_PUBLIC_SNOW) {
      toast.error("Snow API not configured");
      return;
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SNOW, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to submit feedback");
      }

      toast.success("Thank you! 😊 - Made by Bharadwaj");
      toast.dismiss(toastId);
      setData({ ...Data, description: "" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 glass bg-gray-700 rounded-lg shadow-md flex flex-col gap-2 w-80"
    >
      <textarea
        name="description"
        placeholder="Leave your feedback here..."
        value={Data.description}
        onChange={(e) => setData({ ...Data, description: e.target.value })}
        className="border rounded-full p-2 w-full resize-none"
        rows={1}
      />
      <select
        name="Type"
        id="Type"
        value={Data.Type}
        onChange={(e) => setData({ ...Data, Type: e.target.value })}
        className="border rounded-full p-2 w-full"
      >
        <option value="general" className="text-black">
          General
        </option>
        <option value="error" className="text-black">
          Error
        </option>
        <option value="recommendation" className="text-black">
          Recommendation
        </option>
      </select>

      <div className="flex justify-around">
        <button
          type="submit"
          className="p-2 cursor-pointer rounded-full bg-gray-700/75 shadow-2xl shadow-white hover:bg-gray-800/80 transition-colors"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => toast.dismiss(toastId)}
          className="p-2 cursor-pointer rounded-full bg-gray-700/75 shadow-2xl shadow-white hover:bg-gray-800/80 transition-colors"
        >
          Close
        </button>
      </div>
    </form>
  );
}

export function openFeedbackToast(email: string) {
  toast.custom((t) => <FeedbackToast email={email} toastId={t.id} />, {
    id: "feedback-toast",
    duration: Infinity,
    position: "bottom-center",
  });
}
