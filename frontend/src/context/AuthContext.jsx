import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { setToken, getToken, removeToken } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await apiClient.get("/auth/me");
        setUser(response.data.data);
      } catch {
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const register = async (formData) => {
    try {
      const response = await apiClient.post("/auth/register", formData);
      const { token, user: userData } = response.data.data;
      setToken(token);
      setUser(userData);
      navigate("/dashboard");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const login = async (formData) => {
    try {
      const response = await apiClient.post("/auth/login", formData);
      const { token, user: userData } = response.data.data;
      setToken(token);
      setUser(userData);
      navigate("/dashboard");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    navigate("/login");
  };

  const refreshUser = async () => {
    const response = await apiClient.get("/auth/me");
    setUser(response.data.data);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
