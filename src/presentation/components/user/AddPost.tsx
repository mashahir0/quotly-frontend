import { useState } from "react";
import { useAddPostMutation } from "../../../data/api/postApi";
import { useGetDetailsQuery } from "../../../data/api/userApi";
import toast from "react-hot-toast";

const AddPost: React.FC<{ onPostAdded?: () => void }> = ({ onPostAdded }) => {
  const [text, setText] = useState("");
  const [addPost, { isLoading, error }] = useAddPostMutation();
  const { refetch } = useGetDetailsQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
       await addPost({ text }).unwrap();
      setText("");
      refetch();
      toast.success(`New post shared 🎉`);
      if (onPostAdded) onPostAdded();
    } catch (err : any) {
      
      toast.error(err.data.message);
      console.error(err.data.message);
    }
  };


  return (
    <div className=" w-full  max-w-md bg-white/10 text-white rounded-2xl shadow-lg p-6 self-start">
      <h2 className="text-xl font-bold mb-4 text-white text-center">
        Add a Post
      </h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border border-gray-400 text-lg text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-300"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={5}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">
            {typeof error === "string"
              ? error
              : "data" in error
              ? (error as any)?.data?.message || "An error occurred"
              : "Something went wrong"}
          </p>
        )}
        <button
          type="submit"
          className="w-full mt-4 bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700 transition-all duration-200 "
          disabled={isLoading || text.trim() === ""}
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
