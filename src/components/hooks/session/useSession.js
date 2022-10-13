import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../fbConfig/firebase-config';


const useSession = ()=>{
    const Register = async ({email, pass})=>{
        return new Promise(resolve => {
         createUserWithEmailAndPassword(auth, email, pass)
            .then(() => {
                resolve({error:false})
            })
            .catch(err => {
                resolve({error:true,message:err.message})
            })
        })
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