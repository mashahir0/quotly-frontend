

import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaShare } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { useToggleLikeDislikeMutation } from "../../../data/api/postApi";
import socket from "../../../utils/socket";
import PostModal from "./PostModal"; // ✅ Import modal component
import toast from "react-hot-toast";

const PostCard = ({ post }: { post: any }) => {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [liked, setLiked] = useState<"like" | "dislike" | null>(null);
  const [toggleLikeDislike] = useToggleLikeDislikeMutation();
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ State to open/close modal


  useEffect(() => {
    setLikes(post.likes);
    setDislikes(post.dislikes);

    const handleLikeUpdate = (data: any) => {
      if (data.postId === post._id) {
        setLikes(data.likes);
        setDislikes(data.dislikes);
      }
    };

    socket.on("updateLikes", handleLikeUpdate);
    return () => {
      socket.off("updateLikes", handleLikeUpdate);
    };
  }, [post._id]);

  const handleLikeToggle = async (action: "like" | "dislike") => {
    try {
      setLiked((prev) => (prev === action ? null : action));
      await toggleLikeDislike({ postId: post._id, action }).unwrap();
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/sharedQuote/${post?.shareId}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("🔗 Post link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy !");
      console.error("Failed to copy:", error);
    }
  };

  return (
    <>
      {/* ✅ Open Modal on Click */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col justify-between h-80 max-h-80 cursor-pointer transition-transform hover:scale-105"
      >
        {/* Profile Section */}
        <div className="flex items-center gap-3 mb-2" >
          {post.userId?.photo ? (
            <img src={post.userId?.photo} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-gray-500" />
          ) : (
            <MdAccountCircle className="text-white w-12 h-12" />
          )}
          <h3 className="text-lg font-bold text-white">{post.userId?.name}</h3>
        </div>

        {/* Post Content */}
        <div className="max-h-36 overflow-y-auto p-3 text-gray-300 whitespace-pre-wrap break-words custom-scrollbar">
          {post.text.length > 300 ? post.text.substring(0, 300) + "..." : post.text}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-6">
            <button
              className={`transition flex items-center gap-2 ${liked === "like" ? "text-green-500" : "text-gray-400"}`}
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle("like");
              }}
            >
              <FaThumbsUp size={18} /> {likes}
            </button>

            <button
              className={`transition flex items-center gap-2 ${liked === "dislike" ? "text-red-500" : "text-gray-400"}`}
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle("dislike");
              }}
            >
              <FaThumbsDown size={18} /> {dislikes}
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="text-blue-400 hover:text-blue-300 transition"
          >
            <FaShare size={18} />
          </button>
        </div>
      </div>

      {/* ✅ Post Modal */}
      {isModalOpen && <PostModal post={post} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default PostCard;
