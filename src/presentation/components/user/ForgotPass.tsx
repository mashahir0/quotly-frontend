import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  useResetPasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../../../data/api/userApi";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [sendOtp] = useSendOtpMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const navigate = useNavigate();

  // Timer countdown
  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, timer]);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email.");
    setLoading(true);
    try {
      await sendOtp({ email }).unwrap();
      toast.success("OTP sent to your email.");
      setOtpSent(true);
      setTimer(60); // 60 seconds
    } catch (err) {
      toast.error("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email || !otp || !newPassword)
      return toast.error("All fields are required.");
    setLoading(true);
    try {
      await verifyOtp({ email, otp }).unwrap();
      toast.success("OTP verified.");
      await resetPassword({ email, newPassword }).unwrap();
      toast.success("Password reset successful.");
      navigate("/login");
    } catch (err) {
      toast.error("Invalid OTP or failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16 bg-white/10 text-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-3 mb-4 rounded-md bg-gray-800 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={otpSent}
      />

      <div className="flex justify-between items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter OTP"
          className="flex-1 p-3 rounded-md bg-gray-800 text-white"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          onClick={handleSendOtp}
          disabled={loading || timer > 0}
          className={`text-sm whitespace-nowrap px-3 py-2 rounded-md ${
            timer > 0
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? <FaSpinner className="animate-spin" /> : timer > 0 ? `Resend (${timer}s)` : "Send OTP"}
        </button>
      </div>

      <input
        type="password"
        placeholder="Enter new password"
        className="w-full p-3 mb-4 rounded-md bg-gray-800 text-white"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        onClick={handleResetPassword}
        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? <FaSpinner className="animate-spin" /> : "Reset Password"}
      </button>
      <p
        onClick={() => navigate("/login")}
        className="text-center mt-4 text-sm text-[#b09fff] hover:text-[#d0c2ff] cursor-pointer transition duration-200 ease-in-out"
      >
        ← Back to Login
      </p>
    </div>
  );
};

export default ForgotPassword;
