// AuthContext.jsx
import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    return token && role ? { token, role, name } : null;
  });

  const login = (data) => setUser(data);
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
