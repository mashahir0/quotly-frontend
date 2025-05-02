import { useState } from "react";
import { FaTrash, FaShare, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  useGetUserPostsQuery,
  useDeletePostMutation,
  useTogglePostPrivacyMutation,
} from "../../../data/api/postApi";
import toast from "react-hot-toast";

const MyPosts = () => {
  const [page, setPage] = useState(1);
  const limit = 12;
   const { data, isLoading, isError, refetch } = useGetUserPostsQuery({
    page,
    limit,
  });
  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;

  const [deletePost] = useDeletePostMutation();
  const [togglePostPrivacy] = useTogglePostPrivacyMutation();

  // ✅ Delete Confirmation State
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    postId: string | null;
  }>({
    open: false,
    postId: null,
  });

  if (isLoading)
    return <p className="text-center text-white">Loading your posts...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500">Error fetching your posts</p>
    );

  // ✅ Handle Delete (Modal)
  const handleDeleteConfirm = async () => {
    if (!deleteModal.postId) return;
    try {
      const response = await deletePost({
        postId: deleteModal.postId,
      }).unwrap();
      toast.success(response.message);
      refetch();
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setDeleteModal({ open: false, postId: null });
    }
  };

  // ✅ Handle Toggle Privacy
  const handleTogglePrivacy = async (postId: string) => {
    const response = await togglePostPrivacy({ postId }).unwrap();
    toast.success(response.message);
    refetch();
  };

  // ✅ Handle Share Button
  const handleShare = async (postId: string) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("🔗 Post link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy:");
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="bg-white/10 text-white rounded-2xl shadow-lg p-6 w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">My Posts</h2>

      {data?.posts?.length === 0 ? (
        <p className="text-center text-gray-300">
          You haven't posted anything yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.posts.map((post: any) => (
            <div
              key={post._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-between"
            >
              {/* Post Text */}
              <p className="text-lg text-gray-300 whitespace-pre-wrap break-words overflow-auto max-h-36 p-2 rounded-md custom-scrollbar">
                {post.text.length > 300
                  ? post.text.substring(0, 300) + "..."
                  : post.text}
              </p>

              {/* Likes & Dislikes */}
              <div className="flex justify-between mt-3">
                <span className="text-green-400">👍 {post.likes}</span>
                <span className="text-red-400">👎 {post.dislikes}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-3">
                {/* Toggle Privacy */}
                <button
                  className={`transition ${
                    post.isPublic ? "text-green-400" : "text-yellow-400"
                  }`}
                  onClick={() => handleTogglePrivacy(post._id)}
                >
                  {post.isPublic ? (
                    <FaEye size={18} />
                  ) : (
                    <FaEyeSlash size={18} />
                  )}
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleShare(post._id)}
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  <FaShare size={18} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() =>
                    setDeleteModal({ open: true, postId: post._id })
                  }
                  className="text-red-500 hover:text-red-400 transition"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="text-white text-sm self-center">
          Page {page} of {totalPages}
        </span>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
            <p className="text-gray-300 mt-2">
              Are you sure you want to delete this post?
            </p>

            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setDeleteModal({ open: false, postId: null })}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
