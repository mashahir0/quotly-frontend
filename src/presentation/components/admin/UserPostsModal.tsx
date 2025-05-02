import { Trash, X } from "lucide-react";
import {  useState } from "react";
import {
  useGetUserPostsQuery,
  useDeletePostMutation,
} from "../../../data/api/adminApi";
import { toast } from "react-hot-toast";
import Modal from "../common/CofirmModal"; // ✅ import your custom modal

interface Props {
  userId: string;
  onClose: () => void;
}

const UserPostsModal: React.FC<Props> = ({ userId, onClose }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetUserPostsQuery({ userId, page });
  const [deletePost] = useDeletePostMutation();
  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedPostId) return;
  
    try {
      await deletePost({ postId: selectedPostId, userId }).unwrap(); 
      toast.success("Post deleted");
      refetch();
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setShowConfirm(false);
      setSelectedPostId(null);
    }
  };
  
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
        <div className="bg-gray-900 w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-red-400"
            onClick={onClose}
          >
            <X size={24} />
          </button>

          <h2 className="text-xl font-bold text-white mb-4">User Posts</h2>

          {isLoading && <p className="text-gray-300">Loading posts...</p>}
          {isError && <p className="text-red-400">Failed to load posts</p>}
          {!posts.length && !isLoading && (
            <p className="text-gray-400">This user has no posts.</p>
          )}

          {/* Posts */}
          <div className="space-y-3">
            {posts.map((post: any) => (
              <div
                key={post._id}
                className="bg-gray-800 p-4 rounded flex justify-between items-start"
              >
                <div className="flex-1 pr-4 overflow-hidden">
                  <h4 className="text-white font-semibold break-words">{post.title}</h4>
                  <p className="text-gray-400 text-sm mt-1 whitespace-pre-wrap break-words">
                    {post.text}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPostId(post._id);
                    setShowConfirm(true);
                  }}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    page === i + 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 Custom Confirm Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </>
  );
};

export default UserPostsModal;
