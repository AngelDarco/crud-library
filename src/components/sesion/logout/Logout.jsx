import { signOut } from "firebase/auth";
import { auth } from "../../../fbConfig/firebase-config";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../../assets/loading/Loading";

const Logout = ()=>{
    const navigate = useNavigate();
    (async ()=> { 
        try {
            await signOut( auth )
        } catch (err) {
            console.log(err)
        }
    })();
    
        useEffect(()=> {
            setTimeout(() => {
                navigate("/");
            }, 1000);
        },[]);
    return(
        <Loading/>
    )
}
export default Logout;