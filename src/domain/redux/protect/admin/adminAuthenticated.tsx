import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [token, navigate]);

  if (token) return null; // Prevents unnecessary rendering

  return <>{children}</>;
};

export default AdminAuthenticated;