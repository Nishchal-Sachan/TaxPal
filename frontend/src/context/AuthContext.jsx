import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { setToken, getToken, removeToken } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if token exists
  useEffect(() => {
    const token = getToken();

    if (token) {
      // We don’t decode token here for simplicity
      // You can add a /me endpoint later if needed
      setUser({ authenticated: true }); // eslint-disable-line react-hooks/set-state-in-effect -- initial auth from token
    }

    setLoading(false);
  }, []);


  /**
   * REGISTER
   */
  const register = async (formData) => {
    try {
      await apiClient.post("/auth/register", formData);
      navigate("/login");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  /**
   * LOGIN
   */
  const login = async (formData) => {
    try {
      const response = await apiClient.post("/auth/login", formData);

      const { token, user } = response.data.data;

      setToken(token);
      setUser(user);

      navigate("/dashboard");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };



  /**
   * LOGOUT
   */
  const logout = () => {
    removeToken();
    setUser(null);
    navigate("/login");
  };


  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- useAuth is a hook, not a component
export const useAuth = () => {
  return useContext(AuthContext);
};