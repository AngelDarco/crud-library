import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CirclesWithBar } from "react-loader-spinner";

const Logout = () => {
  const navigate = useNavigate();
  (async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  })();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, []);
  return (
    <CirclesWithBar
      width="200"
      height="200"
      wrapperStyle={{
        position: "absolute",
        top: "50%",
        left: "35%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};
export default Logout;
