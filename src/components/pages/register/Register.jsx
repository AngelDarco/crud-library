import { useState } from 'react';
import './Register.scss';

import FbRegister from './FbRegister';

const Register = () => {
    const [userData, setUserData] = useState({});

const inputValue = ({target:{name,value}})=>{
    setUserData({...userData ,[name]: value})
}
const logIn = (e)=>{
    e.preventDefault();
    FbRegister(userData);
}
    console.log(userData)

    return (
        <div className="containerLogin">
            <form onSubmit={(e)=> logIn(e)}>
            {/* <div className="user">
                    <label htmlFor="user">User Name</label>
                    <input type="text" name='user' onChange={(e)=> inputValue(e.target)} placeholder='User' />
                </div> */}
                <div className="pass">
                    <label htmlFor="email">Email</label>
                    <input type="text" name='email' onChange={(e)=> inputValue(e)} placeholder='Email' />
                </div>
                <div className="user">
                    <label htmlFor="pass">Password</label>
                    <input type="password" name='pass' onChange={(e)=> inputValue(e)} placeholder='Password' />
                </div>
                <div className="pass2">
                    <label htmlFor="pass">Repit Password</label>
                    <input type="password" name='pass2' onChange={(e)=> inputValue(e)} placeholder='Password' />
                </div>
                <input type="submit" value="Sign Up" className='register' />
            </form> 
        </div>
    )
}
export default Register;