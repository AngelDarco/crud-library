import { useEffect, useState, createContext } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { UserValue } from "../types";
import uuid from "react-uuid";

const userValue: UserValue = {
  uid: localStorage.getItem("darco-library-uid") || "",
  user: "guest",
};

export const context = createContext(userValue);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [userData, setUserData] = useState(userValue);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const { uid, email } = currentUser as User;
        setUserData({ uid, user: email || "guest" });
        localStorage.setItem("darco-library-uid", uid);
      } else {
        localStorage.setItem("darco-library-uid", uuid());
      }
    });
  }, []);

  return (
    <context.Provider value={{ ...userData, setUserData }}>
      {children}
    </context.Provider>
  );
};
