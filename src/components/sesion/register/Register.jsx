import "./Register.scss";
import { useState } from "react";
import useSession from "../../hooks/session/useSession";

const Register = () => {
    const { Register } = useSession();
    const [userData, setUserData] = useState({});  

    const handlerInput = ({ target: { name, value } }) => setUserData({ ...userData, [name]: value })
  
    const LogIn = (e) => {
      e.preventDefault();
      const { error, message } = Register(userData);
        console.log(error, message)
    };

    return (
    <div className="registerContainer">
      <h1>Register</h1>
      <form >
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) => handlerInput(e)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <label htmlFor="pass">Password</label>
          <input
          id="pass"
            type="password"
            min={6}
            name="pass"
            onChange={(e) => handlerInput(e)}
            placeholder="Password"
            required
          />
        </div>
        <div>
          <label htmlFor="pass">Repit Password</label>
          <input
            type="password"
            min={6}
            name="pass2"
            onChange={(e) => handlerInput(e)}
            placeholder="Password"
            required
          />
        </div>
        <button onClick={(e) => LogIn(e)} type="submit" value="Sign Up" className="register">Sent </button>
      </form>
    </div>
  );
};
export default Register;
