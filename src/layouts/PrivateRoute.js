import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  let content;
  if (!user?.email) {
    content = <Navigate to={"/login"} />;
  } else {
    content = children;
  }

  return content;
}
