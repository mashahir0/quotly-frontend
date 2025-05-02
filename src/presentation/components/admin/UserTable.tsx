import { Trash, Ban, Eye } from "lucide-react";
import { useBlockUserMutation, useDeleteUserMutation, useGetUsersQuery } from "../../../data/api/adminApi";
import { User } from "../../../domain/interface/User";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "../common/CofirmModal";
import UserPostsModal from "./UserPostsModal";

const UserTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [postModalUserId, setPostModalUserId] = useState<string | null>(null); 
  const [actionType, setActionType] = useState<"block" | "delete" | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, isError } = useGetUsersQuery({ page, search });
  const [block] = useBlockUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  const openModal = (id: string, type: "block" | "delete") => {
    setSelectedUserId(id);
    setActionType(type);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedUserId || !actionType) return;

    try {
      if (actionType === "block") {
        await block(selectedUserId).unwrap();
        toast.success("User status updated.");
      } else if (actionType === "delete") {
        await deleteUser(selectedUserId).unwrap();
        toast.success("User deleted.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setShowModal(false);
      setSelectedUserId(null);
      setActionType(null);
    }
  };

  const handleViewPosts = (id: string) => {
    setPostModalUserId(id);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading users</p>;

  return (
    <div className="w-full bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-2 md:mb-0">User Management</h2>
        <input
          type="text"
          placeholder="Search username or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-md bg-gray-700 text-white w-full md:w-72"
        />
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3 text-left">Profile</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Posts</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user._id} className="border-b border-gray-600 hover:bg-gray-700">
              <td className="p-3">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                />
              </td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className={`p-3 text-center font-bold ${user.userStatus === "Active" ? "text-green-400" : "text-red-400"}`}>
                {user.userStatus}
              </td>
              <td className="p-3 text-center">
          <button
            onClick={() => handleViewPosts(user._id)}
            className="text-indigo-400 hover:text-indigo-500"
            title="View Posts"
          >
            <Eye className="w-5 h-5 inline" />
          </button>
        </td>
              <td className="p-3 flex justify-center gap-3 flex-wrap">
                
                <button
                  onClick={() => openModal(user._id, "block")}
                  className={`hover:text-yellow-500 ${user.userStatus === "Active" ? "text-yellow-400" : "text-green-400"}`}
                >
                  <Ban className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openModal(user._id, "delete")}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title={actionType === "delete" ? "Delete User" : "Block User"}
        message={
          actionType === "delete"
            ? "Are you sure you want to delete this user?"
            : "Are you sure you want to toggle this user's block status?"
        }
      />
     {postModalUserId && (
  <UserPostsModal
    userId={postModalUserId}
    onClose={() => setPostModalUserId(null)}
  />
)}
    </div>
  );
};

export default UserTable;
