import { signOut } from'firebase/auth';
import { auth } from '../../fetch/firebase-config';

const Logout = ()=>{
    const logOut = ()=>{
        signOut(auth)
        .then(() => console.log('exit success'))
        .catch( err => console.log(err))
    }
    return(
        <button onClick={()=>logOut()}>Log Out</button>
    )
}
export default Logout;