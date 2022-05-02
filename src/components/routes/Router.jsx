import { Routes, Route } from "react-router-dom";
import Main from "../body/main/Main";
import Login from '../sesion/login/Login'

const Router = ()=>{
    return(
    <>
        <Routes>
            <Route path='/' element={<Main/>} />
            <Route path='/login' element={<Login/>} />
        </Routes>
    </>
    )
}
export default Router;