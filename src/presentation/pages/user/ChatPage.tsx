


import React, { useState, useEffect } from "react";
import Navbar from "../../components/user/Navbar";
import UserList from "../../components/user/UserList";
import ChatWindow from "../../components/user/ChatWindow";


const ChatPage: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); // Run on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBack = () => setSelectedUserId(null);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 shadow-md">
        <Navbar />
      </div>

      <div className="pt-16 pb-1 h-[calc(100vh-56px)] bg-gray-900">
        {isMobile ? (
          selectedUserId ? (
            <ChatWindow receiverId={selectedUserId} onBack={handleBack} />
          ) : (
            <UserList
              onSelectUser={setSelectedUserId}
              selectedUserId={selectedUserId}
            />
          )
        ) : (
          <div className="flex w-full h-full">
            <UserList
              onSelectUser={setSelectedUserId}
              selectedUserId={selectedUserId}
            />
            <ChatWindow receiverId={selectedUserId} />
          </div>
        )}
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default ChatPage;
