
import { io } from "socket.io-client";

// ✅ Connect to your backend server (Replace with your backend URL)
const socket = io("http://localhost:3000"); // Change this in production

export default socket;
