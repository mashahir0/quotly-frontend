import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminPrivate = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  if (!token) return null; // Prevent rendering before redirection

  return <>{children}</>;
};

export default AdminPrivate;