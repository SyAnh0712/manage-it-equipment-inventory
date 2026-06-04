import { createContext, useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import authService from "../services/authService";
import {
  connectSocket,
  disconnectSocket,
  listenToSocket,
} from "../services/socketService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await authService.getMe();
        const userData = response?.data?.user || response?.user;
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setInitialLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    connectSocket();

    const removeLockedListener = listenToSocket("user:locked", (payload) => {
      if (String(payload?.user?.id) === String(user?.id)) {
        toast.error(payload?.message || "Tài khoản của bạn đã bị khóa.");
        logout();
      }
    });

    const removeUnlockedListener = listenToSocket(
      "user:unlocked",
      (payload) => {
        if (String(payload?.user?.id) === String(user?.id)) {
          toast.success(
            payload?.message || "Tài khoản của bạn đã được mở khóa.",
          );
        }
      },
    );

    const removeNotificationListener = listenToSocket(
      "notification",
      (payload) => {
        toast.info(payload?.message || "Có cập nhật mới từ hệ thống");
      },
    );

    return () => {
      removeLockedListener();
      removeUnlockedListener();
      removeNotificationListener();
      disconnectSocket();
    };
  }, [user, logout]);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const data = response?.data || response;

      if (data.requires2FA) {
        return { requires2FA: true, tempToken: data.tempToken };
      }

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await authService.register(data);
      const result = response?.data || response;
      return result;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    try {
      setLoading(true);
      const response = await authService.verifyOtp(email, otp);
      const data = response?.data || response;

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      }

      return data;
    } catch (error) {
      console.error("Verify OTP error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const verify2fa = useCallback(async (tempToken, code) => {
    try {
      setLoading(true);
      const response = await authService.verify2fa(tempToken, code);
      const data = response?.data || response;

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      }

      return data;
    } catch (error) {
      console.error("Verify 2FA error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    initialLoading,
    login,
    register,
    verifyOtp,
    verify2fa,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
