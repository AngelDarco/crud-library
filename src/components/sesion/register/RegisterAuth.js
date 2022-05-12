import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../fbConfig/firebase-config";

const RegisterAuth = ({email, pass})=>{
    createUserWithEmailAndPassword(auth, email, pass)
    /* .then(data => {
        console.log(data)
    }) */
    .catch(err => {
        console.log(err, err.message);
    })
}
export default RegisterAuth;