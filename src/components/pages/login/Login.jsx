import '../register/Register.scss';
import { useState } from 'react';
import FbLogin from './FbLogin';

const Login =()=>{
    const [data, setData ] = useState({});

    const inputValue =({target})=>{
        setData({...data,[target.name]:target.value})
    }

    const logIn = (e)=>{
        e.preventDefault();
        console.log(data)
        FbLogin(data);
    }

    return(
        <div className="containerLogin">
        <form onSubmit={(e)=> logIn(e)}>
            <div className="pass">
                <label htmlFor="email">Email</label>
                <input type="text" name='email' onChange={(e)=> inputValue(e)} placeholder='Email' />
            </div>
            <div className="user">
                <label htmlFor="pass">Password</label>
                <input type="password" name='pass' onChange={(e)=> inputValue(e)} placeholder='Password' />
            </div>
            <input type="submit" value="Sign Up" className='register' />
        </form> 
    </div>
    )
}
export default Login;