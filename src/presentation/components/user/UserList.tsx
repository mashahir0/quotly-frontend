

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  useGetUsersChatQuery,
  useMarkMessagesAsSeenMutation,
} from "../../../data/api/chatApi";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../../../utils/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../../domain/redux/store";

type User = {
  _id: string;
  name: string;
  photo?: string;
  seen?: boolean;
  isSender?: boolean;
};

interface UserListProps {
  onSelectUser: (id: string) => void;
  selectedUserId: string | null;
}



const UserList: React.FC<UserListProps> = ({
  onSelectUser,
  selectedUserId,
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError, refetch } = useGetUsersChatQuery(
    { search: debouncedSearch, page, limit },
    { refetchOnFocus: true }
  );
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [markSeen] = useMarkMessagesAsSeenMutation();
  const messagesender = useSelector(
    (state: RootState) => state.auth.U?._id
  );

  // Debounce search
// Debounce search
useEffect(() => {
  
  const handler = setTimeout(() => {
    setDebouncedSearch(search.trim());
  }, 300); // 300ms delay

  return () => clearTimeout(handler);
}, [search]);

// Reset page and users when new debounced search value is ready
useEffect(() => {
  setPage(1);
  setAllUsers([]);
}, [debouncedSearch]);

  


  useEffect(() => {
    if (!data?.users) return;
  
    if (page === 1) {
      setAllUsers(data.users); // Fresh search or load
    } else {
      setAllUsers((prev) => {
        const newUsers = data.users.filter(
          (user) => !prev.some((u) => u._id === user._id)
        );
        return [...prev, ...newUsers];
      });
    }
  }, [data, page]);
  
  

  
  

  // Socket listener
  useEffect(() => {
    const handleUserUpdate = () => {
      refetch();
    };
    socket.on("userListUpdate", handleUserUpdate);
  
    return () => {
      socket.off("userListUpdate", handleUserUpdate);
    };
  }, [refetch]);
  

  const handleSelectUser = (userId: string) => {
    if (!messagesender) return;
    onSelectUser(userId);
    markSeen(userId);
    socket.emit("markSeen", {
      senderId: messagesender,
      receiverId: userId,
    });
  };

  const totalPages = useMemo(() => {
    return Math.ceil((data?.total || 0) / limit);
  }, [data, limit]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
  
    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);
  
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [isLoading, page, totalPages]);
  
  
  
  

  return (
    <div className="w-full md:w-1/3 bg-gray-900 p-4 rounded-lg h-full flex flex-col">
  <div className="mb-3">
    <label htmlFor="user-search" className="block text-2xl text-white mb-1">
      🔍 Search Users
    </label>
    <input
      id="user-search"
      type="text"
      placeholder="Search by name..."
      className="w-full p-2 bg-gray-800 text-white rounded-md"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <div className="flex-1 overflow-y-auto custom-scrollbar">
    {isLoading && <p className="text-white">Loading users...</p>}
    {isError && <p className="text-red-500">Error loading users</p>}
    {!isLoading && data?.users?.length === 0 && (
      <p className="text-gray-400 text-center">No users found</p>
    )}

    <ul>
      <AnimatePresence>
        {allUsers.map((user: User) => {
          const showDot = user.seen === false && user.isSender === false;
          return (
            <motion.li
              key={user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
                selectedUserId === user._id
                  ? "bg-blue-600 text-white"
                  : "text-white"
              }`}
              onClick={() => handleSelectUser(user._id)}
            >
              <div className="flex items-center gap-2">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-500"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-gray-300 text-lg">
                      {user.name[0]}
                    </span>
                  </div>
                )}
                <span>{user.name}</span>
              </div>

              {showDot && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2" />
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  </div>

  <div ref={loaderRef} className="py-4 text-center text-gray-400">
    {isLoading && <p>Loading more users...</p>}
    {!isLoading && page >= totalPages && <p>No more users</p>}
  </div>
</div>

  );
};

export default UserList;


