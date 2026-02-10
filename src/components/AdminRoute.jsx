import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { token, isAdmin } = useContext(AuthContext);

  if (!token) return <Navigate to="/signin" />;
  if (!isAdmin) return <Navigate to="/" />;

  return children;
}
