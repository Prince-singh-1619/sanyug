import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  // const isLoggedIn = localStorage.getItem("authToken");
  const { authToken } = useSelector(state => state.user)

  return authToken ? <Navigate to="/" replace /> : children;
};

export default PublicOnlyRoute;