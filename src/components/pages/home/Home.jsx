//import { Auth } from "../../../context/Context";

//import Login from "../login/Login";
import Logout from "../logout/Logout";

//import Register from "../register/Register";

const Home = ()=>{
    /* const data = useAuth();
    !data.user ? data.user = "Invitado" : data.user 
    const { data } = Fetch();
    
    console.log(data)*/

    return(
        <>
            {/* <h1>Welcome Home ... {data.user}</h1> 
             <Register/> 
             <Login/>*/}
             <Logout/>
        </>
    )
}
export default Home;