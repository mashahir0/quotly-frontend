
import { useState } from "react";
import { useGetPostsQuery } from "../../../data/api/postApi";
import PostCard from "./PostCard";


const PostsList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetPostsQuery({ page, limit: 18 });

  if (isLoading) return <p className="text-center text-white">Loading posts...</p>;
  if (isError) return <p className="text-center text-red-500">Error loading posts</p>;

  return (
    <div className="bg-white/10 text-white rounded-2xl shadow-lg p-6 w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Recent Posts</h2>

      {data?.posts?.length === 0 ? (
        <p className="text-center text-gray-300">No posts available.</p>
      ) : (
        <div>
          {/* Post Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post: any) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md mr-4 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={!data.hasMore}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;




