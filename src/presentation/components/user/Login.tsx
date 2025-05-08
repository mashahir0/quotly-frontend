
import { useState } from "react";
import {
  useGoogleLoginMutation,
  useLoginMutation,
} from "../../../data/api/userApi";
import { Link, useNavigate } from "react-router-dom";
import {
  LockOpenIcon as LockClosedIcon,
  InboxIcon as EnvelopeIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "../../../domain/redux/slilce/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { AppDispatch } from "../../../domain/redux/store";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const [login, { isLoading, error }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const validateForm = () => {
    let valid = true;
    let emailError = "";
    let passwordError = "";

    if (!email) {
      emailError = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      emailError = "Invalid email format";
      valid = false;
    }

    if (!password) {
      passwordError = "Password is required";
      valid = false;
    } else if (password.length < 5) {
      passwordError = "Password must be at least 5 characters";
      valid = false;
    }

    setErrors({ email: emailError, password: passwordError });
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await login({ email, password }).unwrap();
      localStorage.setItem("userToken", result.accessToken);
      dispatch(setUser({ user: result.user }));
      toast.success(`Welcome back, ${result.user.name}! 🎉`);
      navigate("/home");
    } catch (err) {
      toast.error("oops something wrong!!!!");
      console.log(err);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    
    onSuccess: async (response) => {
      try {
        const { access_token } = response; // Google access token

        // Send Google token to backend for verification & JWT generation
        const result = await googleLogin({ token: access_token }).unwrap();

        localStorage.setItem("userToken", result.accessToken);
        dispatch(setUser({ user: result.user }));
        toast.success(`Welcome back, ${result.user.name}! 🎉`);
        navigate("/home");
      } catch (err) {
        toast.error("oops something wrong!!!!");
        console.error("Google login failed:", err);
        navigate("/register");
      }
    },
    onError: (error) => console.log("Google Login Failed:", error),
  });

 

  return (
    <div className="min-h-screen bg-[#1a0c75] text-white flex flex-col lg:flex-row">
      {/* About Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#23147e]">
  <div className="max-w-lg text-center"> {/* Add text-center here */}
    <h1 className="text-4xl font-bold mb-4 text-[#ece6ff]">Welcome to Quotly</h1>
    <p className="text-lg text-purple-200 mb-6">
      Share, like, and discover inspiring quotes. Engage in real-time chats,
      track popular posts, and enjoy a beautiful, dynamic quote-sharing experience.
    </p>
  </div>
</div>


      {/* Login Section */}
      <div
        className="flex-1 flex items-center justify-center py-12 px-6 sm:px-8 bg-[#1a0c75]"
      >
        <div className="w-full max-w-md bg-[#2e1e9c] rounded-2xl shadow-xl p-8 space-y-8">
          <h2 className="text-center text-3xl font-extrabold text-[#ece6ff]">
            Sign in to your account
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="text"
                  autoComplete="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 pl-10 rounded-md bg-[#3a2aaf] text-[#ece6ff] placeholder-[#c4b8ff] focus:outline-none focus:ring-[#b09fff] focus:border-[#b09fff]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  className="w-full px-4 py-3 pl-10 rounded-md bg-[#3a2aaf] text-[#ece6ff] placeholder-[#c4b8ff] focus:outline-none focus:ring-[#b09fff] focus:border-[#b09fff]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white font-medium rounded-md disabled:opacity-50"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
                </span>
                {isLoading ? "Logging in..." : "Sign in"}
              </button>
            </div>

            {/* Google Login */}
            <div>
              <button
                type="button"
                onClick={()=>handleGoogleLogin()}
                className="mt-3 w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md text-sm text-gray-800 bg-white hover:bg-gray-100"
              >
                <FaGoogle className="h-5 w-5 mr-2 text-red-500" />
                Sign in with Google
              </button>
            </div>

            {/* Navigation Links */}
            <Link to="/register">
              <p className="text-center mt-3 text-sm text-[#b09fff] hover:text-[#d0c2ff]">
                Don't have an account? Sign Up
              </p>
            </Link>
            <p className="text-center text-sm text-[#b09fff]">
              Forgot your password?{" "}
              <Link
                to="/reset-password"
                className="hover:text-[#d0c2ff] underline"
              >
                Click here to reset it
              </Link>
            </p>
          </form>

          {error && "data" in error && typeof error.data === "object" && (
            <div className="mt-2 text-center text-sm text-red-600">
              {(error.data as { error?: string })?.error ||
                "Something went wrong. Please try again!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;