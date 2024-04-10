import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { UserValue } from "../types";

const useSession = () => {
  const register = async ({
    email,
    pass,
  }: {
    email: string;
    pass: string;
  }): Promise<{ message: string; res: boolean }> => {
    return new Promise((resolve) => {
      createUserWithEmailAndPassword(auth, email, pass)
        .then((res) => {
          console.log(res);
          resolve({ message: "success", res: true });
        })
        .catch((err) => {
          resolve({ message: err.message, res: false });
          new Error(err.message);
        });
    });
  };

  const login = () => {
    const LoginAuth = (
      { email, pass }: { email: string; pass: string },
      setUserData: React.Dispatch<React.SetStateAction<UserValue>>
    ) => {
      return new Promise((resolve) =>
        signInWithEmailAndPassword(auth, email, pass)
          .then((credentials) => {
            setUserData({
              user: credentials.user.email || "",
              uid: credentials.user.uid,
            });
            resolve({ res: true, message: "" });
          })
          .catch((err) => {
            resolve({ res: false, message: err.message });
          })
      );
    };
    return LoginAuth;
  };
  return { register, login };
};
export default useSession;
