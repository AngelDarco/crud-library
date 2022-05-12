import './Login.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from '../../../context/Context';
import Main from '../../body/main/Main';
import LoginAuth from './LoginAuth';

const Login = ()=>{
    const [ usersData, setUsersData ] = useState({});
    const { userData, setUserData } = Auth();
    const { uid } = userData;

    const handlerInput = ({target})=>{
        setUsersData({
            ...usersData,[target.name] : target.value  
        })
    }

    const handlerSubmit = (ev)=>{
        ev.preventDefault();
        LoginAuth(usersData, setUserData)
    }

    return (
        <>
        {
            uid !== ''
            ? <Main/> 
            :
            <div className='loginContainer'>
            <h1>Login</h1>
            <form onSubmit={(e)=> handlerSubmit(e)}>
                <label htmlFor="email">email</label>
                <input onChange={(e)=>handlerInput(e)} type="email" name="email" id="email" />
                <label htmlFor="pass">pass</label>
                <input onChange={(e)=>handlerInput(e)} type="password" name="pass" id="pass" />
                <button type="submit">Login</button>
            <button className='register'><Link to='/register'>Log Up</Link></button>
            </form>
        </div>
        }
        </>
    )
}
export default Login;