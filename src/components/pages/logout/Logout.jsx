import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useContext, useEffect } from "react";
import { context } from "../../../context/Context";

const Logout = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(context);

  useEffect(() => {
    toast
      .promise(
        signOut(auth),
        {
          pending: "Logging out",
          success: "Logged out",
          error: "We sorry, something went wrong",
        },
        {
          autoClose: 500,
        }
      )
      .then(() => {
        setUserData({ uid: "", user: "" });
        navigate("/");
      })
      .catch((err) => new Error(err));
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
