import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const storedRole = localStorage.getItem("role")?.toUpperCase();

  if (!storedRole) {
    return <Navigate to="/login" replace />;
  }

  if (storedRole !== role.toUpperCase()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
