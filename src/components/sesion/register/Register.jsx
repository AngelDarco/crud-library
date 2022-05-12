import './Register.scss';
import { useState } from "react";
import RegisterAuth from './RegisterAuth';
import { Auth } from '../../../context/Context';
import Main from '../../body/main/Main';
import { Link } from 'react-router-dom';

const Register = () => {
    const [usersData, setUsersData] = useState({})

    const { userData } = Auth()
    const { uid } = userData;

    const handlerInput = ({ target }) => {
        setUsersData({ ...usersData, [target.name]: target.value });
    }
    const handlerSubmit = (event) => {
        event.preventDefault();
        RegisterAuth(usersData);
    }

    return (
        <>
            { 
                 uid !== ''
                ? <Main/> : 
                <div className="registerContainer">
                    <h1>Log Up</h1>
                    <form onSubmit={(e) => handlerSubmit(e)}>
                        <label htmlFor="email">email</label>
                        <input onChange={(e) => handlerInput(e)} type="email" name="email" id="email" />
                        <label htmlFor="pass">pass</label>
                        <input onChange={(e) => handlerInput(e)} type="password" name="pass" id="pass" />
                        <button type="submit">Log Up</button>
                        <button className='login'><Link to='/login'>Login</Link></button>
                    </form>
                </div>
            }
        </>
    )
}
export default Register;