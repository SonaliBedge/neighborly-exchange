import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Decode token to check role
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roles: string[] = Array.isArray(payload.role)
      ? payload.role
      : payload.role
      ? [payload.role]
      : [];

    if (!roles.includes("Admin")) return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}