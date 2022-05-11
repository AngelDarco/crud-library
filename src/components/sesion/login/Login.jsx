import './Login.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from '../../../context/Context';
import Main from '../../body/main/Main';

const Login = ()=>{
    const [ userData, setUserData ] = useState({});
    const userIds = Auth();
    const { uid, email } = userIds;

    const handlerInput = ({target})=>{
        setUserData({
            ...userData,[target.name] : target.value  
        })
    }

    const handlerSubmit = (ev)=>{
        ev.preventDefault();
        console.log(userData);
    }

    return (
        <>
        {
            uid !== '' && email !== ''
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