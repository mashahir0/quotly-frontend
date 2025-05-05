
import { io } from "socket.io-client";

// ✅ Connect to your backend server (Replace with your backend URL)
const socket = io(`${import.meta.env.VITE_BACKENDURL}`); // Change this in production

export default socket;
