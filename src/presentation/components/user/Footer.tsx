import { Github, Linkedin, Send, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1a0c75] text-[#ece6ff] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About the App */}
          <div>
            <h2 className="text-xl font-bold text-white">About Quotly</h2>
            <p className="mt-2 text-sm text-[#c4b8ff]">
              Quotly is a platform for sharing and discovering inspiring quotes.
              Users can post, like, and rank profiles based on the most liked
              quotes. You can also connect through real-time chat to share
              thoughts, discuss quotes, or simply spark meaningful
              conversations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold text-white">Quick Links</h2>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/message" className="hover:text-white transition">
                  Chat
                </Link>
              </li>
              <li>
                <Link to="/my-posts" className="hover:text-white transition">
                  My Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/top-profiles"
                  className="hover:text-white transition"
                >
                  Top Profiles
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
  <h2 className="text-xl font-bold text-white">Follow Us</h2>
  <div className="flex justify-center md:justify-start space-x-4 mt-3">
    <Link
      to="https://www.linkedin.com/in/mashahir-p-120a60265/"
      target="_blank"
      className="hover:text-white transition"
    >
      <Linkedin className="w-6 h-6" />
    </Link>
    <Link
      to="https://github.com/mashahir0"
      target="_blank"
      className="hover:text-white transition"
    >
      <Github className="w-6 h-6" />
    </Link>
    <Link
      to="#"
      target="_blank"
      className="hover:text-white transition"
    >
      <Send className="w-6 h-6" />
    </Link>
  </div>
</div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t border-[#2e1e9c] pt-4 text-center text-sm">
          <p>
            Made with <Heart className="inline-block text-red-500" size={16} />{" "}
            by Quotly Team
          </p>
          <p>&copy; {new Date().getFullYear()} Quotly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
