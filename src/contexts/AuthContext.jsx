import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading,setLoading]=useState(true);
  const navigate=useNavigate();

  // 🔐 LOGIN FUNCTION
  const login = (data) => {
    localStorage.setItem("token", data.token);

    setUser(data.user);

  };
  
  const logout=()=>{
    localStorage.removeItem('token');
    setUser("");
    navigate("/");
  }

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
    <AuthContext.Provider value={{ user, login, setUser ,logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
