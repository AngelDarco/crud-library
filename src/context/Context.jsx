import { useEffect, useState, createContext, useContext} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../fbConfig/firebase-config";

const context = createContext();
const userValue = {
    uid: '',
    user: '',
    likes: false 
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
                    likes: localStorage.getItem(currentUser.uid)
                })
                :
                setUserData({
                    uid: '',
                    user: ''
                })
            })
        })()
    },[])

    return(
        <context.Provider value={ { userData, setUserData } }>
            {children}
        </context.Provider>
    )
}