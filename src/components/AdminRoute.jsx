import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function AdminRoute({ children }) {
  const [redirect, setRedirect] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.role !== "admin") {
      toast.error("You do not have permission to access this page");
      setRedirect(true);
    }
  }, []);

  if (redirect) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
