import "./Login.scss";
import { useContext, useRef } from "react";
import { context } from "../../../context/Context";
import Main from "../../body/main/Main";
import useSession from "../../../utils/useSession";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { uid, setUserData } = useContext(context);
  const { login } = useSession();
  const LoginAuth = login();

  const formData = useRef({ email: "", pass: "" });

  const navigate = useNavigate();

  const handlerInput = ({ target }) => {
    formData.current[target.name] = target.value;
  };

  const handlerSubmit = (ev) => {
    ev.preventDefault();
    toast
      .promise(
        LoginAuth(formData.current, setUserData),
        {
          pending: "Logging In",
          success: "Login Success",
          error: "Login Failed",
        },
        {
          autoClose: 500,
        }
      )
      .then(() => {
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((err) => new Error(err));
  };

  return (
    <>
      {uid !== "" ? (
        <Main />
      ) : (
        <div className="loginContainer">
          <h1>Login</h1>
          <form onSubmit={(e) => handlerSubmit(e)}>
            <div>
              <label htmlFor="email">email</label>
              <input
                onChange={(e) => handlerInput(e)}
                type="email"
                name="email"
                id="email"
                required
              />
            </div>
            <div>
              <label htmlFor="pass">pass</label>
              <input
                onChange={(e) => handlerInput(e)}
                type="password"
                name="pass"
                id="pass"
                min={6}
                required
              />
            </div>
            <input className="register" type="submit" />
          </form>
        </div>
      )}
    </>
  );
};
export default Login;
