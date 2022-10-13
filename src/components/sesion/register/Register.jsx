import "./Register.scss";
import { useState, useRef } from "react";
import useSession from "../../hooks/session/useSession";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const { Register } = useSession();
    const [userData, setUserData] = useState({});  
    const [passError, setPassError] = useState(undefined);  
    const [emailError, setEmailError] = useState(undefined);
    const [button, setButton] = useState(true);

    const email = useRef(null);
    const pass = useRef(null);

    const history = useNavigate();

    const handlerInput = ({ target: { name, value } }) => {
      setUserData({ ...userData, [name]: value })
    }

    const handlerFocus = ()=>{
      email.current.value === '' ? (setEmailError(true)) : (setEmailError(false))
      pass.current.addEventListener('keyup',()=>{
        if(pass.current.value.length < 6){
        if(pass.current.value.length === 0 ){
          setPassError({error:true, message: "This field can't be empty"})
          setButton(true)
          return
        }
          setPassError({error:true, message: "At least 6 characters"})
          setButton(true)
        }else{
          setPassError(false)
          setButton(false)
        }
      })
    }
    
    const LogIn = (e) => {
      e.preventDefault();
      Register(userData).then(res => {
        res?.error ? 
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: res.message,
          showConfirmButton: false,
          timer: 2500
        })
        :
        (Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'register succesed',
          showConfirmButton: false,
          timer: 1500
        }),  history('/'))
      })
    };

    return (
    <div className="registerContainer">
      <h1>Register</h1>
      <form onSubmit={(e) => LogIn(e)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            ref={email}
            onFocus={handlerFocus}
            type="email"
            name="email"
            onChange={(e) => handlerInput(e)}
            placeholder="Email"
            required
            className={emailError ? 'error' : ''}
          />
        </div>
        { emailError ? <span> this field is required</span> : ''}
        <div>
          <label htmlFor="pass">Password</label>
          <input
          ref={pass}
          onFocus={handlerFocus}
            id="pass"
            type="password"
            min={6}
            name="pass"
            onChange={(e) => handlerInput(e)}
            placeholder="Password"
            required
          />
        </div>
        { passError?.error ? <span>{passError?.message}</span> : ''}
        <input disabled={button}  type="submit" value="Sign Up" className="register" />
      </form>
    </div>
  );
};
export default Register;
