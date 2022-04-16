import { createContext, useContext} from "react";

const context = createContext();
const userValue = {
    user: 'Darco',
    pass: '12345'
}

export const Auth = ()=>{
    return useContext(context)
}

export const AuthProvider = ({children})=>{
    return(
        <context.Provider value={userValue}>
            {children}
        </context.Provider>
    )
}