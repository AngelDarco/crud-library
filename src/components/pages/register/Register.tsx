import "./Register.scss";
import { useState, useRef, FormEvent } from "react";
import useSession from "../../../utils/useSession";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const formData = useRef({ email: "", pass: "" });
  const { register } = useSession();
  const [passError, setPassError] = useState({ error: false, message: "" });
  const [emailError, setEmailError] = useState(false);
  const [button, setButton] = useState(true);

  const email = useRef<HTMLInputElement>(null);
  const pass = useRef<HTMLInputElement>(null);

  type FormData = {
    email: string;
    pass: string;
  };

  const navigate = useNavigate();

  const handlerInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    if (formData.current) {
      const name = target.name as keyof FormData;
      formData.current[name] = target.value;
    }
  };

  const handlerFocus = () => {
    if (email.current) {
      email.current?.value === "" ? setEmailError(true) : setEmailError(false);
      if (pass.current)
        pass.current.addEventListener("keyup", () => {
          if (pass.current)
            if (pass.current.value.length < 6) {
              if (pass.current.value.length === 0) {
                setPassError({
                  error: true,
                  message: "This field can't be empty",
                });
                setButton(true);
                return;
              }
              setPassError({ error: true, message: "At least 6 characters" });
              setButton(true);
            } else {
              setPassError({ error: false, message: "" });
              setButton(false);
            }
        });
    }
  };
  const LogIn = (e: FormEvent) => {
    e.preventDefault();
    if (formData.current)
      register(formData.current)
        .then((res) => {
          if (!res || !res?.res) {
            if (res?.message) {
              const msg = res?.message.replace(
                /[/<>(:)(.)\\-]|(Firebase)/g,
                " "
              );
              console.log(msg);
              const message = msg || "Register Failed";
              Swal.fire({
                position: "center",
                icon: "error",
                title: message,
                showConfirmButton: false,
                timer: 1000,
              });
            }
          } else
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Register Success",
              timer: 1000,
            });
          setTimeout(() => {
            navigate("/");
          }, 1000);
        })
        .catch((err) => console.log(err));
  };

  return (
    <div className="registerContainer">
      <h1>Register</h1>
      <form onSubmit={LogIn}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            ref={email}
            type="email"
            name="email"
            onKeyUp={handlerInput}
            onFocus={handlerFocus}
            placeholder="Email"
            required
            className={emailError ? "error" : ""}
          />
        </div>
        {emailError ? <span> this field is required</span> : ""}
        <div>
          <label htmlFor="pass">Password</label>
          <input
            ref={pass}
            id="pass"
            type="password"
            min={6}
            name="pass"
            onKeyUp={handlerInput}
            onFocus={handlerFocus}
            placeholder="Password"
            required
          />
        </div>
        {passError?.error ? <span>{passError?.message}</span> : ""}
        <input
          disabled={button}
          type="submit"
          value="Sign Up"
          className="register"
        />
      </form>
    </div>
  );
};
export default Register;
