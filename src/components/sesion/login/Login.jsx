import './Login.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from '../../../context/Context';
import Main from '../../body/main/Main';
import useSession from '../../hooks/session/useSession';
import Swal from 'sweetalert2';

const Login = ()=>{
    
    const { userData, setUserData } = Auth();
    const { uid } = userData;
    const { Login } = useSession();
    const  LoginAuth = Login()
    const [ usersData, setUsersData ] = useState({});
    const handlerInput = ({target})=>{
        setUsersData({
            ...usersData,[target.name] : target.value  
        })
    }

    const handlerSubmit = (ev)=>{
        ev.preventDefault();
        LoginAuth(usersData, setUserData)
        .then(({res, message}) => {
            res 
            ? Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Access Granted ...',
                showConfirmButton: false,
                timer: 1500
              })
              : 
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: message,
                showConfirmButton: false,
                timer: 1500
              })

        })
        .catch(err=> console.log(err))
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
                <div>
                <label htmlFor="email">email</label>
                <input onChange={(e)=>handlerInput(e)} type="email" name="email" id="email" />
                </div>
                <div>
                <label htmlFor="pass">pass</label>
                <input onChange={(e)=>handlerInput(e)} type="password" name="pass" id="pass" />
                </div>
                <button className='register' type="submit">Login</button>
                <button className='register'><Link to='/register'>Log Up</Link></button>
            </form>
        </div>
        }
        </>
    )
}
export default Login;