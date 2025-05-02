


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserPrivate = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) return null; // Prevent rendering before redirection

  return <>{children}</>;
};

export default UserPrivate;
