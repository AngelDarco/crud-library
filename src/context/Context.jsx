import { useEffect, useState, createContext, useContext} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../fbConfig/firebase-config";

const context = createContext();
const userValue = {
    uid: '',
    user: '',
}

export const Auth = ()=>{
    return useContext(context)
}

export const AuthProvider = ({children })=>{
    const [ userData, setUserData ] = useState(userValue);

    useEffect(()=>{
        (async ()=> {
            await onAuthStateChanged(auth, currentUser =>{
                currentUser ?
                setUserData({
                    uid: currentUser.uid,
                    user: currentUser.email,
                })
                :
                setUserData({
                    uid: '',
                    user: ''
                })
            })
        })()
        return ()=> setUserData(userValue)
    },[])

    return(
        <context.Provider value={ { userData, setUserData } }>
            {children}
        </context.Provider>
    )
}