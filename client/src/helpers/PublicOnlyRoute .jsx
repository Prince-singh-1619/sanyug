import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("authToken");

  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

export default PublicOnlyRoute;