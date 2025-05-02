import  { useState } from "react";
import {
  useListsavedQuotesQuery,
  useRemoveSavedQuoteMutation,
  useClearSavedQuotesMutation,
} from "../../../data/api/postApi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type ModalState = {
  open: boolean;
  type: "single" | "all";
  postId?: string | null;
};

const SavedQuotes  = () => {
  const { data, isLoading, isError,refetch } = useListsavedQuotesQuery(undefined ,{refetchOnMountOrArgChange : true});
  const [removeSavedQuote] = useRemoveSavedQuoteMutation();
  const [clearSavedQuotes] = useClearSavedQuotesMutation();

  const [confirmModal, setConfirmModal] = useState<ModalState>({
    open: false,
    type: "single",
    postId: null,
  });

  const navigate = useNavigate()

  const handleRemove = async (postId: string) => {
    try {
      await removeSavedQuote({ postId });
      toast.success("Removed from saved");
    } catch {
      toast.error("Error removing quote");
    }
    refetch()
  };

  const handleClearAll = async () => {
    try {
      await clearSavedQuotes();
      toast.success("All saved quotes cleared");
    } catch {
      toast.error("Error clearing quotes");
    }
    refetch()
  };

  const confirmAction = async () => {
    if (confirmModal.type === "single" && confirmModal.postId) {
      await handleRemove(confirmModal.postId);
    } else if (confirmModal.type === "all") {
      await handleClearAll();
    }
    setConfirmModal({ open: false, type: "single", postId: null });
  };

  if (isLoading) return <div className="text-center text-gray-300">Loading saved quotes...</div>;

  if (isError || !data?.length)
    return (
      <div className="text-center text-gray-400 flex flex-col items-center justify-center gap-4 mt-20">
        <span className="text-6xl">📭</span>
        <p className="text-xl">You haven't saved any quotes yet.</p>
        <button
         onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Explore Quotes
        </button>
      </div>
    );
  

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Saved Quotes</h2>
        <button
          onClick={() => setConfirmModal({ open: true, type: "all" })}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {data.map((post: any) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-between"
            >
              <p className="text-lg text-gray-300 whitespace-pre-wrap break-words overflow-auto max-h-36 p-2 rounded-md custom-scrollbar">
                {post.text.length > 300 ? post.text.substring(0, 300) + "..." : post.text}
              </p>

              <div className="flex justify-between mt-3">
                <span className="text-green-400">👍 {post.likes}</span>
                <span className="text-red-400">👎 {post.dislikes}</span>
              </div>

              <div className="flex justify-end items-center mt-3">
                <button
                  title="Remove from saved"
                  onClick={() =>
                    setConfirmModal({ open: true, type: "single", postId: post._id })
                  }
                  className="text-red-500 hover:text-red-400 transition"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reusable Confirm Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 text-white rounded-xl p-6 w-full max-w-sm shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Confirm</h3>
            <p>
              {confirmModal.type === "all"
                ? "Are you sure you want to clear all saved quotes?"
                : "Are you sure you want to remove this quote from saved?"}
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setConfirmModal({ open: false, type: "single", postId: null })}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default SavedQuotes;
