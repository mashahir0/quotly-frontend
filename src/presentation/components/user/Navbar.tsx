import React, { useState } from "react";
import { Home, MessageCircle, User, LogOut, LogIn, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../domain/redux/store"; // Adjust path as needed
import { clearUser } from "../../../domain/redux/slilce/userSlice";
import { useNavigate } from "react-router-dom";


const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user from Redux store
  const user = useSelector((state: RootState) => state?.auth?.U);
  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");
  
    cookies.forEach(cookie => {
      const cookieName = cookie.split("=")[0];
      document.cookie = `${cookieName}=;expires=${new Date(0).toUTCString()};path=/`;
    });
  };
  
  const handleLogout = () => {
    // Clear localStorage and sessionStorage
    localStorage.removeItem("userToken");
    sessionStorage.clear();
  
    // Clear any stored cookies
    deleteAllCookies();
  
    // Reset application state
    dispatch(clearUser());
    // dispatch(userApi.util.resetApiState());
  
    // Redirect to login page
    navigate("/login");
  };
  

  // const handleLogout = () => {
  //   localStorage.removeItem("userToken");
  //   dispatch(clearQuote());
  //   dispatch(clearUser());
  //   dispatch(userApi.util.resetApiState())
  //   navigate("/login");
  // };

  return (
    <>

    {/* Mobile Bottom Navigation */}
<div className="md:hidden">
  {user ? (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a0c75] shadow-inner border-t border-[#3d3196] flex justify-around py-2 z-50">
      <button
        onClick={() => navigate("/")}
        className="flex flex-col items-center text-[#c4b8ff] hover:text-white"
      >
        <Home className="w-5 h-5" />
        <span className="text-xs">Home</span>
      </button>

      <button
        onClick={() => navigate("/message")}
        className="flex flex-col items-center text-[#c4b8ff] hover:text-white"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs">Chat</span>
      </button>

      <button
        onClick={() => navigate("/my-posts")}
        className="flex flex-col items-center text-[#c4b8ff] hover:text-white"
      >
        <User className="w-5 h-5" />
        <span className="text-xs">Posts</span>
      </button>

      <button
        onClick={() => navigate("/top-profiles")}
        className="flex flex-col items-center text-[#c4b8ff] hover:text-white"
      >
        <User className="w-5 h-5" />
        <span className="text-xs">Rank</span>
      </button>

      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className="flex flex-col items-center text-red-400 hover:text-red-500"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-xs">Logout</span>
      </button>
    </div>
  ) : (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a0c75] shadow-inner border-t border-[#3d3196] flex justify-around py-2 z-50">
      <button
        onClick={() => navigate("/login")}
        className="flex flex-col items-center text-green-400 hover:text-green-500"
      >
        <LogIn className="w-5 h-5" />
        <span className="text-xs">Login</span>
      </button>
    </div>
  )}
</div>
      <nav className="bg-[#1a0c75] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#ece6ff]">Quotly</span>
            </div>

            {/* Mobile Menu Button
            <button
              className="text-[#c4b8ff] md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button> */}

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <button
                className="text-[#c4b8ff] hover:text-white transition flex items-center"
                onClick={() => navigate("/")}
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </button>

              <button
                className="text-[#c4b8ff] hover:text-white transition flex items-center"
                onClick={() => navigate("/message")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat
              </button>

              <button
                className="text-[#c4b8ff] hover:text-white transition flex items-center"
                onClick={() => navigate("/my-posts")}
              >
                <User className="w-5 h-5 mr-2" />
                My Posts
              </button>

              <button
                className="text-[#c4b8ff] hover:text-white transition flex items-center"
                onClick={() => navigate("/top-profiles")}
              >
                <User className="w-5 h-5 mr-2" />
                Ranking
              </button>
            </div>

            {/* Show Logout if logged in, otherwise show Login */}
            {user ? (
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition hidden md:block"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <LogOut className="w-5 h-5 inline-block mr-2" />
                Logout
              </button>
            ) : (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition hidden md:block"
                onClick={() => navigate("/login")}
              >
                <LogIn className="w-5 h-5 inline-block mr-2" />
                Login
              </button>
            )}
          </div>
        </div>


        {/* {isMobileMenuOpen && (
          <div className="md:hidden bg-[#2e1e9c] px-4 py-3">
            <button
              className="block text-[#ece6ff] hover:text-white py-2"
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <button
              className="block text-[#ece6ff] hover:text-white py-2"
              onClick={() => navigate("/message")}
            >
              Chat
            </button>

            <button
              className="block text-[#ece6ff] hover:text-white py-2"
              onClick={() => navigate("/my-posts")}
            >
              My Posts
            </button>

            <button
              className="block text-[#ece6ff] hover:text-white py-2"
              onClick={() => navigate("/top-profiles")}
            >
              Ranking
            </button>


            {user ? (
              <button
                className="block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md mt-3 w-full"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                Logout
              </button>
            ) : (
              <button
                className="block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-3 w-full"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
          </div> */}
        {/* )} */}
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-bold text-gray-800">Confirm Logout</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to log out?
            </p>

            <div className="mt-4 flex justify-between">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
