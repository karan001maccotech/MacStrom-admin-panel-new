// hooks/useAuth.js
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const useAuth = () => {
  const { user } = useContext(AuthContext);
  return {
    isLoggedIn: !!user,
    user
  };
};

export default useAuth;
