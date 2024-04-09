import { useEffect, useState, createContext } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { UserValue } from "../types";

const userValue: UserValue = {
  uid: "",
  user: "",
};

export const context = createContext(userValue);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [userData, setUserData] = useState(userValue);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      const { uid, email } = currentUser as User;
      setUserData({ uid, user: email || "" });
    });
  }, []);

  return (
    <context.Provider value={{ ...userData, setUserData }}>
      {children}
    </context.Provider>
  );
};
