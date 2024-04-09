import { Routes, Route } from "react-router-dom";
import Main from "../body/main/Main";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Logout from "../pages/logout/Logout";
import AddBooks from "../pages/addBooks/AddBooks";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addBook" element={<AddBooks />} />
      </Routes>
    </>
  );
};
export default Router;
