import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../fbConfig/firebase-config";

const LoginAuth = ({email, pass}, setUserData)=>{
    const sing = async ()=> await signInWithEmailAndPassword(auth, email, pass)
    .then(credentials => {
        setUserData({
            user: credentials.user.email,
            uid: credentials.user.uid
        })
    })
    .catch(err =>{
        console.log(err)
    })
    sing();
}
export default LoginAuth;