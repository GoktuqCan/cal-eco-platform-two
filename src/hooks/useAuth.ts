import { useCallback, useEffect } from "react";
import { ACCESS_TOKEN_LOCAL_STORAGE } from "../constants/common";
import { getApi } from "../services/axios.service";
import { useAuthContext, IUser } from "../contexts/AuthContext";

const useAuth = () => {
  const user = useAuthContext((state) => state.user);
  const setUser = useAuthContext((state) => state.setUser);
  const isAuthenticated = useAuthContext((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthContext((state) => state.setIsAuthenticated);

  // Simulate a login action
  const login = useCallback((data: { access_token?: string } & Partial<IUser>) => {
    // Perform login logic, set user data
    const { access_token = "", ...rest } = data;
    setUser({ ...rest } as IUser);
    console.log("Logged in ::::", data);
    if (access_token) {
      setIsAuthenticated(true);
      localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE, access_token);
    }
  }, [setUser, setIsAuthenticated]);

  // Simulate a logout action
  const logout = useCallback(() => {
    // Perform logout logic, clear user data
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE);
    setIsAuthenticated(false);
  }, [setUser, setIsAuthenticated]);

  const updateUserInfo = useCallback(async () => {
    const result = await getApi("/users/me");
    setIsAuthenticated(true);
    setUser(result.data);
  }, [setIsAuthenticated, setUser]);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE);
    if (token && !user) {
      (async () => {
        try {
          updateUserInfo();
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [user, updateUserInfo]);

  return { user, login, logout, isAuthenticated, updateUserInfo };
};

export default useAuth;
