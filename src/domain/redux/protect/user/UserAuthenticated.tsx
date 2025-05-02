


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  if (token) return null; // Prevents unnecessary rendering

  return <>{children}</>;
};

export default UserAuthenticated;
