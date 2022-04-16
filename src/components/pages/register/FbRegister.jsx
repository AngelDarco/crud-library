import { createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../fetch/firebase-config';

const FbRegister = ({email, pass})=>{
    console.log(email,pass)
    createUserWithEmailAndPassword(auth, email, pass)
        .then( credentials => {
            console.log(credentials.user)
        })
        .catch(err => {
            console.log(err.message)
        })
    }
export default FbRegister;