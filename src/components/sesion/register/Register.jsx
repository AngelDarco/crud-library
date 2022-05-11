import './Register.scss';
import { useState } from "react";
import RegisterAuth from './RegisterAuth';
import { Auth } from '../../../context/Context';
import Main from '../../body/main/Main';

const Register = () => {
    const [userData, setUserData] = useState({})

    const { uid, user } = Auth()
    
    const handlerInput = ({ target }) => {
        setUserData({ ...userData, [target.name]: target.value });
    }
    const handlerSubmit = (event) => {
        event.preventDefault();
        RegisterAuth(userData);
    }

    return (
        <>
            { 
                 uid !== '' && user !== ''
                ? <Main/> : 
                <div className="registerContainer">
                    <h1>Log Up</h1>
                    <form onSubmit={(e) => handlerSubmit(e)}>
                        <label htmlFor="email">email</label>
                        <input onChange={(e) => handlerInput(e)} type="email" name="email" id="email" />
                        <label htmlFor="pass">pass</label>
                        <input onChange={(e) => handlerInput(e)} type="password" name="pass" id="pass" />
                        <button type="submit">Log Up</button>
                    </form>
                </div>
            }
        </>
    )
}
export default Register;