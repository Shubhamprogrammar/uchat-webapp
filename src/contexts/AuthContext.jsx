import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading,setLoading]=useState(true);

  // 🔐 LOGIN FUNCTION
  const login = (data) => {
    localStorage.setItem("token", data.token);

    setUser(data.user)

  };
  

  // Restore user on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // optional: token expiry check
      if (decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser({
          id: decoded.id,
        });
      }
    } catch (err) {
      console.error("Invalid token", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return null;


  return (
    <AuthContext.Provider value={{ user, login, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
