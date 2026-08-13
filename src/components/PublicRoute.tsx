import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../store/appStore";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore(
    (state) => state.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;