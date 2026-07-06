import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  // needed to be set when logined
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // i think children can be used in some way not sure
}
