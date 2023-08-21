/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export default function PrivateRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  if (user?.email) {
    return children;
  }
  return <Navigate to={"/login"}/>;
}
