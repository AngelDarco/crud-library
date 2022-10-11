import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { auth } from '../../../fbConfig/firebase-config';


const useSession = ()=>{
    const [ message, setMessage ] = useState({});
    const Register = ({email, pass})=>{
    
        createUserWithEmailAndPassword(auth, email, pass)
            .then( credentials => {
                console.log(credentials)
                setMessage({error: false, message: 'success'})
            })
            .catch(err => {
                console.log(err)
                setMessage({error: true, message: err.message})
            })
            return message
        }

        const Login = ()=>{
            const LoginAuth = ({email, pass}, setUserData) =>{
                return new Promise(resolve => 
                    signInWithEmailAndPassword(auth, email, pass)
                        .then(credentials => {
                            setUserData({
                                user: credentials.user.email,
                                uid: credentials.user.uid
                            })
                            resolve({res:true,message:''});
                        })
                        .catch(err =>{
                           resolve({res:false,message:err.message})
                        })
                )
        }
            return LoginAuth
        }

        return { Register, Login }
}
export default useSession;