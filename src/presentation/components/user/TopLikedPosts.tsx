import { useEffect, useState } from "react";
import { useGetMostLikedPostsQuery } from "../../../data/api/postApi";
import socket from "../../../utils/socket";
import { MostLikedPost } from "../../../domain/interface/savedPost";

const TopLikedPosts = () => {
  const { data, isLoading } = useGetMostLikedPostsQuery();
  const [topPosts, setTopPosts] = useState<MostLikedPost[]>(data || []);


useEffect(()=>{
    if(data){
        setTopPosts(data)
    }
},[data])

  useEffect(() => {
    socket.on("updateTopPosts", (updatedPosts: MostLikedPost[]) => {
      setTopPosts(updatedPosts);
    });

    return () => {
      socket.off("updateTopPosts");
    };
  }, []);

  if (isLoading) return <p className="text-center text-white">Loading top posts...</p>;

  return (
    <div className="bg-white/10 text-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl mx-auto">
  <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-wide">
    🔥 Most Liked Posts
  </h2>

  {topPosts.length === 0 ? (
    <p className="text-center text-gray-400">No posts yet. Be the first to share inspiration!</p>
  ) : (
    <ul className="space-y-6">
      {topPosts.map((post, index) => (
        <li
          key={post._id}
          className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-800 hover:bg-gray-700 transition-all duration-300 p-4 rounded-xl shadow-md"
        >
          <div className="flex items-start gap-4">
            <span className="text-xl font-bold text-gray-400 min-w-[32px] text-center">
              #{index + 1}
            </span>

            <div className="flex items-start gap-3">
              {post.userId.photo ? (
                <img
                  src={post.userId.photo}
                  alt={`${post.userId.name}'s profile`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-500"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-gray-300 text-lg">
                    {post.userId.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-base font-semibold text-white">
                  {post.userId.name}
                </p>
                <p className="text-sm text-gray-300 max-w-md leading-relaxed">
                  {post.text}
                </p>
              </div>
            </div>
          </div>

          <span className="text-green-400 font-bold text-lg mt-4 sm:mt-0 sm:ml-4 whitespace-nowrap">
            👍 {post.likes}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default TopLikedPosts;
