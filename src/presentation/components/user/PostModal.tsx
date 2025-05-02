

import { motion } from "framer-motion";
import { FaTimes, FaBookmark, FaCopy } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import toast from "react-hot-toast";
import {  useGetSavedQuotesQuery, useRemoveSavedQuoteMutation, useSaveQuoteMutation } from "../../../data/api/postApi";


const PostModal = ({ post, onClose }: { post: any; onClose: () => void }) => {
  const [saveQuote] = useSaveQuoteMutation();
  const [removeQuote] = useRemoveSavedQuoteMutation();
  const {data : savedQuotes , isError , isLoading,refetch} =useGetSavedQuotesQuery()
  const isSaved = savedQuotes?.quotes?.includes(post._id);

  const handleSavePost = async () => {
    if (isSaved) {
      await removeQuote({postId: post._id });
      toast.success("Removed from saved posts!");
    } else {
      await saveQuote({ postId: post._id });
      toast.success("Saved successfully!");
    }
    refetch()
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(post.text);
      toast.success("📋 Post text copied!");
    } catch (error) {
      toast.error("❌ Failed to copy text!");
      console.error("Copy Error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
    >
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl w-full text-white relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
          <FaTimes size={20} />
        </button>

        {/* Profile Section */}
        <div className="flex items-center gap-3 mb-3">
          {post.userId?.photo ? (
            <img src={post.userId?.photo} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-gray-500" />
          ) : (
            <MdAccountCircle className="text-white w-12 h-12" />
          )}
          <h3 className="text-lg font-bold">{post.userId?.name}</h3>
        </div>

        {/* Post Content */}
        <div className="max-h-96 overflow-y-auto p-3 text-gray-300 whitespace-pre-wrap break-words custom-scrollbar relative">
          {post.text}
        </div>

        {/* Save & Close Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleSavePost}
            className={`flex items-center gap-2 px-3 py-2 rounded-md ${
              isSaved ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            <FaBookmark size={18} /> {isSaved ? "Saved" : "Save Post"}
          </button>
          <button
            onClick={handleCopyText}
            className=" bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition"
            title="Copy Post Text"
          >
            <FaCopy size={18} />
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 px-3 py-2 rounded-md text-white hover:bg-red-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostModal;
