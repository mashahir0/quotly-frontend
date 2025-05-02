import React, { useState } from "react";
import { LogOut, Mail, User, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAdmin } from "../../../domain/redux/slilce/userSlice";
import Modal from "../common/CofirmModal";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogout = () =>{
    localStorage.removeItem('adminToken')
    dispatch(clearAdmin())
    navigate('/admin/login')
  }
  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900 text-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* Left: Title */}
      <h1 className="text-lg sm:text-xl font-bold text-purple-400">Quotly Admin Panel</h1>

      {/* Center: Navigation Links (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition"
          onClick={() => navigate("/admin/users")}
        >
          <User size={18} />
          <span>User</span>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition"
          onClick={() => navigate("/admin/inbox")}
        >
          <Mail size={18} />
          <span>Inbox</span>
        </div>
      </div>

      {/* Right: Logout */}
      <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-red-400 transition" onClick={openLogoutModal}>
        <LogOut size={18} />
        <span>Logout</span>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 py-4 flex flex-col gap-4 items-center md:hidden">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition"
            onClick={() => {
              navigate("/admin/users");
              setIsMobileMenuOpen(false);
            }}
          >
            <User size={18} />
            <span>User</span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition"
            onClick={() => {
              navigate("/admin/inbox");
              setIsMobileMenuOpen(false);
            }}
          >
            <Mail size={18} />
            <span>Inbox</span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-red-400 transition"
            onClick={() => {
              openLogoutModal()
              setIsMobileMenuOpen(false);
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </div>
      )}

        <Modal
        isOpen={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
      />
    </nav>
  );
};

export default Navbar;
