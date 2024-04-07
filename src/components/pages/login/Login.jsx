import "./Login.scss";
import { useContext, useState } from "react";
import { context } from "../../../context/Context";
import Main from "../../body/main/Main";
import useSession from "../../../utils/useSession";
import Swal from "sweetalert2";

const Login = () => {
  const { uid, setUserData } = useContext(context);
  const { Login } = useSession();
  const LoginAuth = Login();
  const [usersData, setUsersData] = useState({});
  const handlerInput = ({ target }) => {
    setUsersData({
      ...usersData,
      [target.name]: target.value,
    });
  };

  const handlerSubmit = (ev) => {
    ev.preventDefault();
    LoginAuth(usersData, setUserData).then(({ res, message }) => {
      res
        ? Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Access Granted ...",
            showConfirmButton: false,
            timer: 1500,
          })
        : Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });
    });
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
