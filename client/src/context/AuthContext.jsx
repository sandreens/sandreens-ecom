import { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser, registerUser, logoutUser, getCurrentUser,
  forgotPasswordRequest, resetPasswordRequest,
  updateProfile as updateProfileRequest,
  changePasswordRequest
} from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const forgotPassword = async (email) => {
    return await forgotPasswordRequest(email);
  };

  const resetPassword = async (token, password) => {
    return await resetPasswordRequest(token, password);
  };

  // ⬇️ NEW: edit personal info
  const updateProfile = async (payload) => {
    const data = await updateProfileRequest(payload);
    setUser(data);
    return data;
  };

  // ⬇️ NEW: change password
  const changePassword = async (payload) => {
    return await changePasswordRequest(payload);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      forgotPassword, resetPassword,
      updateProfile, changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);