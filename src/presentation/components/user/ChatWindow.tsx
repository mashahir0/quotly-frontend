


import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../../../data/api/chatApi";
import socket from "../../../utils/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../../domain/redux/store";

interface ChatWindowProps {
  receiverId: string | null;
  onBack?: () => void; 
}

const ChatWindow: React.FC<ChatWindowProps> = ({ receiverId ,onBack}) => {
  const { data: messages, isLoading ,refetch} = useGetMessagesQuery(receiverId || "", {
    skip: !receiverId,
  });
  // const { data: user } = useGetDetailsQuery();
  const [sendMessage] = useSendMessageMutation();

  const [text, setText] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>(messages || []);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // ✅ Fix
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // For auto-scrolling
  const senderUserId  = useSelector((state : RootState) => state.auth?.U?._id)

  useEffect(() => {
    if (receiverId) {
      refetch();
      setChatMessages([]); // optional: clear old messages when switching user
    }
  }, [receiverId, refetch]);

  // ✅ Sync state when API fetches messages
  useEffect(() => {
    if (messages) setChatMessages(messages);
  }, [messages]);

  // ✅ Register user on socket connection
  useEffect(() => {
    if (senderUserId) {
      socket.emit("register", senderUserId);
    }
  }, [senderUserId]);

  // ✅ Listen for new messages & typing events
  useEffect(() => {
    if (!receiverId) return;

    const handleNewMessage = (message: any) => {
      const currentUserId = senderUserId;
    
      // ✅ Only add messages that are between the current user and this chat's receiver
      const isRelevant =
        (message.senderId === currentUserId && message.receiverId === receiverId) ||
        (message.receiverId === currentUserId && message.senderId === receiverId);
    
      if (!isRelevant) return;
    
      setChatMessages((prev) => {
        const isDuplicate = prev.some((msg) => msg._id === message._id);
        return isDuplicate ? prev : [...prev, message];
      });
    
      scrollToBottom();
    };
    

    const handleTyping = (data: { senderId: string; receiverId: string }) => {
      const currentUserId = senderUserId;
    
      // ✅ Only show typing if it's from the person you're currently chatting with
      if (data?.senderId !== receiverId || data?.receiverId !== currentUserId) return;
    
      setIsTyping(true);
      scrollToBottom();
    
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
    };
    

    socket.off("newMessage").on("newMessage", handleNewMessage);
    socket.off("typing").on("typing", handleTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
    };
  }, [receiverId]);

  // ✅ Auto-scroll when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const handleTyping = () => {
    if (!receiverId) return;

    socket.emit("typing", {
      senderId: senderUserId,
      receiverId,
    });
    

    // Clear existing timeout

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Reset "isTyping" after 3 seconds
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
  };

  // ✅ Handle message send
  const handleSend = async () => {
    if (!text.trim() || !receiverId) return;

    const userId = senderUserId;
    if (!userId) {
      console.error("❌ senderId is missing! Cannot send message.");
      return;
    }

    const newMessage = {
      _id: Date.now().toString(), // Temporary ID
      senderId: userId,
      receiverId,
      message: text,
    };

    socket.emit("sendMessage", newMessage);

    try {
      await sendMessage({ receiverId, message: text });
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }

    setText("");
  };

  return (
    <div className="w-full md:w-2/3 bg-gray-900 p-4 rounded-lg h-full flex flex-col overflow-hidden">
    {/* Back button for mobile */}
    {onBack && (
      <button
        className="text-white text-sm mb-3 flex items-center gap-2"
        onClick={onBack}
      >
        ← Back
      </button>
    )}

    <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <AnimatePresence>
          {chatMessages.map((msg, index) => (
            <motion.div
              key={msg._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`p-2 my-2 ${
                msg.senderId?._id === senderUserId
                  ? "text-right"
                  : "text-left"
              }`}
            >
              <p className="bg-gray-700 inline-block p-2 rounded-lg text-white">
                {msg.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {isTyping && (
        <div className="text-gray-400 text-sm italic px-2">typing...</div>
      )}

      <div ref={messagesEndRef} />
    </div>

    {receiverId && (
      <div className="flex mt-3">
        <input
          type="text"
          className="flex-1 p-2 rounded-md bg-gray-800 text-white outline-none"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-600 text-white p-2 rounded-md flex items-center justify-center transition hover:bg-blue-700"
        >
          <FaPaperPlane size={16} />
        </button>
      </div>
    )}
  </div>
  );
};

export default ChatWindow;



