


import { useEffect, useState } from "react";
import { useGetDetailsQuery, useUpdateProfileMutation } from "../../../data/api/userApi";
import { FaEdit, FaEye, FaTimes, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser, UserData } from "../../../domain/redux/slilce/userSlice";


interface UpdateProfileResponse {
  message: string;
  user: UserData;
}

const UserProfile = () => {
  const { data: user, refetch } = useGetDetailsQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(user?.userData?.name || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.userData?.photo || null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    refetch();
  }, [user]);

  // Handle file selection and generate preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Generate preview
    }
  };

  // Handle profile update
  const handleSave = async () => {
    setIsLoading(true); // Start loading animation
    const formData = new FormData();
    formData.append("name", name);
    if (selectedFile) {
      formData.append("profilePic", selectedFile);
    }

    try {
      const response = await updateProfile(formData).unwrap() as unknown as UpdateProfileResponse;

const { password, ...safeUser } = response.user;
dispatch(setUser({ user: safeUser }));

      refetch();
      console.log(response)
      // dispatch(setUser({ user: updatedUser?.user })); // Update Redux state with new user data
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.error);
      console.error("Update failed:", error);
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="w-full max-w-md bg-white/10 text-white rounded-2xl shadow-lg p-6 text-center">
      {/* Profile Picture */}
      <div className="flex justify-center">
        <img
          src={user?.userData?.photo || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-purple-600 object-cover"
        />
      </div>

      {/* User Info */}
      <h2 className="text-2xl font-bold mt-3">{user?.userData?.name}</h2>
      <p className="text-lg text-gray-300">{user?.userData?.email}</p>

      {/* Stats Section */}
      <div className="mt-4 flex justify-around">
        <div>
          <p className="text-lg font-bold">{user?.totalPost || 0}</p>
          <p className="text-sm text-gray-300">Total Posts</p>
        </div>
        <div>
          <p className="text-lg font-bold">{user?.totalLikes || 0}</p>
          <p className="text-sm text-gray-300">Total Likes</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <FaEye size={18} /> 
          <Link to='/my-posts'>View Posts</Link>
          
        </button>

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <FaEdit size={18} /> Edit Profile
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1a0c75] p-6 rounded-lg shadow-lg w-80 text-center">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold text-white">Edit Profile</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes className="text-white" />
              </button>
            </div>

            {/* Profile Picture Preview */}
            <div className="flex justify-center mt-4">
              <img
                src={preview || user?.userData?.photo || "https://via.placeholder.com/100"}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full border-4 border-purple-600 object-cover"
              />
            </div>

            {/* File Input for Profile Picture */}
            <input type="file" className="mt-4 text-white" onChange={handleFileChange} />

            {/* Edit Username */}
            <input
              type="text"
              className="mt-4 w-full p-2 rounded-md bg-gray-800 text-white text-center"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new name"
            />

            {/* Save Button with Loading Animation */}
            <button
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white flex justify-center items-center gap-2 w-full"
              onClick={handleSave}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
