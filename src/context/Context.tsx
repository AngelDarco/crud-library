import { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { UserValue } from "../types";

const userValue: UserValue = {
  uid: "",
  user: "",
};

const context = createContext(userValue);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [userData, setUserData] = useState(userValue);

  useEffect(() => {
    (() => {
      onAuthStateChanged(auth, (currentUser) => {
        currentUser
          ? setUserData({
              uid: currentUser.uid,
              user: currentUser.email || "",
            })
          : setUserData({
              uid: "",
              user: "",
            });
      });
    })();
    return () => setUserData(userValue);
  }, []);

  return (
    <context.Provider value={{ ...userData, setUserData }}>
      {children}
    </context.Provider>
  );
};

export const Auth = () => {
  return useContext(context);
};
