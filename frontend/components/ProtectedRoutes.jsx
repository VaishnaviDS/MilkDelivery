import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAdmin();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;