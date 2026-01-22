import React, { useState, useEffect, useCallback } from "react";
import { createContext, useContextSelector } from "@fluentui/react-context-selector";
import CustomModal from "../UI/CustomModal";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ForgotPassword from "../components/auth/ForgotPassword";
import ChangePassword from "../components/auth/ChangePassword";

export type AuthContextType = {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  toggleModal: (status?: boolean | null) => void;
  setAuthAction: React.Dispatch<React.SetStateAction<AuthActionType | null>>;
  updateAuthAction: (inputAction: string) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  toggleModal: () => {},
  setAuthAction: () => {},
  updateAuthAction: () => {},
});

export const ActionTypes = {
  Login: "login",
  Register: "register",
  ForgotPassword: "forgot-password",
  ChangePassword: "change-password",
};

export type AuthActionType = {
  action: string;
  component: React.FC;
};

export const AuthActions: AuthActionType[] = [
  {
    action: ActionTypes.Login,
    component: Login,
  },
  {
    action: ActionTypes.Register,
    component: Register,
  },
  {
    action: ActionTypes.ForgotPassword,
    component: ForgotPassword,
  },
  {
    action: ActionTypes.ChangePassword,
    component: ChangePassword,
  },
];

export type IUser = {
  _id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  isVerified?: boolean;
  intro?: string;
};

export function useAuthContext<T>(selector: (state: AuthContextType) => T): T {
  return useContextSelector(AuthContext, selector);
}

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [showModal, setShowModal] = useState(false);
  const [authAction, setAuthAction] = useState<AuthActionType | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const Component = authAction?.component;

  const toggleModal = useCallback((status: boolean | null = null) => {
    setShowModal((prev) => (status !== null ? status : !prev));
  }, []);

  const updateAuthAction = useCallback((inputAction: string) => {
    setAuthAction(
      AuthActions.find(({ action }) => action === inputAction) as AuthActionType
    );
  }, []);

  useEffect(() => {
    if (Component) {
      setShowModal(true);
    }
  }, [Component]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        toggleModal,
        setAuthAction,
        updateAuthAction,
      }}
    >
      {children}
      <CustomModal
        body={Component ? <Component /> : <></>}
        handleClose={() => setShowModal(false)}
        open={showModal}
      />
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
