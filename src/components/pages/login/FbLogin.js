import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../fetch/firebase-config';

const FbLogin = ({email, pass})=>{
    signInWithEmailAndPassword(auth, email, pass)
    .then(credentials => {
        console.log(credentials);
    })
    .catch(err => {
        console.log(err.message);
        console.log(err.code);
    })
}
export default FbLogin;