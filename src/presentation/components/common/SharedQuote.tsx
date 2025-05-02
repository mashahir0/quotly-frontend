import { useState } from "react";
import { FaCopy, FaCheck, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const SharedQuote = ({ text,  likes, dislikes }: { text: string;  likes: number; dislikes: number }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${text}"`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative bg-[#2e1e9c] text-white max-w-sm sm:max-w-md mx-auto p-6 rounded-2xl shadow-xl border border-[#b09fff] transition-all hover:scale-[1.02] hover:shadow-2xl">
      {/* Quote Text */}
      <p className="text-lg font-medium text-[#ece6ff] italic text-center leading-relaxed break-words whitespace-pre-wrap">
        "{text}"
      </p>

    

      {/* Like & Dislike Count */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <div className="flex items-center text-green-400">
          <FaThumbsUp className="mr-1" /> {likes}
        </div>
        <div className="flex items-center text-red-400">
          <FaThumbsDown className="mr-1" /> {dislikes}
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 bg-[#3a2aaf] text-white p-2 rounded-full shadow-md hover:bg-[#4c3fd1] transition"
      >
        {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
      </button>
    </div>
  );
};

export default SharedQuote;
